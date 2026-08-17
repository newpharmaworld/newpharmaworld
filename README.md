# New Pharma World 🏥

> **Your Trusted Pharmaceutical Partner**  
> Kodambakkam, Chennai – 600024, Tamil Nadu, India

A complete, production-ready, 100% free-tier pharmaceutical business website built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Firebase Spark Plan**, deployable for free to **GitHub Pages**.

---

## 🌟 Key Architecture & Highlights

- **100% Free Primary Hosting**: Served as a static Single Page Application (SPA) on **GitHub Pages**.
- **100% Free Backend Services**:
  - **Firebase Authentication**: Secure Email/Password and Google sign-in for the business administrator.
  - **Cloud Firestore**: Real-time NoSQL database for products, specialities, partner brands, homepage copy, business contact details, and incoming enquiries (within Spark free tier limits).
  - **Firebase Storage**: Secure media storage with client-side image compression to preserve free-tier quotas.
- **Zero Server Overhead**: No traditional Node.js/Express server or paid backend required.
- **Instant Live Synchronization**: Updates made in `/admin` (changing contact phone, adding medicines, editing hero copy) immediately reflect on the public website without redeploying code or triggering rebuilds.
- **GitHub Pages SPA Routing**: Configured with `404.html` and query redirect restore scripts so subroute refreshes (e.g. `/products`, `/admin/products`) never return 404 errors.
- **Automated GitHub Actions CI/CD**: Automatic build and deployment to GitHub Pages upon pushing to the `main` branch.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
Ensure you have **Node.js (v18+)** and **npm** installed.

### 2. Clone & Install Dependencies
```bash
git clone <YOUR_REPOSITORY_URL>
cd Pharma
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` (your Firebase config is already pre-configured):
```env
VITE_FIREBASE_API_KEY=AIzaSyCT_utCS2OOfj1zd7YpGP3oZRfMyp_UNc8
VITE_FIREBASE_AUTH_DOMAIN=new-pharma-world.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=new-pharma-world
VITE_FIREBASE_STORAGE_BUCKET=new-pharma-world.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=221006395343
VITE_FIREBASE_APP_ID=1:221006395343:web:b96d88d19ce269d1e484ba
VITE_FIREBASE_MEASUREMENT_ID=G-WNRFLP2YFZ
```

### 4. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:5173`.

---

## 🔐 Admin Dashboard & 1-Click Initial Data Seeding

1. Go to `http://localhost:5173/admin/login` (or `/admin`).
2. Sign in with your administrator account (Email/Password or Google Sign-In).
3. On your first login, click the **"Initialize / Seed Demo Data"** button on the top banner of the Admin Dashboard.
4. This automatically populates your Cloud Firestore database with:
   - **6 Medical Specialities**: Transplant Medicine, Dialysis, Biological Vaccines, General Medicine, Fertility, Cancer Care.
   - **8 Pharmaceutical Brands**: Cipla, Sun Pharmaceutical, Dr. Reddy's, Lupin, Zydus, Mankind, Intas, Abbott.
   - **10 Demo Medicines**: With active ingredients, dosage forms, strengths, packaging details, and availability badges.
   - **Default Site Settings**: Location in Kodambakkam Chennai, operating hours, phone, WhatsApp desk, and disclaimer.

---

## 🛡️ Firebase Security Rules

Deploy the included security rules in your Firebase Console:

### Firestore Rules (`firestore.rules`)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAdmin() {
      return request.auth != null;
    }
    match /products/{productId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /specialities/{specialityId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /brands/{brandId} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /homepage/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /siteSettings/{document=**} {
      allow read: if true;
      allow write: if isAdmin();
    }
    match /enquiries/{enquiryId} {
      allow create: if true;
      allow read, update, delete: if isAdmin();
    }
  }
}
```

### Storage Rules (`storage.rules`)
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    function isAdmin() {
      return request.auth != null;
    }
    match /{folder}/{allPaths=**} {
      allow read: if true;
      allow write: if isAdmin() && request.resource.size < 5 * 1024 * 1024;
    }
  }
}
```

---

## 📦 Production Deployment to GitHub Pages

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "feat: initial release of New Pharma World"
   git branch -M main
   git remote add origin https://github.com/<USERNAME>/<REPO_NAME>.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - In your GitHub Repository, navigate to **Settings > Pages**.
   - Under **Build and deployment > Source**, select **GitHub Actions**.

3. **Deployment**:
   - The `.github/workflows/deploy.yml` workflow will automatically trigger, build the project, and publish it to `https://<USERNAME>.github.io/<REPO_NAME>/`.

---

## 📄 License & Compliance

Designed strictly for institutional pharmaceutical supply and hospital distribution. No online prescription dispensing or medical advice provided.
