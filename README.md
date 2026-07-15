# 💰 FinVerse – Expense Tracker

**FinVerse** is a personal finance tracker that helps you monitor your expenses, income, and overall financial health. It supports multi‑user authentication (JWT), interactive charts (bar/line/pie), a fully responsive dashboard, and one‑click deployment using Docker Compose.

---

## ✨ Features

- 🔐 **User Authentication** – Register & login with JWT
- 📊 **Dynamic Dashboard** – Real‑time stats (balance, income, expenses)
- 📈 **Interactive Charts** – Bar, Line, and Pie charts (powered by Recharts)
- 📋 **Expense Management** – Add, edit, delete expenses with categories
- 🔍 **Search & Filter** – Search expenses by keyword, filter by month
- 🌙 **Dark / Light Mode** – Toggle theme
- 🔔 **Smart Notifications** – Alerts on high spending
- ⚙️ **Settings Page** – Update profile, choose theme & accent color
- 🐳 **Dockerized** – Run with a single `docker-compose up` command

---

## 🛠️ Tech Stack

| Layer       | Technology                                      |
|-------------|-------------------------------------------------|
| **Frontend**| React, TypeScript, Tailwind CSS, Recharts       |
| **Backend** | Node.js, Express, TypeScript, JWT, bcryptjs     |
| **Storage** | JSON file‑based (via Docker volume)             |
| **Container** | Docker, Docker Compose, Nginx (frontend)      |
| **Registry**| Docker Hub                                      |

---

## 🚀 How to Run with Docker

## 🚀 How to Run with Docker

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/FinVerse.git
   cd FinVerse
Start the application

bash
docker-compose up --build -d
Backend API runs on http://localhost:5000

Frontend UI runs on http://localhost (port 80)

Stop the application

bash
docker-compose down
Data (users, expenses) persists in a Docker volume named backend_data.
Use docker-compose down -v to remove all data as well.

🐳 Docker Hub
Pre‑built images are available on Docker Hub:

Backend: yourusername/finverse-backend:latest

Frontend: yourusername/finverse-frontend:latest

Pull and run them directly:

bash
docker pull yourusername/finverse-backend:latest
docker pull yourusername/finverse-frontend:latest
Then use the provided docker-compose.yml (with image: instead of build:) to start the app without building from source.

🔧 Environment Variables
For simplicity, the docker-compose.yml already contains demo‑safe environment variables:

Variable	Default Value (demo)
DATABASE_URL	postgresql://finverse_user:Finverse@2026@localhost:5432/...
JWT_SECRET	finverse_super_secret_key_2026
PORT	5000
In a real production environment you should replace these with strong secrets and never commit them to a public repository. Use an .env file (ignored by Git) for sensitive data.

📁 Project Structure
text
FinVerse/
├── backend/
│   ├── src/            # Express API routes, controllers, middleware
│   ├── Dockerfile
│   └── ...
├── frontend/
│   ├── src/            # React app (pages, components, services)
│   ├── Dockerfile
│   ├── nginx.conf
│   └── ...
├── docker-compose.yml
├── README.md
└── .env (local only, not committed)
🧪 API Testing (Without Frontend)
You can test the backend API directly using tools like Postman or Thunder Client.

POST /api/auth/register – Register a new user

POST /api/auth/login – Login and receive a JWT

GET /api/expenses – Get user expenses (requires Authorization: Bearer <token>)

POST /api/expenses – Add a new expense

PUT /api/expenses/:id – Update an expense

DELETE /api/expenses/:id – Delete an expense

GET /api/users/profile – Get user profile

PUT /api/users/balance – Update total balance

PUT /api/users/income – Update monthly income

📄 License
This project is for educational purposes. Feel free to use, modify, and learn from it.

