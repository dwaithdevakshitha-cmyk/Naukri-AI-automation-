import express from "express";
import { extractJD } from "./ai/jdExtractor.js";
import path from "path";

const app = express();
app.use(express.json());

// Serve the GUI HTML directly
app.get("/gui", (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>JD Analyzer Pro</title>
      <style>
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            background: #f8fafc; 
            margin: 0;
            padding: 0;
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .header-bar {
            background: #1a73e8;
            color: white;
            padding: 15px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .header-bar h2 { margin: 0; font-size: 20px; }
        .main-content {
            display: flex;
            flex: 1;
            padding: 20px;
            gap: 20px;
            overflow: hidden;
        }
        .input-section {
            flex: 1.2;
            display: flex;
            flex-direction: column;
            background: white;
            padding: 24px;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .result-section {
            flex: 0.8;
            background: #1e293b;
            color: #f8fafc;
            padding: 24px;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        textarea { 
            flex: 1;
            width: 100%; 
            padding: 18px; 
            border: 2px solid #e2e8f0; 
            border-radius: 12px; 
            font-size: 16px; 
            resize: none; 
            box-sizing: border-box;
            transition: border-color 0.3s;
            margin-bottom: 20px;
            font-family: inherit;
        }
        textarea:focus { outline: none; border-color: #1a73e8; }
        .btn-container {
            display: flex;
            justify-content: flex-end;
        }
        button { 
            padding: 16px 40px; 
            background: #1a73e8; 
            color: white; 
            border: none; 
            border-radius: 10px; 
            font-weight: 600; 
            font-size: 16px; 
            cursor: pointer; 
            transition: all 0.2s;
        }
        button:hover { background: #1557b0; transform: translateY(-1px); }
        button:disabled { background: #cbd5e1; cursor: not-allowed; transform: none; }
        h3 { margin-top: 0; color: #94a3b8; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; }
        #out { 
            flex: 1;
            font-family: 'JetBrains Mono', 'Fira Code', monospace; 
            font-size: 14px; 
            white-space: pre-wrap; 
            margin: 0; 
            overflow-y: auto;
            color: #38bdf8;
            padding: 10px;
        }
        .placeholder-text {
            color: #64748b;
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 1;
            text-align: center;
            font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="header-bar">
        <h2>JD Analyzer Pro Dashboard</h2>
        <span>v1.0.4</span>
      </div>

      <div class="main-content">
        <div class="input-section">
            <h3>Job Description</h3>
            <textarea id="jd" placeholder="Paste the Job Description here to start the extraction process..."></textarea>
            <div class="btn-container">
                <button id="s-btn" onclick="submitJD()">Analyze & Extract Details</button>
            </div>
        </div>
        
        <div class="result-section">
            <h3>Extraction Result</h3>
            <div id="placeholder" class="placeholder-text">Click 'Analyze' to see structured job data here...</div>
            <pre id="out" style="display:none"></pre>
        </div>
      </div>

      <script>
        async function submitJD() {
          const jd = document.getElementById('jd').value;
          if(!jd.trim()) return;
          
          const btn = document.getElementById('s-btn');
          const out = document.getElementById('out');
          const placeholder = document.getElementById('placeholder');
          
          btn.disabled = true;
          btn.innerText = '🤖 AI Extracting...';
          placeholder.style.display = 'none';
          out.style.display = 'block';
          out.innerText = '// Processing request...';
          
          try {
            const resp = await fetch('/analyze', {
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ jd })
            });
            const data = await resp.json();
            
            const result = typeof data.result === 'string' ? data.result : JSON.stringify(data.result, null, 2);
            out.innerText = result;
            btn.innerText = 'Extraction Complete';
            setTimeout(() => {
                btn.disabled = false;
                btn.innerText = 'Analyze & Extract Details';
            }, 3000);
          } catch (e) {
            alert('Error: ' + e.message);
            btn.disabled = false;
            btn.innerText = 'Analyze & Extract Details';
            placeholder.style.display = 'flex';
            out.style.display = 'none';
          }
        }
      </script>
    </body>
    </html>
    `);
});

app.post("/analyze", async (req, res) => {
    try {
        const result = await extractJD(req.body.jd);
        console.log("LLM RESULT:", result);
        res.json({ ok: true, result });
    } catch (e) {
        console.error("❌ Extraction Error:", e);
        res.status(500).json({ ok: false, error: e.message });
    }
});

app.listen(3333, () =>
    console.log("🚀 JD Analyzer Server running on http://localhost:3333/gui")
);
