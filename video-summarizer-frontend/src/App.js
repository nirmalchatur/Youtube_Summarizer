import React, { useState, useRef, useEffect } from "react";
import { Play, FileText, Sparkles, AlertCircle, Loader2, Mic, Moon, Activity } from "lucide-react";
import Navbar from "./component/Navbar";

const videoSuggestions = [
  {
    title: "The Art of Public Speaking",
    url: "https://www.youtube.com/watch?v=aopemV_lclI",
    icon: <Mic size={24} />,
    description: "Master the art of public speaking with this comprehensive guide!"
  },
  {
    title: "10-Minute Meditation for Beginners",
    url: "https://www.youtube.com/watch?v=qpYF-xmNMew",
    icon: <Activity size={24} />,
    description: "Start your mindfulness journey with this easy 10-minute meditation."
  },
  {
    title: "The Science of Sleep",
    url: "https://www.youtube.com/watch?v=0ABrpbjoHCk",
    icon: <Moon size={24} />,
    description: "Discover the fascinating science behind sleep."
  }
];

function App() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoId, setVideoId] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);
  const [player, setPlayer] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const playerRef = useRef(null);

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  useEffect(() => {
    if (window.YT) {
      initializePlayer();
    } else {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    }
  }, [videoId]);

  const initializePlayer = () => {
    if (!videoId || !window.YT) return;
    
    new window.YT.Player(playerRef.current, {
      videoId: videoId,
      events: {
        onReady: (event) => setPlayer(event.target),
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.PLAYING && isSelecting) {
            setStartTime(event.target.getCurrentTime());
          }
        }
      }
    });
  };

  const handleSuggestionClick = (url) => {
    setVideoUrl(url);
    const id = extractVideoId(url);
    if (id) {
      setVideoId(id);
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const id = extractVideoId(videoUrl);
    if (!id) {
      setError("Please enter a valid YouTube URL");
      return;
    }
    setVideoId(id);
    setStep(2);
  };

  const handleStartSelection = () => {
    setIsSelecting(true);
    if (player) {
      setStartTime(player.getCurrentTime());
    }
  };

  const handleEndSelection = () => {
    setIsSelecting(false);
    if (player) {
      setEndTime(player.getCurrentTime());
    }
  };

  const handleGenerateSummary = async () => {
    if (startTime >= endTime) {
      setError("End time must be after start time");
      return;
    }

    setLoading(true);
    setError("");
    setTranscript("");
    setSummary("");

    try {
      const response = await fetch("http://localhost:5000/api/video/process-video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          videoUrl,
          startTime,
          endTime
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTranscript(data.transcript);
      setSummary(data.summary);
      setStep(3);
    } catch (err) {
      setError("Failed to process video: " + (err.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          overflow-x: hidden;
        }
        .app-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f0f 0%, #1a0000 25%, #2d0000 50%, #1a0000 75%, #0f0f0f 100%);
          position: relative;
        }
        .grain-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          pointer-events: none;
        }
        .content-wrapper {
          position: relative;
          z-index: 2;
          max-width: 1200px;
          margin: 0 auto;
          padding: 60px 24px;
        }
        .main-card {
          background: rgba(0, 0, 0, 0.4);
          border: 1px solid rgba(139, 69, 19, 0.2);
          border-radius: 12px;
          padding: 48px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        .header {
          text-align: center;
          margin-bottom: 48px;
        }
        .header-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #8B0000, #DC143C);
          border-radius: 16px;
          margin-bottom: 24px;
          box-shadow: 0 4px 16px rgba(220, 20, 60, 0.3);
        }
        .main-title {
          font-size: 42px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 16px;
          letter-spacing: -0.5px;
        }
        .subtitle {
          font-size: 18px;
          color: #cccccc;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }
        .form-container {
          margin-bottom: 48px;
        }
        .input-group {
          display: flex;
          gap: 16px;
          align-items: stretch;
        }
        .url-input {
          flex: 1;
          padding: 16px 20px;
          background: rgba(0, 0, 0, 0.6);
          border: 2px solid rgba(139, 69, 19, 0.3);
          border-radius: 8px;
          color: #ffffff;
          font-size: 16px;
          transition: all 0.3s ease;
        }
        .url-input:focus {
          outline: none;
          border-color: #8B0000;
          box-shadow: 0 0 0 3px rgba(139, 0, 0, 0.1);
        }
        .url-input::placeholder {
          color: #999999;
        }
        .submit-button {
          padding: 16px 32px;
          background: linear-gradient(135deg, #8B0000, #DC143C);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }
        .submit-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #A00000, #FF1744);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(220, 20, 60, 0.4);
        }
        .submit-button:disabled {
          background: rgba(139, 69, 19, 0.5);
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        .time-selection-buttons {
          display: flex;
          gap: 16px;
          margin-top: 16px;
          justify-content: center;
        }
        .time-display {
          color: #ffffff;
          text-align: center;
          margin-top: 16px;
          font-size: 16px;
        }
        .loading-state {
          text-align: center;
          padding: 48px 24px;
        }
        .loading-text {
          color: #cccccc;
          font-size: 18px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(139, 0, 0, 0.3);
          border-top: 3px solid #8B0000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .progress-bar {
          width: 300px;
          height: 4px;
          background: rgba(139, 69, 19, 0.3);
          border-radius: 2px;
          margin: 0 auto;
          overflow: hidden;
        }
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #8B0000, #DC143C);
          border-radius: 2px;
          animation: progress 2s ease-in-out infinite;
        }
        @keyframes progress {
          0% { width: 0%; }
          50% { width: 100%; }
          100% { width: 0%; }
        }
        .error-message {
          background: rgba(139, 0, 0, 0.1);
          border: 1px solid rgba(139, 0, 0, 0.3);
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 32px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
        }
        .error-text {
          color: #ff6b6b;
        }
        .results-container {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .result-section {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(139, 69, 19, 0.2);
          border-radius: 8px;
          overflow: hidden;
          transition: all 0.3s ease;
        }
        .result-section:hover {
          border-color: rgba(139, 0, 0, 0.4);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }
        .section-header {
          padding: 20px 24px;
          background: rgba(139, 0, 0, 0.1);
          border-bottom: 1px solid rgba(139, 69, 19, 0.2);
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .section-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #8B0000, #DC143C);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .section-title {
          font-size: 20px;
          font-weight: 600;
          color: #ffffff;
        }
        .section-content {
          padding: 24px;
          color: #e0e0e0;
          line-height: 1.7;
          white-space: pre-wrap;
          font-size: 15px;
        }
        .video-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
          margin-bottom: 24px;
          border-radius: 8px;
          background: #000;
        }
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: none;
        }
        .action-buttons {
          display: flex;
          justify-content: center;
          gap: 16px;
          margin-top: 24px;
        }
        .suggestions-container {
          margin: 32px 0;
        }
        .suggestions-title {
          color: #ffffff;
          font-size: 20px;
          margin-bottom: 16px;
          text-align: center;
        }
        .suggestions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
          margin-top: 24px;
        }
        .suggestion-card {
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(139, 69, 19, 0.2);
          border-radius: 8px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .suggestion-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
          border-color: rgba(139, 0, 0, 0.4);
        }
        .suggestion-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }
        .suggestion-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #8B0000, #DC143C);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .suggestion-title {
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
        }
        .suggestion-description {
          font-size: 14px;
          color: #cccccc;
          line-height: 1.5;
        }
        .footer {
          text-align: center;
          margin-top: 48px;
          padding-top: 24px;
          border-top: 1px solid rgba(139, 69, 19, 0.2);
          color: #999999;
          font-size: 14px;
        }
        @media (max-width: 768px) {
          .content-wrapper {
            padding: 32px 16px;
          }
          .main-card {
            padding: 32px 24px;
          }
          .main-title {
            font-size: 32px;
          }
          .subtitle {
            font-size: 16px;
          }
          .input-group {
            flex-direction: column;
          }
          .submit-button {
            justify-content: center;
          }
          .suggestions-grid {
            grid-template-columns: 1fr;
          }
        }
        @media (max-width: 480px) {
          .content-wrapper {
            padding: 24px 12px;
          }
          .main-card {
            padding: 24px 16px;
          }
          .main-title {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="app-container">
        <Navbar />
        <div className="grain-overlay"></div>
        <div className="content-wrapper">
          <div className="main-card">
            <div className="header">
              <div className="header-icon">
                <Play size={32} color="white" />
              </div>
              <h1 className="main-title">YouTube Summarizer</h1>
              <p className="subtitle">
                Extract meaningful insights from any YouTube video with intelligent transcription and summarization
              </p>
            </div>

            {step === 1 && (
              <>
                <div className="form-container">
                  <div className="input-group">
                    <input
                      type="text"
                      placeholder="Enter YouTube video URL..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="url-input"
                      disabled={loading}
                    />
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !videoUrl.trim()}
                      className="submit-button"
                    >
                      <Play size={20} />
                      View Video
                    </button>
                  </div>
                </div>

                <div className="suggestions-container">
                  <h3 className="suggestions-title">Or try one of these popular videos:</h3>
                  <div className="suggestions-grid">
                    {videoSuggestions.map((video, index) => (
                      <div 
                        key={index}
                        className="suggestion-card"
                        onClick={() => handleSuggestionClick(video.url)}
                      >
                        <div className="suggestion-header">
                          <div className="suggestion-icon">
                            {video.icon}
                          </div>
                          <h4 className="suggestion-title">{video.title}</h4>
                        </div>
                        <p className="suggestion-description">{video.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <div>
                <div className="video-container">
                  <div ref={playerRef}></div>
                </div>
                
                <div className="time-selection-buttons">
                  <button
                    onClick={handleStartSelection}
                    className="submit-button"
                    style={{ background: isSelecting ? "#4CAF50" : "linear-gradient(135deg, #8B0000, #DC143C)" }}
                  >
                    {isSelecting ? "Selecting..." : "Set Start Time"}
                  </button>
                  <button
                    onClick={handleEndSelection}
                    className="submit-button"
                    disabled={!isSelecting}
                    style={{ background: !isSelecting ? "#666666" : "linear-gradient(135deg, #8B0000, #DC143C)" }}
                  >
                    Set End Time
                  </button>
                </div>
                
                <div className="time-display">
                  {startTime > 0 && endTime > 0 ? (
                    <p>Selected segment: {Math.floor(startTime)}s to {Math.floor(endTime)}s</p>
                  ) : startTime > 0 ? (
                    <p>Start time set at {Math.floor(startTime)}s</p>
                  ) : (
                    <p>Play the video and select a segment to summarize</p>
                  )}
                </div>
                
                <div className="action-buttons">
                  <button
                    onClick={() => setStep(1)}
                    className="submit-button"
                    style={{ background: "linear-gradient(135deg, #333333, #666666)" }}
                  >
                    Back
                  </button>
                  <button
                    onClick={handleGenerateSummary}
                    disabled={loading || startTime >= endTime}
                    className="submit-button"
                  >
                    {loading ? (
                      <>
                        <div className="spinner"></div>
                        Processing
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Generate Summary
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {loading && (
              <div className="loading-state">
                <div className="loading-text">
                  <div className="spinner"></div>
                  Analyzing video content...
                </div>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
              </div>
            )}

            {error && (
              <div className="error-message">
                <AlertCircle size={20} color="#ff6b6b" />
                <div className="error-text">{error}</div>
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="video-container">
                  <div ref={playerRef}></div>
                </div>
                
                <div className="action-buttons">
                  <button
                    onClick={() => setStep(1)}
                    className="submit-button"
                    style={{ background: "linear-gradient(135deg, #333333, #666666)" }}
                  >
                    Back
                  </button>
                </div>
                
                <div className="results-container">
                  {transcript && (
                    <div className="result-section">
                      <div className="section-header">
                        <div className="section-icon">
                          <FileText size={20} color="white" />
                        </div>
                        <h2 className="section-title">Transcript</h2>
                      </div>
                      <div className="section-content">
                        {transcript}
                      </div>
                    </div>
                  )}

                  {summary && (
                    <div className="result-section">
                      <div className="section-header">
                        <div className="section-icon">
                          <Sparkles size={20} color="white" />
                        </div>
                        <h2 className="section-title">Summary</h2>
                      </div>
                      <div className="section-content">
                        {summary}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="footer">
              Powered by advanced AI technology
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;