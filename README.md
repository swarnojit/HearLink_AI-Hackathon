

# 🎧 HearLink – Bridging Educational Gaps with AI

> **Empowering Specially-Abled & General Students with AI-Powered Inclusive Education Tools**  
> *Built with ❤️ for hearing & speech-impaired learners, inclusive classrooms & empathetic educators.*

---

![image](https://github.com/user-attachments/assets/c257ea4e-d522-45a0-b81c-286b9650d146)


## 🚀 Overview

**HearLink** is an AI-powered educational assistant that brings accessibility, inclusivity, and personalization to the classroom. It’s specially designed to help hearing and speech-impaired students while also offering features beneficial for general students and teachers.

By leveraging real-time speech-to-text, facial emotion recognition, and AI-generated learning content, HearLink transforms any class into an engaging and inclusive experience.

---

## 🧠 Problem We're Solving

> 📚 Lack of real-time assistive tools for communication  
> 🔇 Difficulty understanding spoken content without lip reading  
> 😕 No visibility into student emotional engagement  
> 🚫 No unified platform for accessibility, personalization & insights  

---

## ✨ Key Features

| 👨‍🎓 For Students | 👩‍🏫 For Teachers |
|------------------|-------------------|
| 🗣️ Real-time Speech-to-Text | 📊 Emotion Detection + Engagement Insights |
| 🌐 Multilingual & Offline Support | 📈 Analytics Dashboard |
| 📋 Personalized Notes, Flashcards & Quizzes | 🧠 Personalized Feedback for Each Student |
| 📱 Web Platform with Responsive UI | 📑 Reports & Class-wise Trends |

---

## 👥 Target Users

- 🧏‍♂️ **Specially-Abled Students**: Speech-to-text transcription for easier access to lectures
- 🎓 **General Students**: Personalized AI-generated notes and study materials
- 👩‍🏫 **Teachers**: Live emotion tracking and dashboards for performance feedback

---

## 🛠️ Tech Stack

### 🧩 Frontend
- `HTML`, `CSS`, `JavaScript`
- Responsive, accessible design

### 🔧 Backend
- `Python`
- `Flask` (API + Routing)
- `SQLAlchemy` (Database ORM)

### 🧠 Machine Learning & AI
| Task | Technology |
|------|------------|
| Speech-to-Text | `Whisper` by OpenAI |
| Emotion Detection | `DeepFace`, `OpenCV`, `PyTorch` |
| NLP / Quiz Generation | `Google Gemini`, `Ollama` |
| Computer Vision | `OpenCV` | |

---

## 🧪 Datasets Used

| Type | Datasets |
|------|----------|
| 🔊 Speech | `LibriSpeech`, `Mozilla Common Voice` |
| 😊 Emotion | `FER-2013`, `AffectNet`, `RAF-DB` |
| 🧾 NLP | `DailyDialog`, `SQuAD`, `Tatoeba` |
| 🎥 User-Generated | Classroom audio/video, real-time student data |
| 🧬 Synthetic | Augmented data for robustness |

---

## 📈 Success Criteria

| Metric | Goal |
|--------|------|
| 🗣️ Transcription Accuracy | ≥ 85% (Multilingual) |
| 😐 Emotion Recognition Accuracy | ≥ 80% |
| 📚 Quiz/Notes Usage | Used by ≥ 3 students during demo |
| 📉 Improved Engagement | Actionable feedback adopted by teachers |
| 📡 Offline Usability | Core features available without internet |

---

## 🗃️ System Architecture

```plaintext
Input Layer
→ Audio (Mic) / Video (Camera Feed)

↓
Processing Layer
→ Speech-to-Text (Whisper)
→ Emotion Detection (DeepFace + OpenCV)
→ NLP (Gemini, Ollama)
→ Vector Storage (FAISS / ChromaDB)

↓
Application Layer
→ Study Materials Generator
→ Teacher Dashboard with Engagement Trends

↓
Interface Layer
→ Frontend (HTML/CSS/JS)
→ Flask API for ML & DB handling
```

---

## 🛰️ Cloud vs On-Device Mode

| Mode | Details |
|------|---------|
| **Cloud (Default)** | Google Cloud Run, Whisper API, Serverless |
| **Offline (Fallback)** | Whisper Tiny, Emotion models locally on device |
| **Smart Sync** | Cache locally, sync when connected |
| **On-Device (Planned)** | Lightweight summary & emotion alerts on mobile |

---

## 🌍 Accessibility Highlights

- 🧏 Icon-based navigation for low-literacy users
- 🌐 Multilingual support across UI and content
- 📡 Offline fallback for rural areas
- 🔐 Privacy-first with user consent & explainability

---

## 📦 Modular & Scalable Design

- 🔌 Plug-and-play modules: Use STT, Emotion Detection, or Quiz Gen independently
- 🧪 Open-source and community extensible
- 📱 Works on phones, tablets, desktops
- 🧠 Localized and scalable across regions

---

## 🔗 Key Resources

- 🧠 **GitHub Repo:** [HearLink](https://github.com/swarnojit/HearLink_AI-Hackathon)  


---

## 🔮 Upcoming Enhancements

- 📱 Native Mobile App (React Native)
- 📷 Emotion Overlay on Video Feed
- 🧠 Adaptive Quizzes based on real-time emotion
- 🔗 Blockchain integration for learning logs (planned)

---

## 🤝 Team

**👨‍💻 Team Name:** HearLink  
**🧠 Team Lead:** Swarnojit Maitra  
**Team Members:**  PriyaDeep Mullick I  Arpan Chowdhury I Mayukh Bhowmik

**🏫 Domain:** Education & Accessibility  



