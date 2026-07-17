# 🍳 Fridge2Recipe AI

An AI-powered Fridge-to-Recipe web application that transforms a list of ingredients into an interactive cooking experience.

Instead of displaying raw AI text, the application requests structured JSON from a Large Language Model and renders it into interactive UI components including ingredient checklists, cooking steps, serving controls, nutrition information, and ingredient swaps.

---

## ✨ Features

- Free-form ingredient input
- AI-powered recipe generation using Gemini
- Interactive cooking checklist
- Ingredient checklist
- Scalable servings
- Ingredient swap suggestions
- Nutrition information
- Save favorite recipes
- Recipe history
- Copy, Share and Print recipe
- Dark Mode
- Fully responsive design
- Robust AI error handling
- Retry failed requests
- Prevent stale AI responses
- LocalStorage persistence

---

## 🛠 Tech Stack

### Frontend
- React 19
- Vite
- JavaScript (ES6+)
- Tailwind CSS
- Framer Motion
- React Icons
- React Hot Toast

### Backend
- Node.js
- Express.js

### AI
- Google Gemini API

---

## 📂 Project Structure

```
fridge2recipe-ai/

├── src/
│   ├── components/
│   ├── services/
│   └── App.jsx
│
├── backend/
│   ├── routes/
│   ├── services/
│   ├── server.js
│   └── package.json
│
├── tests/
├── .env.example
├── index.html
├── vite.config.js
├── tailwind.config.js
├── package.json
└── README.md
```

---

## 🚀 Installation

### 1. Clone Repository

```bash
git clone https://github.com/ANSHIKA-git-29/Fridge2Recipe-AI.git
```

```bash
cd fridge2recipe-ai
```

---

### 2. Install Frontend Dependencies

Run from the project root:

```bash
npm install
```

---

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 4. Configure Environment Variables

Create a `.env` file inside the `backend` folder (see `.env.example` for the expected keys).

```
GEMINI_API_KEY=YOUR_API_KEY
PORT=5000
```

---

### 5. Start Backend

```bash
cd backend
npm start
```

---

### 6. Start Frontend

In a separate terminal, from the project root:

```bash
npm run dev
```

Open:

```
http://localhost:5173
```

---

## ▶️ Usage

1. Enter ingredients using the input field.
2. Click **Generate Recipe**.
3. The backend sends the ingredients to Gemini.
4. Gemini returns structured JSON.
5. The frontend validates and parses the response.
6. The recipe is displayed as interactive UI.
7. Users can:
   - Check ingredients
   - Complete cooking steps
   - Scale servings
   - Save recipes
   - Print
   - Share

---

## 🤖 AI Usage Note

AI tools were used during development to:

- Brainstorm project architecture
- Improve React component structure
- Generate and refine UI ideas
- Review code quality
- Suggest error-handling improvements
- Assist with debugging
- Improve README documentation

All generated code was reviewed, modified, tested, and integrated manually. I understand the implementation and can explain all architectural and coding decisions during the interview.

---

## 🧠 AI Integration

The application uses the Google Gemini API.

Workflow:

```
React Frontend
        │
        ▼
Express Backend
        │
        ▼
Google Gemini API
        │
        ▼
Structured JSON
        │
        ▼
Interactive React Components
```

The API key is stored securely on the backend and is never exposed to the browser.

---

## 🛡 Handling Bad AI Output

The application is designed to safely handle unreliable AI responses.

Implemented protections include:

- Invalid JSON detection
- JSON extraction from mixed text
- Schema validation
- Missing field handling
- Retry mechanism
- Friendly error messages
- Loading state
- Empty state
- Network failure handling
- Request cancellation using AbortController
- Prevention of stale responses overwriting newer ones

---

## 📱 Responsive Design

The application is optimized for:

- Desktop
- Laptop
- Tablet
- Mobile (320px and above)

---

## ⚠️ Known Limitations

- Recipe quality depends on the AI model.
- Nutrition values are AI-generated estimates.
- Ingredient swaps may not always be available.
- Internet connection is required for AI generation.
- AI responses may vary between requests.

---

## 🔮 Future Improvements

- Recipe image generation
- Voice input
- Speech synthesis
- Streaming AI responses
- Multi-language support
- User authentication
- Cloud recipe synchronization

---

## ⏱ Time Spent

Approximately **8 hours**

Breakdown:

- UI Design – 2 hours
- React Components – 2.5 hours
- AI Integration – 1.5 hours
- Backend – 1 hour
- Testing & Debugging – 1 hour

---

## 🎥 Demo

A screen recording demonstrating:

- Ingredient input
- AI recipe generation
- Loading state
- Error handling
- Interactive checklist
- Serving scaler
- Save/Print/Share
- Responsive layout

---

## 📄 License

Created as part of a Frontend Internship assignment.
