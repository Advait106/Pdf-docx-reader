const express = require("express");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const mammoth = require("mammoth");
const fs = require("fs/promises");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Storage folder
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
});

// ------- Helper: Better Heading Extraction ----------
function extractHeadings(text) {
  const lines = text.split("\n");

  return lines
    .map((line) => line.trim())
    .filter((line) => {
      if (!line) return false;

      const isUpperCase = line === line.toUpperCase();
      const titleCase = /^[A-Z][A-Za-z0-9\s:,-]+$/.test(line);

      return isUpperCase || titleCase;
    });
}

// ------- Upload Route ----------
app.post("/upload", upload.single("file"), async (req, res) => {
  console.log("\x1b[36m[UPLOAD HIT]\x1b[0m");
  console.log("FILE:", req.file);

  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = req.file.path;
  const ext = path.extname(req.file.originalname).toLowerCase();

  try {
    let text = "";
    let totalPages = 0;

    if (ext === ".pdf") {
      const data = await pdfParse(await fs.readFile(filePath));
      text = data.text;
      totalPages = data.numpages;

    } else if (ext === ".docx") {
      const result = await mammoth.extractRawText({ path: filePath });
      text = result.value;
      totalPages = "Docx pages can't be counted accurately";

    } else {
      return res.status(400).json({ message: "Only PDF & DOCX supported" });
    }

    const headings = extractHeadings(text);

    res.json({
      fileName: req.file.originalname,
      totalPages,
      headings,
    });

  } catch (err) {
    console.error("\x1b[31m[SERVER ERROR]\x1b[0m", err);
    return res.status(500).json({
      message: "Error reading file",
      error: err.toString(),
    });
  } finally {
    // Delete file after processing
    try {
      await fs.unlink(filePath);
      console.log("\x1b[32m[FILE CLEANED]\x1b[0m", filePath);
    } catch {}
  }
});

// -------- Start Server --------
app.listen(5000, () => {
  console.log("\x1b[32mServer running on http://localhost:5000\x1b[0m");
});
