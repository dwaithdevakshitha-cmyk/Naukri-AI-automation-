import express from "express";
import { extractJD } from "./ai/jdExtractor.js";
import { goToRecruiterPage } from "./browser/goToRecruiter.js";
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
            font-family: 'Inter', 'Segoe UI', sans-serif; 
            background: #f1f5f9; 
            margin: 0;
            padding: 0;
            height: 100vh;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        .header-bar {
            background: #2563eb;
            color: white;
            padding: 15px 30px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
        }
        .header-bar h2 { margin: 0; font-size: 20px; font-weight: 600; }
        .main-content {
            display: flex;
            flex: 1;
            padding: 24px;
            gap: 24px;
            overflow: hidden;
        }
        .input-section {
            flex: 1;
            display: flex;
            flex-direction: column;
            background: white;
            padding: 24px;
            border-radius: 16px;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
        }
        .result-section {
            flex: 1;
            background: white;
            padding: 24px;
            border-radius: 16px;
            display: flex;
            flex-direction: column;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            overflow-y: auto;
        }
        textarea { 
            flex: 1;
            width: 100%; 
            padding: 16px; 
            border: 2px solid #e2e8f0; 
            border-radius: 12px; 
            font-size: 15px; 
            resize: none; 
            box-sizing: border-box;
            transition: all 0.2s;
            margin-bottom: 20px;
            font-family: inherit;
            line-height: 1.5;
        }
        textarea:focus { outline: none; border-color: #2563eb; ring: 2px solid rgba(37,99,235,0.2); }
        .btn-container {
            display: flex;
            justify-content: flex-end;
        }
        button { 
            padding: 14px 32px; 
            background: #2563eb; 
            color: white; 
            border: none; 
            border-radius: 10px; 
            font-weight: 600; 
            font-size: 15px; 
            cursor: pointer; 
            transition: all 0.2s;
            box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);
        }
        button:hover { background: #1d4ed8; transform: translateY(-1px); }
        button:disabled { background: #94a3b8; cursor: not-allowed; transform: none; box-shadow: none; }
        
        h3 { margin-top: 0; color: #475569; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 12px; font-weight: 700; }
        
        /* Form Fields Styling */
        .form-group { margin-bottom: 20px; }
        .form-label { display: block; font-size: 13px; font-weight: 600; color: #64748b; margin-bottom: 8px; }
        .form-input { 
            width: 100%; 
            padding: 12px 16px; 
            background: #f8fafc;
            border: 1px solid #cbd5e1; 
            border-radius: 8px; 
            font-size: 14px; 
            color: #1e293b;
            box-sizing: border-box;
        }
        
        .row { display: flex; gap: 20px; }
        .col { flex: 1; }
        
        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 12px;
            background: #f8fafc;
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            min-height: 60px;
        }
        .skill-tag {
            background: #dbeafe;
            color: #1e40af;
            padding: 4px 10px;
            border-radius: 6px;
            font-size: 13px;
            font-weight: 500;
        }
        
        #loading-overlay {
            display: none;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: #64748b;
            font-style: italic;
        }
        
        #result-form { display: none; }
        
      </style>
    </head>
    <body>
      <div class="header-bar">
        <h2>JD Analyzer Pro</h2>
        <span style="opacity:0.8; font-size:13px">v2.0 UI</span>
      </div>

      <div class="result-section">
            <h3>Extracted Intelligence</h3>
            
            <div id="loading-overlay">
                Waiting for analysis...
            </div>

            <div id="result-form">
                <div class="form-group">
                    <label class="form-label">Job Location</label>
                    <input type="text" id="res-location" class="form-input" readonly>
                </div>

                <div class="row">
                    <div class="col form-group">
                        <label class="form-label">Min Experience</label>
                        <input type="text" id="res-min-exp" class="form-input" readonly>
                    </div>
                    <div class="col form-group">
                        <label class="form-label">Max Experience</label>
                        <input type="text" id="res-max-exp" class="form-input" readonly>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">Technical Skills</label>
                    <div id="res-skills" class="skills-container"></div>
                </div>
                
                <!-- NEW SUBMIT BUTTON -->
                <div class="btn-container" style="margin-top: 20px;">
                    <button id="submit-automation-btn" style="width:100%; background:#059669;" onclick="triggerAutomation()">✅ Confirm & Submit</button>
                </div>
            </div>
        </div>
      </div>

      <script>
        async function submitJD() {
          const jd = document.getElementById('jd').value;
          if(!jd.trim()) return;
          
          const btn = document.getElementById('s-btn');
          const form = document.getElementById('result-form');
          const loading = document.getElementById('loading-overlay');
          
          btn.disabled = true;
          btn.innerText = 'Processing...';
          
          form.style.display = 'none';
          loading.style.display = 'flex';
          loading.innerText = '⚡ AI Extracting...';
          
          try {
            const resp = await fetch('/analyze', {
              method:'POST',
              headers:{'Content-Type':'application/json'},
              body: JSON.stringify({ jd })
            });
            const data = await resp.json();
            
            if(data.ok && data.result) {
                const res = data.result;
                
                document.getElementById('res-location').value = res.location || 'Unknown';
                document.getElementById('res-min-exp').value = res.min_experience;
                document.getElementById('res-max-exp').value = res.max_experience;
                
                const skillsContainer = document.getElementById('res-skills');
                skillsContainer.innerHTML = '';
                if(res.skills && res.skills.length > 0) {
                    res.skills.forEach(skill => {
                        const tag = document.createElement('span');
                        tag.className = 'skill-tag';
                        tag.innerText = skill;
                        skillsContainer.appendChild(tag);
                    });
                } else {
                     skillsContainer.innerHTML = '<span style="color:#94a3b8; font-size:13px; padding:4px;">No specific skills found</span>';
                }

                loading.style.display = 'none';
                form.style.display = 'block';
                
                // Immediate unlock
                btn.disabled = false;
                btn.innerText = 'Analyze & Extract';
                
                // --- AUTO TRIGGER ---
                triggerAutomation(res);
            } else {
                throw new Error(data.error || 'Unknown error');
            }
            
          } catch (e) {
            alert('Error: ' + e.message);
            btn.disabled = false;
            btn.innerText = 'Analyze & Extract';
            loading.innerText = '❌ Failed.';
          }
        }

        async function triggerAutomation(data) {
            console.log("Triggering automation with:", data);
            try {
                await fetch('/process-automation', {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify({ data })
                });
            } catch(e) {
                console.error("Auto-trigger failed", e);
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

// NEW ROUTE TO TRIGGER AUTOMATION
app.post("/process-automation", async (req, res) => {
  console.log("🤖 Received automation trigger. Executing Python navigation...");

  // We import exec here to avoid top-level blocking or issues
  const { exec } = await import("child_process");

  // Execute the Python script
  exec("python automation/trigger_navigation.py", (error, stdout, stderr) => {
    if (error) {
      console.error(`❌ Automation Error: ${error.message}`);
      return res.status(500).json({ ok: false, error: error.message });
    }
    if (stderr) {
      console.error(`⚠️ Automation Stderr: ${stderr}`);
    }
    console.log(`✅ Automation Output: ${stdout}`);
    res.json({ ok: true });
  });
});

app.listen(3333, () =>
  console.log("🚀 JD Analyzer Server running on http://localhost:3333/gui")
);
