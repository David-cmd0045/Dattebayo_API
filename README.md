# 🍥 Dattebayo API Dashboard

A web dashboard for interacting with the Dattebayo API, providing anime-related data and visualizations.

## 🚀 Features

- **Anime Search**: Search for anime titles and get detailed info
- **Character Lookup**: Find information about your favorite characters
- **Data Visualization**: Charts and stats using Chart.js
- **Theme Toggle**: Switch between Light and Dark modes
- **Responsive Design**: Works on desktop and mobile

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Chart.js
- Dattebayo API

## 📦 Installation

1. **Clone the repository**
   ```sh
   git clone https://github.com/David-cmd0045/Dattebayo_API.git
   ```
2. **Navigate to the project folder**
   ```sh
   cd Elect_Final_Dave/Dattebayo_Api
   ```
3. **Open `index.html` in your web browser**
   - Double-click `index.html` or right-click and select “Open with” > your browser.

## 🖥️ How to Use

1. Open `index.html` in your web browser.
2. Use the search bar to look up anime or characters.
3. View results and charts on the dashboard.
4. Toggle the theme using the moon/sun icon in the header.

## 📄 License

This project is open source and free to use.

## 🙏 Credits

Created by Mark Dave, December 2025.

---

## 📚 API Reference (Dattebayo API)

**Base URL:** `https://dattebayo-api.onrender.com`

**Sample Endpoints:**
- `/anime` — Anime data
- `/character` — Character data

**Required Parameters:**
- `q`: Query string (e.g., anime title or character name)

**Authentication:**
- No API key required (public API)

**Sample JSON Response (Anime):**
```json
{
  "title": "Naruto",
  "episodes": 220,
  "status": "Completed",
  "characters": ["Naruto Uzumaki", "Sasuke Uchiha"]
}
```
