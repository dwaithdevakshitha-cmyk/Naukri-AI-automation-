document.getElementById("analyzeBtn").addEventListener("click", async () => {
    const jd = document.getElementById("jdInput").value;

    if (!jd.trim()) {
        alert("Please paste Job Description");
        return;
    }

    const output = document.getElementById("result");
    output.innerText = "⏳ Analyzing...";

    try {
        const res = await fetch("http://localhost:3333/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jd })
        });

        const data = await res.json();

        // ✅ THIS IS THE FIX
        output.innerText = JSON.stringify(data, null, 2);

    } catch (err) {
        output.innerText = "❌ Failed to extract details";
        console.error(err);
    }
});
