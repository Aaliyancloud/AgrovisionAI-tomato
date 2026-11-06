# AgroVision AI — Plant Disease Detection & Crop Protection 🍅🌿

> **Smarter Detection. Healthier Plants.**  
> A cinematic, interactive 3D WebGL and artificial intelligence platform for real-time tomato leaf disease detection, internal botanical analysis, and practical plant care for farmers, students, and agricultural exhibitions.

---

## 🌟 Key Highlights & AI Capabilities

1. **Two-Stage AI Classification Engine**:
   - **Stage 1: Plant & Species Gatekeeper**: Analyzes image sharpness (Laplacian variance), chlorophyll absorption, and botanical morphology (lobed serrated margins vs. smooth blades, aspect ratio, and waxy cuticle gloss). Strictly rejects non-tomato leaves (e.g. Mango, Neem) and non-leaf objects before attempting disease diagnosis.
   - **Stage 2: Tomato Pathology Diagnosis**: Evaluates concentric target rings, chlorotic halos, and tissue necrotic clustering across 10 verified tomato conditions based on Meta's DINOv2 vision transformer architecture (`rodynaemad/plant-disease-dinov2-small`) and PlantVillage dataset benchmarks.
2. **Interactive 3D Tomato Plant & AI Healing Simulation**:
   - Inspect tomato foliage in full 3D with 360° drag rotation and camera controls.
   - Click the ripe red tomato to smoothly zoom in for a close-up botanical view.
   - Simulate AI scans transitioning blighted lesions into healthy emerald leaves.
3. **Bilingual English & Urdu Interface (`EN | اردو`)**:
   - Seamless animated iOS-style pill toggle.
   - Automatically switches layout to Right-to-Left (`dir="rtl"`) with authentic typography (`Noto Sans Arabic` & `Noto Nastaliq Urdu`).
4. **Comprehensive Disease & Treatment Library**:
   - Covers Early Blight, Late Blight, Septoria Leaf Spot, Bacterial Spot, Yellow Leaf Curl, and Healthy Foliage with certified organic recipes (neem oil, copper soap, potassium bicarbonate).
5. **Agricultural Microclimate & Blight Risk Monitor**:
   - Real-time humidity, dew point, and fungal spore warnings tailored for Punjab, Sindh, and greenhouse tunnels.
6. **Dual Edition for Everyone**:
   - Modern React + Vite SPA for web deployment (Vercel & GitHub Pages).
   - Standalone Vanilla HTML, CSS, JavaScript & Python edition in `student_project/` for school computer labs.

---

## ⚡ Deployment Options

### Option A: 1-Click Deploy on Vercel (Recommended)
This repository includes a pre-configured `vercel.json` optimized for Vite SPAs with route rewrites and asset caching:
1. Log in to **[vercel.com](https://vercel.com)** with your GitHub account.
2. Click **Add New... > Project** and select your GitHub repository.
3. Framework Preset will automatically detect **Vite**.
4. Click **Deploy**. Vercel will build and assign you an instant live URL (e.g., `https://agrovision-ai.vercel.app`).

---

### Option B: Deploy to GitHub Pages

#### Method 1: Using the Pre-Built `/docs` Folder (Instant)
1. Push your repository to GitHub.
2. In your GitHub repository, click **Settings** (gear icon) > **Pages** (on the left menu).
3. Under **Build and deployment > Source**, select **Deploy from a branch**.
4. Set the branch to **`main`** and the folder to **`/docs`**.
5. Click **Save**. Your site will be live at:
   ```
   https://<YOUR-GITHUB-USERNAME>.github.io/<REPO-NAME>/
   ```

#### Method 2: Using GitHub Actions
The repository includes `.github/workflows/deploy.yml`. In **Settings > Pages**, choose **GitHub Actions** as the Source to automatically build on every `git push`.

---

## 💻 Local Development Setup

### Full-Stack React Application
```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### Standalone Student Edition (Vanilla HTML/CSS/JS + Python)
```bash
cd student_project
python3 server.py
# or on Windows:
python server.py
```
Open **`http://localhost:8000`** in your browser.

---

## 🌾 Built for Sustainable Agriculture
Agriculture is the foundation and economic backbone of Pakistan. AgroVision AI is dedicated to providing smallholder farmers and students with clean, accessible crop protection for **STEAM Exhibition 2026: Safe & Clean Agriculture**.
