export async function openGuiTab(browser) {
    // Try browser.newPage() instead of context.newPage()
    const page = await browser.newPage();

    await page.setContent(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>JD Analyzer Pro</title>
            <style>
                body {
                    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
                    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
                    margin: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    color: #1e293b;
                }
                .container {
                    background: white;
                    padding: 40px;
                    border-radius: 24px;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.1);
                    width: 700px;
                    max-width: 90%;
                }
                .header {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 24px;
                }
                .logo {
                    background: #2563eb;
                    color: white;
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 20px;
                }
                h2 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 700;
                    letter-spacing: -0.5px;
                }
                p {
                    color: #64748b;
                    margin-bottom: 24px;
                    font-size: 15px;
                }
                textarea {
                    width: 100%;
                    height: 300px;
                    padding: 16px;
                    border: 2px solid #e2e8f0;
                    border-radius: 16px;
                    font-size: 14px;
                    resize: none;
                    transition: border-color 0.2s, box-shadow 0.2s;
                    box-sizing: border-box;
                    margin-bottom: 24px;
                }
                textarea:focus {
                    outline: none;
                    border-color: #2563eb;
                    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
                }
                button {
                    width: 100%;
                    padding: 16px;
                    background: #2563eb;
                    color: white;
                    border: none;
                    border-radius: 16px;
                    font-weight: 600;
                    font-size: 16px;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 8px;
                }
                button:hover {
                    background: #1d4ed8;
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px -3px rgba(37, 99, 235, 0.3);
                }
                #out {
                    margin-top: 32px;
                    padding: 20px;
                    background: #f1f5f9;
                    border-radius: 16px;
                    font-family: 'Consolas', monospace;
                    font-size: 14px;
                    display: none;
                    white-space: pre-wrap;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">AI</div>
                    <h2>JD Analyzer Pro</h2>
                </div>
                <p>Paste the Job Description below to extract skills, experience, and location dynamically.</p>
                <textarea id="jd" placeholder="Paste Job Description here..."></textarea>
                <button id="submit-btn" onclick="submitJD()">Extract details with LLaMA 3</button>
                <pre id="out"></pre>
            </div>

            <script>
                function submitJD() {
                    const val = document.getElementById("jd").value;
                    if (!val.trim()) return;
                    
                    document.getElementById("submit-btn").disabled = true;
                    document.getElementById("submit-btn").innerText = "Analyzing...";
                    window.jdText = val;
                }
                
                function showResult(data) {
                    const out = document.getElementById("out");
                    out.style.display = "block";
                    out.innerText = JSON.stringify(data, null, 2);
                    document.getElementById("submit-btn").innerText = "Analysis Complete";
                }
            </script>
        </body>
        </html>
    `);

    return page;
}
