# 🌐 Multilingual Chat App (Realtime) 🚀

A fully responsive real-time chat application that supports **language switching** between English, Hindi, Marathi, Telugu, and Kannada — powered by **Firebase Authentication** and **Firestore**.

---

## 🔥 Features

- ✅ Firebase Email/Password Authentication  
- 💬 Real-time messaging with Firestore  
- 🌍 Language switching for messages (User-selectable)
- 🌓 Dark/Light mode toggle  
- 📱 Responsive UI for all screen sizes  
- 🎯 Simple, clean, and intuitive design  

---

## 🛠 Tech Stack

| Tech             | Usage                           |
|------------------|----------------------------------|
| `React.js`        | Frontend framework              |
| `Firebase`        | Auth & Firestore database       |
| `Tailwind CSS`    | Styling & responsiveness        |
| `React Router`    | Page routing                    |
| `Context API`     | Global state management         |
| `i18n / Manual`   | Language selection/translation  |

---

## ⚙️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/multilingual-chat-app.git
cd multilingual-chat-app
2. Install dependencies
bash
Copy
Edit
npm install
3. Setup Firebase
Go to Firebase Console

Create a new project

Enable Authentication → Email/Password

Create Cloud Firestore database in test mode

Add your Firebase config to .env

env

VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxxx
VITE_FIREBASE_APP_ID=xxxxxxxxx
4. Update Firestore Rules
js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /messages/{messageId} {
      allow read, write: if request.auth != null;
    }
  }
}
5. Run the app locally
bash
npm run dev
🧪 Folder Structure
bash
Copy
Edit
├── public/
├── src/
│   ├── components/         # Reusable components
│   ├── contexts/           # Auth + Language context
│   ├── firebase/           # Firebase config
│   ├── pages/              # Login, Register, Chat page
│   ├── App.jsx
│   └── main.jsx
├── .env
├── tailwind.config.js
└── README.md
🎯 Future Improvements
🧠 AI-based language translation (using Gemini/GPT API)

📷 Media support (images, emojis)

📬 Push notifications

🔐 Google OAuth

🙏 Acknowledgements
Firebase
Tailwind CSS
React

📸 Screenshots
Include images of Login Page, Chat Page, and Language Toggle UI here.

📄 License
