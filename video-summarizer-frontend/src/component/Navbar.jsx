import React from "react";
import { Sparkles, Video } from "lucide-react";
import "./Navbar.css"; // Optional custom styles

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Sparkles size={24} color="#DC143C" />
        <span className="navbar-title">YouTube Summarizer</span>
      </div>
      <ul className="navbar-links">
        <li><a href="/">Home</a></li>
        <li><a href="#summary">Summary</a></li>
        <li><a href="#transcript">Transcript</a></li>
        <li><a href="https://github.com/nirmalchatur/YouTube-Summarizer" target="_blank" rel="noreferrer">GitHub</a></li>
      </ul>
    </nav>
  );
}