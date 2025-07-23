import sys
import json
from transformers import pipeline

def summarize(text):
    summarizer = pipeline("summarization", model="facebook/bart-large-cnn")  # or t5-small
    summary = summarizer(text, max_length=130, min_length=30, do_sample=False)
    return {"summary": summary[0]['summary_text']}

if __name__ == "__main__":
    try:
        input_text = sys.stdin.read()
        result = summarize(input_text.strip())
        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({ "error": "Summarization failed", "details": str(e) }))
        sys.exit(1)
