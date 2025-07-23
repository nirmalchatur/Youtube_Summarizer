// controllers/videoController.js

const { fetchTranscript } = require('../services/youtubeService');

const processVideo = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'videoUrl is required' });
  }

  try {
    const transcript = await fetchTranscript(url);

    if (!transcript || transcript.length === 0) {
      return res.status(404).json({ error: 'Transcript not found' });
    }

    return res.json({ transcript });
  } catch (error) {
    console.error('processVideo error:', error);
    return res.status(500).json({ error: 'Failed to fetch transcript or metadata' });
  }
};

module.exports = {
  processVideo,
};
