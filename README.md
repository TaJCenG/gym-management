# gym-management
A Gym management app for more info read READme
We'll create a comprehensive `README.md` for your GitHub repository. It will include all necessary information to set up and run the project.

---

# 🏋️‍♂️ FitGym AI – Gym Management Web Application

A modern, AI-first gym management system with booking, membership tracking, admin dashboard, and upcoming AI-powered fitness assistant.

## ✨ Features

- **AI Fitness Assistant** (coming soon) – Voice & text chat to generate personalized workout plans and recommend classes/trainers.
- **Trial Booking** – Simple date/time selection with trainer/class availability checks.
- **User Management** – OTP-based registration (WhatsApp) – placeholder, ready for integration.
- **Admin Dashboard** – Analytics, trainer/class management, membership overview.
- **WhatsApp Notifications** – Twilio integration for confirmations and reminders (planned).
- **Responsive UI** – Mobile-first design with dynamic backgrounds.

## 🛠️ Tech Stack

### Backend
- Python 3.10+
- FastAPI
- SQLAlchemy ORM
- MySQL
- PyJWT (admin authentication)
- Twilio (WhatsApp – to be added)
- OpenAI / Vapi (AI – to be added)

### Frontend
- React 18
- Vite
- Tailwind CSS (or plain CSS)
- Axios
- React Router
- Recharts (dashboard)
- React Hot Toast

### Deployment
- Docker (optional)
- Docker Compose

## 📋 Prerequisites

- Node.js 20.19+ (for frontend)
- Python 3.10+ (for backend)
- MySQL 8.0+
- Git

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/gym-management.git
cd gym-management
```

### 2. Backend Setup

Navigate to the backend folder:
```bash
cd backend
```

Create a virtual environment and activate it:
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Set up environment variables – create a `.env` file (see below).

Create the database:
```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS gym_management;"
```

Run migrations (if using Alembic) or let the app create tables automatically (development only):
```bash
python -c "from app.core.database import Base, engine; Base.metadata.create_all(bind=engine)"
```

Seed initial data (trainers, classes):
```bash
python seed.py
```

Start the backend server:
```bash
uvicorn app.main:app --reload
```
The API will be available at `http://localhost:8000`. Swagger docs at `/docs`.

### 3. Frontend Setup

Open a new terminal, navigate to the frontend folder:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Create a `.env` file (see below).

Start the development server:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.

### 4. Environment Variables

#### Backend `.env` (in `backend/` folder)
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=gym_management

# JWT
JWT_SECRET_KEY=your_secret_key_change_this
JWT_ALGORITHM=HS256
JWT_ACCESS_TOKEN_EXPIRE_MINUTES=30

# OpenAI (to be added)
OPENAI_API_KEY=your_key_optional

# Twilio (to be added)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_WHATSAPP_NUMBER=

# Vapi (to be added)
VAPI_API_KEY=
```

#### Frontend `.env` (in `frontend/` folder)
```env
VITE_API_BASE_URL=http://localhost:8000/api/v1
```

### 5. Admin Access

After seeding the database, an admin user is created (you can run `seed_admin.py` if not already). Default credentials:
- Email: `admin@example.com`
- Password: `admin123`

You can change them later.

## 🧪 Testing the Application

- Public user flow: Visit `http://localhost:5173`, click **Book Free Trial**, fill in details, check availability, confirm booking.
- Admin panel: Log in at `/admin/login`, then manage trainers/classes and view dashboard.

## 📁 Project Structure

```
gym-management/
├── backend/
│   ├── app/
│   │   ├── api/           # API endpoints (v1)
│   │   ├── core/          # Config, database, security
│   │   ├── models/        # SQLAlchemy models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Helpers
│   │   └── main.py
│   ├── .env
│   ├── requirements.txt
│   └── seed.py
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── routes/        # Page components
│   │   ├── services/      # API calls
│   │   ├── context/       # React context providers
│   │   └── utils/         # Helpers
│   ├── .env
│   └── package.json
└── README.md
```

## 🐳 Docker (Optional)

A `docker-compose.yml` is provided to run MySQL, backend, and frontend together. Use:
```bash
docker-compose up -d
```

## 📚 API Documentation

After starting the backend, visit `http://localhost:8000/docs` for interactive Swagger documentation.

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgements

- Background images from [Unsplash](https://unsplash.com)
- Video from [Pexels](https://www.pexels.com)

---

Now you can push this README to your GitHub repository. If you need any modifications or additional sections (e.g., screenshots, detailed API examples), let me know and I'll update it.
