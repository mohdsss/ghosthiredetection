# 🚀 GhostHire - Vercel Deployment Guide

Deploying GhostHire from GitHub to Vercel takes less than 2 minutes!

---

## 📋 Pre-Flight Checklist (Already Done For You)
- [x] `vercel.json` configured with Frontend Vite build + Serverless Python API routes
- [x] `api/index.py` configured with FastAPI serverless integration
- [x] `requirements.txt` configured for lightweight serverless packaging
- [x] `.gitignore` hardened (ensures `.env` and `*.csv` AWS keys are never uploaded to GitHub)

---

## 🛠️ Step 1: Push Code to GitHub

### Option A: Using GitHub Desktop (Easiest & Recommended)
1. Download & open [GitHub Desktop](https://desktop.github.com/).
2. Click **File** > **Add Local Repository**.
3. Browse and select this folder:
   `C:\Users\mohds\OneDrive\Desktop\aws sbg`
4. If it asks to create a repository, click **Create Repository**.
5. Commit with title: `feat: GhostHire launch ready`
6. Click **Publish repository** to GitHub (keep it Public or Private as you prefer).

### Option B: Using Git CLI / Terminal
Run `setup_git.bat` or run:
```bash
git init
git add .
git commit -m "feat: complete GhostHire verification platform"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

---

## ☁️ Step 2: Import into Vercel

1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **Add New...** > **Project**.
3. Select your GitHub repository (`ghosthire`).
4. In the Project Configuration:
   - **Framework Preset**: Other (or Vite - `vercel.json` handles this automatically).
   - **Root Directory**: `./` (leave default).

---

## 🔑 Step 3: Add Environment Variables in Vercel

Before clicking Deploy, expand **Environment Variables** on the Vercel setup page and add these 5 keys (copy from your local `backend/.env`):

| Variable Name | Value | Purpose |
|---|---|---|
| `AWS_ACCESS_KEY_ID` | `your_aws_access_key_here` | AWS IAM Access Key |
| `AWS_SECRET_ACCESS_KEY` | `your_aws_secret_key_here` | AWS IAM Secret Key |
| `AWS_REGION` | `ap-southeast-2` | AWS Region (Sydney) |
| `S3_BUCKET_NAME` | `ghost.hire` | S3 Evidence Storage |
| `DYNAMODB_TABLE_NAME` | `GhostHireReports` | DynamoDB Audit & Community Table |

> 🔒 **Security Note**: By adding these keys in the Vercel Dashboard, your keys stay 100% private and are NEVER exposed in your public GitHub repository!

---

## 🚀 Step 4: Click "Deploy"!

1. Click **Deploy**.
2. Vercel will:
   - Install Node dependencies and build the React frontend (`frontend/dist`).
   - Bundle Python serverless routes (`api/index.py`).
   - Assign you a live production URL like `https://ghosthire.vercel.app`!
3. Open your live URL and test:
   - WhatsApp screenshot scanning (OCR)
   - Real-time explainable risk dial
   - Community Radar search
   - Pitch Deck modal & Architecture PDF download

---

## 🧪 Local Testing Reminder
To run locally anytime on your laptop:
- Run `run_dev.bat` (Live dev server with instant hot reload)
- Or run `run_production.bat` (Full production build on `http://127.0.0.1:8000`)
