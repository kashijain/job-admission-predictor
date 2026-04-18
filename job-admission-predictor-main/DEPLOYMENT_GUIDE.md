# 🚀 Deployment & Setup Guide

## Local Development Setup

### Backend Setup (Flask + Python)

1. **Navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Create and activate virtual environment:**
   ```bash
   # Windows
   python -m venv venv
   venv\Scripts\activate
   
   # Mac/Linux
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   
   Update with your values:
   ```
   MONGO_URI=mongodb://localhost:27017/job_admission_db
   SECRET_KEY=your_super_secret_key_12345
   FLASK_ENV=development
   PORT=5000
   ```

5. **Ensure MongoDB is running:**
   ```bash
   # If using local MongoDB
   mongod
   
   # Or use MongoDB Atlas - update MONGO_URI in .env
   ```

6. **Run backend server:**
   ```bash
   python app.py
   ```
   
   Expected output:
   ```
   ✓ MongoDB connection successful
   ✓ Collections initialized
   * Running on http://0.0.0.0:5000
   ```

### Frontend Setup (React + Vite)

1. **Navigate to frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
   
   File should contain:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=PredictGenius
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will run on `http://localhost:5173`

### Test Local Installation

1. **Access the application:**
   - Open browser: http://localhost:5173
   - Use demo credentials:
     - Email: `demo@student.com`
     - Password: `password123`
   - Admin email: `admin@predictgenius.com` / Password: `admin123`

2. **Test predictions:**
   - Go to Dashboard → Job Predictor
   - Fill in student details
   - Submit and view results

---

## Production Deployment

### Backend Deployment on Render

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Deploy job predictor"
   git push origin main
   ```

2. **Create Render account** and connect GitHub

3. **Create new Web Service:**
   - Select Python runtime
   - Set Root Directory to `backend/`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`

4. **Add Environment Variables in Render dashboard:**
   ```
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/job_admission_db
   SECRET_KEY=your_strong_production_key_abc123xyz
   FLASK_ENV=production
   ```

5. **Get your Backend URL:** (e.g., `https://predictgenius-backend.render.com`)

### Frontend Deployment on Vercel

1. **Update frontend `.env` for production:**
   ```
   VITE_API_URL=https://predictgenius-backend.render.com/api
   VITE_APP_NAME=PredictGenius
   ```

2. **Build frontend:**
   ```bash
   npm run build
   ```

3. **Deploy to Vercel:**
   - Go to vercel.com and sign in with GitHub
   - Import your repository
   - Select `frontend` as root directory
   - Add environment variables from `.env`
   - Click Deploy

4. **Get your Frontend URL:** (e.g., `https://predictgenius.vercel.app`)

### MongoDB Atlas Setup (Cloud Database)

1. **Create MongoDB Atlas account** at atlas.mongodb.com

2. **Create a cluster** (free tier available)

3. **Create database user** with strong password

4. **Get connection string:**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/job_admission_db?retryWrites=true&w=majority
   ```

5. **Add this to Render environment variables** as `MONGO_URI`

---

## API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Predictions
- `POST /api/predict/job` - Get job placement prediction (requires JWT)
- `POST /api/predict/admission` - Get admission prediction (requires JWT)

### Complaints
- `POST /api/complaint/add` - Submit complaint (requires JWT)
- `POST /api/complaint/check-duplicate` - Check for duplicates (requires JWT)
- `GET /api/complaint/mine` - Get user's complaints (requires JWT)

### Admin Routes (requires admin role)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/complaints` - Get all complaints
- `GET /api/admin/predictions` - Get all predictions

---

## Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running locally OR
- Update MONGO_URI with correct Atlas credentials
- Check firewall/network settings

**Models Not Loading:**
- Run `python train_model.py` to train models
- Verify `ml_models/` folder contains `.pkl` files

**CORS Errors:**
- Check backend CORS config in `app.py`
- Ensure frontend URL is whitelisted

### Frontend Issues

**API Connection Failed:**
- Verify backend is running (check http://localhost:5000)
- Update `VITE_API_URL` in `.env` to correct backend URL
- Check network tabs in browser developer tools

**Tailwind Styles Not Applied:**
- Run `npm run dev` to rebuild styles
- Clear browser cache (Ctrl+Shift+Delete)
- Verify `postcss.config.js` uses correct tailwindcss plugin

---

## Project Structure Overview

```
job-admission-predictor-main/
├── backend/
│   ├── .env (create from .env.example)
│   ├── app.py (Flask server)
│   ├── config.py (Configuration)
│   ├── requirements.txt (Python dependencies)
│   ├── controllers/ (Business logic)
│   ├── routes/ (API endpoints)
│   ├── utils/ (Authentication, ML utilities)
│   └── ml_models/ (Trained models)
│
├── frontend/
│   ├── .env (create from .env.example)
│   ├── package.json (Node dependencies)
│   ├── vite.config.js (Vite configuration)
│   ├── tailwind.config.js (Tailwind CSS config)
│   ├── src/
│   │   ├── App.jsx (Main component)
│   │   ├── pages/ (Page components)
│   │   ├── context/ (React context for auth)
│   │   └── services/ (API client)
│   └── index.html (Entry point)
```

---

## Performance Tips

1. **Caching:** Browser caches JWT tokens for fast login
2. **Lazy Loading:** Pages load CSS only when needed
3. **API Optimization:** Reduce requests by batching admin queries
4. **Database Indexing:** Create indexes on frequently queried fields

---

## Security Checklist

- ✅ Change default `SECRET_KEY` in production
- ✅ Use strong MongoDB password
- ✅ Enable HTTPS on production URLs
- ✅ Set `FLASK_ENV=production` on Render
- ✅ Restrict CORS only to your frontend domain
- ✅ Use environment variables for sensitive data (never commit `.env`)
- ✅ Validate all user inputs on backend

---

## Support & Contact

For issues or questions, refer to:
- README.md for project overview
- viva_points.md for technical details
- Backend errors in server logs
- Frontend errors in browser console

**Built with ❤️ for Final Year Project Excellence**
