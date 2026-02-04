import { exec, fork } from "child_process";
import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Starts the backend server
 */
function startServer() {
    console.log("🚀 Starting JD Analyzer Server...");
    const serverProcess = fork(path.join(__dirname, "server.js"), [], {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc']
    });
    return serverProcess;
}

/**
 * 1. Launches the Naukri desktop app and logs in.
 */
function runLauncherLogin() {
    return new Promise((resolve, reject) => {
        console.log("🔐 Starting Naukri Launcher automation...");
        exec("python desktop/naukri_launcher_login.py", (err, stdout, stderr) => {
            if (err) {
                console.error("❌ Python failed:", stderr);
                reject(err);
            } else {
                console.log("✅ Launcher login finished.");
                resolve();
            }
        });
    });
}

/**
 * 2. Main flow: Login, then open the GUI in a real browser tab.
 */
(async () => {
    try {
        // Step 0: Start the Server
        startServer();

        // Step 1: Login through desktop app
        await runLauncherLogin();

        // Give time for the launcher to settle and open the main window
        console.log("⏳ Waiting for Naukri to initialize...");
        await new Promise(r => setTimeout(r, 15000));

        // Step 2: Open the GUI in the system's default browser (Chrome) 
        console.log("🌐 Opening JD Analyzer in a new browser tab...");
        exec("start http://localhost:3333/gui");

        // Step 3: Connect to the launcher's debug port for background navigation automation
        console.log("🔗 Connecting to Naukri Launcher for background automation...");
        try {
            const browser = await chromium.connectOverCDP("http://localhost:9222");
            const contexts = browser.contexts();
            if (contexts.length > 0) {
                const pages = contexts[0].pages();
                const naukriPage = pages.find(p => p.url().includes("recruit.naukri.com"));
                if (naukriPage) {
                    console.log("🎯 Naukri tab detected and ready for automation commands.");
                }
            }
        } catch (cdpErr) {
            console.log("ℹ️ (Optional) Could not attach to CDP yet.");
        }

        console.log("🚀 Everything is ready! Use the JD Analyzer tab in Chrome.");

    } catch (err) {
        console.error("🔥 Fatal Error in start.js:", err);
    }
})();
