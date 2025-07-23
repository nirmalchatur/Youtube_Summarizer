# backend/scripts/transcript_fetcher.py

import sys
import json
from youtube_transcript_api import YouTubeTranscriptApi

def get_video_id(url):
    if "v=" in url:
        return url.split("v=")[1].split("&")[0]
    else:
        return url.split("/")[-1]

def fetch_transcript(video_url):
    try:
        video_id = get_video_id(video_url)
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        transcript_text = " ".join([entry["text"] for entry in transcript])
        return { "transcript": transcript_text }
    except Exception as e:
        return { "error": str(e) }

if __name__ == "__main__":
    input_url = sys.argv[1]
    result = fetch_transcript(input_url)
    print(json.dumps(result))  # 🔥 This should ONLY output JSON!
# backend/routes/videoRoutes.js