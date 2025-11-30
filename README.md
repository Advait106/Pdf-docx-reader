📄 PDF & DOCX Reader – Headings, Styles & Page Extractor

A simple full-stack application that allows users to upload PDF and DOCX documents and extracts:

✅ Text
✅ Headings
✅ Bold text (DOCX only)
✅ Page count
✅ Clean UI (React + TypeScript)

This tool processes documents and extracts useful structured information.

🚀 Features
Frontend (React + TypeScript)

Upload PDF/DOCX files

Shows:
File name
Total pages
Auto-detected headings
Bold text (DOCX)
Clean modern UI (NO Tailwind)
Uses Axios to call backend API
Backend (Node.js + Express)
File upload using Multer
PDF extraction using pdf-parse
DOCX extraction using mammoth

Extracts:
Heading-like content using regex
Bold text from DOCX using mammoth style parsing

📂 Folder Structure
Pdf-docx-reader/
│
├── backend/
│   ├── server.js
│   ├── uploads/
│   ├── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.css
│   ├── package.json
│
└── README.md

🛠️ Tech Stack
Frontend

React (TypeScript)
Axios
Basic CSS styling
Lucide Icons (optional)

Backend
Node.js
Express
Multer
pdf-parse
mammoth

⚙️ Installation & Running
1️⃣ Clone the repository
git clone https://github.com/Advait106/Pdf-docx-reader
cd Pdf-docx-reader

🔧 Backend Setup
cd backend
npm install
node server.js


Backend available at:

http://localhost:5000

🎨 Frontend Setup
cd frontend
npm install
npm start


Frontend available at:

http://localhost:3000

📤 API Documentation
POST /upload

Uploads a PDF or DOCX and extracts text.

Request
Type: multipart/form-data

file: <PDF or DOCX file>
Response Example
{
  "fileName": "example.pdf",
  "totalPages": 4,
  "headings": ["INTRODUCTION", "METHODOLOGY", "RESULTS"],
  "boldText": ["ABSTRACT", "CONCLUSION"]
}
