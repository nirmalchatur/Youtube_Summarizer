

---

# 🎥 Video Summarizer Web App

A full-stack application that transforms YouTube videos into readable insights by extracting transcripts and generating AI-powered summaries using Python and NLP.

---

## 🧰 Tech Stack

| Layer      | Tools Used                         |
|------------|------------------------------------|
| **Frontend** | React, Axios                      |
| **Backend**  | Node.js (Express)                 |
| **AI/NLP**   | Python (youtube-transcript-api, transformers, torch) |
| **Interop**  | Node child process via `stdin/stdout` |

---

## ✨ Features

- Paste a YouTube video URL
- Auto-fetch transcript (if captions are available)
- Generate concise summary using Python + NLP
- View both transcript & summary in a clean, responsive UI

---

## 🗂️ Project Structure

```
root/
├── backend/
│   ├── routes/
│   │   └── videoRoutes.js
│   ├── scripts/
│   │   ├── transcript_fetcher.py
│   │   └── summarizer.py
│   └── index.js
├── frontend/
│   ├── public/
│   └── src/
│       └── App.js
└── README.md
```

---

## ⚙️ Installation & Setup

### Prerequisites

- Node.js & npm
- Python 3.x
- Python packages:
  ```bash
  pip install youtube-transcript-api transformers torch
  ```

Make sure `transcript_fetcher.py` and `summarizer.py` return valid JSON to `stdout`.

---

### 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/your-username/video-summarizer.git
cd video-summarizer

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start both servers
cd ..
npm start
```

Runs:
- Frontend → `http://localhost:3000`
- Backend → `http://localhost:5000`

Ensure endpoint: `http://localhost:5000/api/video/process-video` is active.

---

## 🔎 Example Usage

1. Paste a YouTube video URL (e.g. `https://www.youtube.com/watch?v=dQw4w9WgXcQ`)
2. Click Submit
3. Backend fetches transcript and summarizes it
4. Frontend renders the transcript and summary

---

## 📌 Notes

- Works only with videos that have captions enabled
- Videos without subtitles will trigger an error
- You can extend functionality with Whisper for speech-to-text

---

## 🙌 Acknowledgements

- [YouTube Transcript API](https://github.com/jdepoix/youtube-transcript-api)
- [Hugging Face Transformers](https://huggingface.co/transformers)

---

Let me know if you’d like badges, deployment instructions, or demo GIFs added to this!
