# Freelancer CRM

A full-stack CRM for freelancers with Groq AI integrations.

## Stack
- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React (Vite), React Query, Zustand
- **AI**: Groq SDK (llama-3.3-70b-versatile + llama-3.1-8b-instant)
- **PDF**: pdf-lib

## Setup

### 1. Install root deps
```bash
npm install
```

### 2. Backend
```bash
cd backend
npm install
cp .env.example .env   # fill in your values
```

### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
```

### 4. Run both
```bash
# from root
npm run dev
```

## Environment Variables

### backend/.env
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/freelancer-crm
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here
GROQ_API_KEY=your_groq_api_key_here
```

### frontend/.env
```
VITE_API_URL=http://localhost:5000/api/v1
```
