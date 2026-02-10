import { exec, fork } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function startServer() {
    console.log("STARTUP: Initializing JD Analyzer Server (Port 3333)...");
    const serverProcess = fork(path.join(__dirname, "server.js"), [], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    });
    return serverProcess;
}

function runLauncherLogin() {
    return new Promise((resolve) => {
        console.log("STEP 1: Starting Naukri Automation (Login & Popups)...");
        exec("python desktop/naukri_launcher_login.py", (err, stdout, stderr) => {
            if (err) {
                console.warn("LOGIN NOTICE:", stdout || stderr || err.message);
            } else {
                console.log("SUCCESS: Login/Popup sequence finished.");
                if (stdout) console.log(stdout.trim());
            }
            resolve();
        });
    });
}

async function ensureGUIOpen() {
    console.log("STEP 2: Synchronizing JD Analyzer GUI...");
    const GUI_URL = "http://localhost:3333/gui";

    try {
        const browser = await chromium.connectOverCDP("http://localhost:9222").catch(() => null);

        if (browser) {
            const contexts = browser.contexts();
            let guiTab = null;

            for (const context of contexts) {
                for (const page of context.pages()) {
                    if (page.url().includes("localhost:3333/gui")) {
                        guiTab = page;
                        break;
                    }
                }
                if (guiTab) break;
            }

            if (guiTab) {
                console.log("GUI: JD Analyzer already open. Bringing to front...");
                await guiTab.bringToFront();
                try { await guiTab.evaluate(() => { window.focus(); }); } catch (e) { }
            } else {
                console.log("GUI: Opening new JD Analyzer tab...");
                const context = contexts[0] || await browser.newContext();
                const newPage = await context.newPage();
                await newPage.goto(GUI_URL, { waitUntil: 'domcontentloaded' });
                await newPage.bringToFront();
            }
            // Keep connection alive silently, do not close browser
        } else {
            console.log("GUI: Browser not detected via CDP. Opening in default browser...");
            exec(`start ${GUI_URL}`);
        }
    } catch (err) {
        console.warn("GUI NOTICE:", err.message);
        exec(`start ${GUI_URL}`);
    }
}

(async () => {
    try {
        // Start Backend
        startServer();
        await new Promise(r => setTimeout(r, 2000));

        // Start Naukri Flow
        await runLauncherLogin();

        // Focus GUI
        await ensureGUIOpen();

        console.log("--------------------------------------------------");
        console.log("🚀 ALL SYSTEMS LIVE");
        console.log("You can now begin extracting job descriptions.");
        console.log("Keep this window open to monitor automation logs.");
        console.log("--------------------------------------------------");

        // Keep the process alive indefinitely
        setInterval(() => { }, 60000);

    } catch (err) {
        console.error("FATAL STARTUP ERROR:", err);
        process.exit(1);
    }
})();
