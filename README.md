# 🚀 PrepGenius --- AI Interview Prep Planner

## 🌟 Overview

PrepGenius is an autonomous AI-powered interview preparation system that
continuously adapts to your performance.

## 🎯 Features

-   Daily AI-generated quizzes
-   Adaptive learning based on weak areas
-   Automated evaluation
-   Personalized feedback loop

## ⚙️ Tech Stack

-   n8n (workflow automation)
-   Google Sheets (MVP DB)
-   Nvedia API (LLM)
-   Next.js for frontend and backend

## 🔁 Workflow

1.  User profile input
2.  Quiz generation
3.  Response submission
4.  AI evaluation
5.  Weak topic detection
6.  Next quiz adaptation

## 📦 API

### Submit Answers

POST /api/submit

    {
      "user_id": "string",
      "quiz_id": "string",
      "answers": [{ "question_id": "q1", "answer": "A" }]
    }

### Evaluation Response

    {
      "overall_score": 8,
      "weak_topics": ["DSA"],
      "skill_gaps": ["Optimization"],
      "feedback": "Improve problem solving"
    }

## 🚀 Setup

    git clone https://github.com/AnishPati/PrepGenius
    cd PrepGenius
    npm install
    npm run dev

## 📈 Vision

Build an autonomous career preparation system with continuous learning
loops.

## 🤝 Contributing

PRs welcome!
