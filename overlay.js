export async function injectOverlay(page) {
    await page.evaluate(() => {
        if (document.getElementById("jd-overlay")) {
            document.getElementById("jd-overlay").style.display = "flex";
            return;
        }

        const panel = document.createElement("div");
        panel.id = "jd-overlay";
        panel.innerHTML = `
            <div class="overlay-header">
                <div class="header-main">
                    <span class="sparkle">✨</span>
                    <h3>JD Smart Analyzer</h3>
                </div>
                <button id="close-overlay">×</button>
            </div>
            <div class="overlay-body">
                <p class="subtitle">Paste the Job Description below to extract search criteria</p>
                <textarea id="jd-input" placeholder="Paste job description here..."></textarea>
                <button id="submit-jd">
                    <span class="btn-text">Extract Details</span>
                    <div class="spinner" id="btn-spinner" style="display:none"></div>
                </button>
                <div id="jd-result-container" style="display:none">
                    <label>Extraction Result:</label>
                    <pre id="jd-result"></pre>
                </div>
            </div>
        `;

        const style = document.createElement("style");
        style.textContent = `
            #jd-overlay {
                position: fixed;
                top: 20px;
                right: 20px;
                width: 400px;
                max-height: calc(100vh - 40px);
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(37, 99, 235, 0.2);
                border-radius: 16px;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                display: flex;
                flex-direction: column;
                z-index: 2147483647;
                font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
                overflow: hidden;
                animation: slideIn 0.3s ease-out;
            }

            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }

            .overlay-header {
                padding: 16px 20px;
                background: linear-gradient(135deg, #1e40af 0%, #2563eb 100%);
                color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .header-main {
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .header-main h3 {
                margin: 0;
                font-size: 18px;
                font-weight: 600;
                letter-spacing: -0.5px;
            }

            #close-overlay {
                background: transparent;
                border: none;
                color: rgba(255, 255, 255, 0.8);
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                line-height: 1;
            }

            #close-overlay:hover { color: white; }

            .overlay-body {
                padding: 20px;
                display: flex;
                flex-direction: column;
                gap: 12px;
                overflow-y: auto;
            }

            .subtitle {
                margin: 0;
                font-size: 13px;
                color: #64748b;
            }

            #jd-input {
                width: 100%;
                height: 250px;
                padding: 12px;
                border: 1.5px solid #e2e8f0;
                border-radius: 10px;
                font-size: 14px;
                resize: none;
                transition: border-color 0.2s;
                box-sizing: border-box;
            }

            #jd-input:focus {
                outline: none;
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }

            #submit-jd {
                width: 100%;
                padding: 12px;
                background: #2563eb;
                color: white;
                border: none;
                border-radius: 10px;
                font-weight: 600;
                font-size: 15px;
                cursor: pointer;
                transition: all 0.2s;
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 8px;
            }

            #submit-jd:hover {
                background: #1d4ed8;
                transform: translateY(-1px);
                box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            }

            #submit-jd:active { transform: translateY(0); }

            #jd-result-container {
                margin-top: 8px;
                padding-top: 16px;
                border-top: 1px solid #f1f5f9;
            }

            #jd-result-container label {
                display: block;
                font-size: 12px;
                font-weight: 700;
                color: #475569;
                text-transform: uppercase;
                margin-bottom: 8px;
            }

            #jd-result {
                margin: 0;
                padding: 12px;
                background: #f8fafc;
                border-radius: 8px;
                font-family: 'Consolas', monospace;
                font-size: 13px;
                color: #1e293b;
                white-space: pre-wrap;
                border: 1px solid #e2e8f0;
            }

            .spinner {
                width: 18px;
                height: 18px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top-color: white;
                animation: spin 0.8s linear infinite;
            }

            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;

        document.body.appendChild(style);
        document.body.appendChild(panel);

        document.getElementById("close-overlay").onclick = () => {
            panel.style.display = "none";
        };
    });
}
