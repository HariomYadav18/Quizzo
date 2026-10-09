<div align="center">
  <h1 align="center">Quizzo.</h1>
  <p align="center">
    <b>A professional-grade, high-performance SaaS assessment platform featuring Arc UI design, cognitive telemetry, local RAG document parsing, and adaptive AI evaluations.</b>
  </p>
  <p align="center">
    <img src="https://img.shields.io/badge/React-18-blue?style=flat-square&logo=react" alt="React">
    <img src="https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript" alt="TypeScript">
    <img src="https://img.shields.io/badge/Vite-Fast-646CFF?style=flat-square&logo=vite" alt="Vite">
  </p>
</div>

---

## 🌟 Overview

**Quizzo** is a next-generation evaluation and knowledge-testing engine built for high-performance assessment. Moving beyond standard static multiple-choice apps, Quizzo integrates advanced frontend mechanics (Web Worker offloading, hesitation analytics) with sophisticated AI engineering (local PDF knowledge extraction, adaptive difficulty scaling, and automated study guides).

---

## ✨ Core Features

* **Arc UI Design Aesthetic**: Implements a minimalist layout powered by soft pastel mesh gradients, Plus Jakarta Sans typography, and clean frosted-glass interactions.
* **Local RAG & PDF Knowledge Extraction**: Users can drag and drop lecture notes or syllabus PDFs. The app parses the text securely in the browser using `pdf.js` before feeding it into the evaluation pipeline.
* **AI Concept Book**: Automatically generates high-yield, structured study guides (Core Definitions, Key Principles, Common Pitfalls) for any topic before testing.
* **Web Worker Offloading**: Heavy array operations, sorting, and shuffling are offloaded to background threads to ensure UI animations never drop a frame.
* **Cognitive Telemetry & Hesitation Tracking**: Measures response times and mouse-hover hesitation metrics to analyze user confidence.
* **Adaptive Difficulty Scaling**: Real-time telemetry monitoring detects high-performing users and dynamically injects expert-level challenge questions.
* **Command Palette (`Cmd + K`)**: A spotlight-style navigation menu for fast application routing and action execution.
* **Celebration Physics**: Integrated particle effects using `canvas-confetti` for high-score achievements.

---

## 🛠️ Tech Stack

* **Frontend Framework**: React, TypeScript, Vite
* **Styling**: Tailwind CSS, Framer Motion
* **Analytics & Charts**: Recharts, Custom Hesitation Engine
* **Document Parsing**: `pdf.js` (Local browser-based RAG)
* **AI & Orchestration**: LangChain, OpenAI API integration

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18+) installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git)
   cd YOUR_REPOSITORY_NAME

   Install dependencies:

Bash
npm install
Run the development server:

Bash
npm run dev
Open in browser:
Navigate to http://localhost:5173 to view the application.

💡 Keyboard Shortcuts
Cmd + K (Mac) or Ctrl + K (Windows/Linux): Open the Command Palette from anywhere in the app.
