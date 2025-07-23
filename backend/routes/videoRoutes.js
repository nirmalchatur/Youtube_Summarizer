const express = require("express");
const router = express.Router();
const { spawn } = require("child_process");
const path = require("path");

// Helper function to run a Python script with stdin input
function runPythonScript(scriptPath, inputText) {
  return new Promise((resolve, reject) => {
    const python = spawn("python", [scriptPath]);

    let output = "";
    let errorOutput = "";

    python.stdout.on("data", data => {
      output += data.toString();
    });

    python.stderr.on("data", data => {
      errorOutput += data.toString();
    });

    python.on("close", code => {
      if (errorOutput) {
        console.error("❌ Python error output:", errorOutput);
      }
      try {
        const parsed = JSON.parse(output);
        if (parsed.error) {
          return reject({ error: "❌ Summary generation failed in Python", details: parsed });
        }
        resolve(parsed);
      } catch (e) {
        reject({ error: "❌ Failed to parse Python output", details: output });
      }
    });

    python.stdin.write(inputText);
    python.stdin.end();
  });
}
router.post("/ask", async (req, res) => {
  const { question, transcript } = req.body;
  const prompt = `Based on the video transcript:\n${transcript}\nAnswer this question:\n${question}`;
  
  const response = await openai.createChatCompletion({ });
  res.json({ answer: response.data });
});

router.get("/", (req, res) => {
  res.send("🎥 Video route is working!");
});

router.post("/process-video", async (req, res) => {
  const { videoUrl } = req.body;
  if (!videoUrl) {
    return res.status(400).json({ error: "⚠️ 'videoUrl' is required in the request body" });
  }

  const transcriptScript = path.join(__dirname, "..", "scripts", "transcript_fetcher.py");
  const summaryScript = path.join(__dirname, "..", "scripts", "summarizer.py");

  try {
    const transcriptProcess = spawn("python", [transcriptScript, videoUrl]);

    let transcriptData = "";
    let errorData = "";

    transcriptProcess.stdout.on("data", chunk => {
      transcriptData += chunk.toString();
    });

    transcriptProcess.stderr.on("data", chunk => {
      errorData += chunk.toString();
    });

    transcriptProcess.on("close", async () => {
      if (errorData) {
        console.error("Transcript Python Error:", errorData);
        return res.status(500).json({ error: "❌ Transcript fetch error" });
      }

      let parsedTranscript;
      try {
        parsedTranscript = JSON.parse(transcriptData);
      } catch (e) {
        return res.status(500).json({ error: "❌ Failed to parse transcript JSON" });
      }

      if (parsedTranscript.error) {
        return res.status(500).json({ error: parsedTranscript.error });
      }

      try {
        const summaryResult = await runPythonScript(summaryScript, parsedTranscript.transcript);
        return res.status(200).json({
          transcript: parsedTranscript.transcript,
          summary: summaryResult.summary
        });
      } catch (e) {
        console.error("Summary script error:", e);
        return res.status(500).json({ error: "❌ Summary generation failed", details: e });
      }
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "❌ Internal Server Error" });
  }
});

module.exports = router;
