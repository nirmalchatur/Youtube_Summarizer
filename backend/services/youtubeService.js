// services/youtubeService.js

const { YoutubeTranscript } = require('youtube-transcript');

async function fetchTranscript(videoUrl) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoUrl);
    return transcript;
  } catch (error) {
    console.error('Transcript fetch error:', error.message);
    return null;
  }
}

module.exports = {
  fetchTranscript,
};
