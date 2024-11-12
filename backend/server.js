const express = require("express");
const multer = require("multer");
const fs = require("fs");
const diff = require("diff");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());

const upload = multer({ dest: "uploads/" });

// Load the sample document
const sampleText = fs.readFileSync("sample.txt", "utf-8");

app.post("/compare", upload.single("document"), (req, res) => {
  const uploadedFilePath = req.file.path;

  fs.readFile(uploadedFilePath, "utf-8", (err, uploadedText) => {
    if (err)
      return res.status(500).json({ error: "Error reading uploaded file" });

    // Use diff library to compute differences with more detail
    const differences = diff.diffWordsWithSpace(sampleText, uploadedText);

    // Prepare detailed comparison result in HTML format
    let resultHTML = "<div class='comparison'>";
    let totalChanges = 0;
    let totalWords = sampleText.split(/\s+/).length;

    differences.forEach((part) => {
      const color = part.added
        ? "text-green-600"
        : part.removed
        ? "text-red-600"
        : "text-gray-800";
      resultHTML += `<span class="${color}">${part.value}</span>`;

      // Track number of changes
      if (part.added || part.removed) {
        totalChanges += part.value.split(/\s+/).length;
      }
    });
    resultHTML += "</div>";

    // Calculate similarity score
    const similarity = (
      ((totalWords - totalChanges) / totalWords) *
      100
    ).toFixed(2);

    res.json({ differences: resultHTML, similarity: `${similarity}%` });

    // Remove the uploaded file
    fs.unlink(uploadedFilePath, (err) => {
      if (err) console.log("Error deleting file:", err);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
