# 🌿 EcoTrack Sri Lanka 🇱🇰
### AI-Powered Smart Waste Management & Circular Recycling Platform
> **ස්මාර්ට් අපද්‍රව්‍ය කළමනාකරණ පද්ධතිය | ஸ்மார்ட் கழிவு மேலாண்மை அமைப்பு**

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Tech Stack](#-tech-stack)
3. [Project Structure](#-project-structure)
4. [Role-Based Access Control](#-role-based-access-control)
5. [Demo Login Credentials](#-demo-login-credentials)
6. [All Features by Role](#-all-features-by-role)
7. [Backend API Modules](#-backend-api-modules)
8. [Getting Started](#-getting-started)
9. [Environment Variables](#-environment-variables)
10. [Seed Data](#-seed-data)
11. [Standards & Compliance](#-standards--compliance)

---

## 🌍 Overview

**EcoTrack Sri Lanka** is an enterprise-grade, cloud-native, AI-assisted waste governance platform and **Progressive Web App (PWA)** designed to modernize municipal solid waste collection, citizen grievance redressal, and community recycling across Sri Lankan administrative territories.

Built on the modern **MERN (MongoDB, Express, React, Node.js) + TypeScript** stack, EcoTrack connects six distinct stakeholder groups:

| Stakeholder | Description |
|---|---|
| 👥 **Residents / Citizens** | GPS-tagged, photo-evidenced waste reporting, collection calendar alerts, and circular recycling rewards |
| 🏛️ **Municipal Officers** | Multi-tenant complaint triage, fleet dispatch, service zone management, and SLA analytics |
| 👷 **Collection Workers** | Task queue, collection photo evidence capture, and offline-first task logging |
| 🚛 **Drivers** | Turn-by-turn routing, vehicle management, and collection task coordination |
| ♻️ **Recycling Partners** | Depot material drop-off logging, green points issuance, and transaction management |
| 🛡️ **System Administrators** | Global multi-tenant onboarding, AI model controls, user management, and audit trails |

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | LTS | Runtime environment |
| **Express** | ^4.21.2 | REST API framework |
| **TypeScript** | ^5.7.3 | Type-safe development |
| **MongoDB + Mongoose** | ^8.9.5 | NoSQL database with geospatial indexes |
| **JWT (jsonwebtoken)** | ^9.0.2 | Stateless authentication |
| **bcryptjs** | ^2.4.3 | Password hashing (salt rounds: 10) |
| **Zod** | ^3.24.1 | Schema validation & request parsing |
| **Helmet** | ^8.0.0 | HTTP security headers |
| **Multer** | ^1.4.5 | File / image uploads |
| **Morgan** | ^1.10.0 | HTTP request logging |
| **CORS** | ^2.8.5 | Cross-origin resource sharing |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | ^19.2.8 | UI framework |
| **Vite** | ^8.3.0 | Build tool & dev server |
| **TypeScript** | ~6.0.2 | Type-safe development |
| **Tailwind CSS** | ^4.3.3 | Utility-first styling |
| **React Router DOM** | ^7.18.4 | Client-side routing |
| **Axios** | ^1.20.0 | HTTP client |
| **React Leaflet** | ^5.0.0 | Interactive maps |
| **Recharts** | ^3.10.1 | Data visualization / analytics charts |
| **Lucide React** | ^1.53.0 | Icon library |
| **Sonner** | ^2.0.8 | Toast notifications |
| **canvas-confetti** | ^1.9.4 | Reward celebration animations |

---

## 🏗️ Project Structure

```text
ecotrack-srilanka/
├── docs/
│   └── SRS_EcoTrack_SriLanka.md         # IEEE Std 830-1998 Software Requirements Spec
│
├── backend/                              # Node.js + Express + TypeScript API
│   ├── .env                              # Environment variables (local)
│   ├── .env.example                      # Environment template
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── server.ts                     # HTTP server entry point
│       ├── app.ts                        # Express app, middleware, router
│       ├── config/                       # DB, env, CORS, storage configuration
│       ├── middleware/                   # Auth, RBAC, Zod validation, rate limit, uploads
│       ├── modules/                      # Feature-based modular architecture
│       │   ├── ai-classification/        # AI waste image classification adapter
│       │   ├── analytics/               # KPI metrics & reporting endpoints
│       │   ├── audit-logs/              # Immutable audit trail records
│       │   ├── auth/                    # Login, register, JWT refresh
│       │   ├── collection-tasks/        # Field task assignment & tracking
│       │   ├── notifications/           # Push notification pipeline
│       │   ├── organizations/           # Multi-tenant org management
│       │   ├── recycling-centers/       # Depot locator & management
│       │   ├── recycling-transactions/  # Drop-off logging & verification
│       │   ├── rewards/                 # Green points ledger
│       │   ├── routes/                  # GIS route optimization
│       │   ├── schedules/               # Collection schedule management
│       │   ├── service-zones/           # GeoJSON boundary management
│       │   ├── upload/                  # Image upload handling
│       │   ├── users/                   # User CRUD & profile
│       │   ├── vehicles/                # Fleet vehicle management
│       │   └── waste-reports/           # Citizen complaint lifecycle
│       ├── services/                    # AI adapter, GIS routing, notifications
│       ├── scripts/
│       │   └── seed.ts                  # Database seed with sample data
│       ├── types/                       # Shared TypeScript type definitions
│       └── utils/                       # Utility helpers
│
└── frontend/                            # React 19 + Vite + TypeScript + Tailwind PWA
    ├── index.html
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    ├── public/                          # Service Worker & PWA Manifest
    └── src/
        ├── App.tsx                      # Root component & route definitions
        ├── main.tsx                     # React DOM entry point
        ├── api/                         # Axios API client layer
        ├── assets/                      # Static images & icons
        ├── components/                  # Reusable UI components & Bento grid
        ├── context/                     # React context providers (Auth, etc.)
        ├── pages/
        │   ├── LandingPage.tsx          # Public marketing landing page
        │   ├── LoginPage.tsx            # Multi-role login form
        │   ├── RegisterPage.tsx         # Citizen self-registration
        │   ├── RecyclingLocatorPage.tsx # Public recycling center map
        │   ├── WasteSegregationGuide.tsx# CEA color-coded guide
        │   ├── resident/                # Resident portal pages
        │   ├── municipal/               # Municipal officer portal pages
        │   ├── worker/                  # Field worker & driver portal pages
        │   ├── partner/                 # Recycling partner portal pages
        │   └── admin/                   # System admin portal pages
        └── types.ts                     # Shared TypeScript interfaces
```

---

## 🔐 Role-Based Access Control

EcoTrack implements **backend-enforced RBAC** with **6 distinct roles**. Every API route is protected by JWT authentication middleware that validates the user's role before granting access.

```
┌──────────────────────────────────────────────────────────────────────┐
│                    RBAC HIERARCHY                                    │
├──────────────────────┬───────────────────────────────────────────────┤
│ SYSTEM_ADMIN         │ Full system access across all tenants         │
│ MUNICIPAL_OFFICER    │ Org-scoped: complaints, schedules, fleet      │
│ COLLECTION_WORKER    │ Assigned tasks, offline sync, evidence upload │
│ DRIVER               │ Route navigation, vehicle, task coordination  │
│ RECYCLING_PARTNER    │ Drop-off verification, green points issuance  │
│ RESIDENT             │ Reports, calendar, rewards, recycling map     │
└──────────────────────┴───────────────────────────────────────────────┘
```

### RBAC Permission Matrix

| Feature / Resource | RESIDENT | MUNICIPAL_OFFICER | COLLECTION_WORKER | DRIVER | RECYCLING_PARTNER | SYSTEM_ADMIN |
|---|:---:|:---:|:---:|:---:|:---:|:---:|
| Submit Waste Report | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View Own Reports | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View All Reports (org) | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Triage / Update Report Status | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| AI Classification Results | ❌ | ✅ | ✅ | ❌ | ❌ | ✅ |
| Manage Collection Tasks | ❌ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Manage Schedules | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| Manage Vehicles & Fleet | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| View / Manage Service Zones | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ |
| GIS Route Optimization | ❌ | ✅ | ❌ | ✅ | ❌ | ✅ |
| Verify Recycling Drop-offs | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| Issue Green Points | ❌ | ❌ | ❌ | ❌ | ✅ | ✅ |
| View Reward Points | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View Analytics Dashboard | ❌ | ✅ | ❌ | ❌ | ✅ | ✅ |
| Manage Organizations | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| Manage All Users | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View Audit Logs | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| AI Model Configuration | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| View Collection Calendar | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| View Recycling Center Map | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

---

## 🔑 Demo Login Credentials

> **⚠️ Important:** These are seed data credentials for development/demo purposes only.  
> Run `npm run seed` in the `/backend` directory first to populate the database.

**Password for ALL accounts:** `Password123!`

---

### 👤 Resident (Citizen Portal)

| Field | Value |
|---|---|
| **Email** | `resident@ecotrack.lk` |
| **Password** | `Password123!` |
| **Full Name** | Kasun Perera |
| **Role** | `RESIDENT` |
| **Organization** | Public (no org) |
| **Dashboard URL** | `/resident/dashboard` |

---

### 🏛️ Municipal Officer (Colombo Municipal Council)

| Field | Value |
|---|---|
| **Email** | `officer@colombo.mc.gov.lk` |
| **Password** | `Password123!` |
| **Full Name** | Eng. Shamila Mohamed |
| **Role** | `MUNICIPAL_OFFICER` |
| **Organization** | Colombo Municipal Council |
| **Service Zone** | District 2B – Cinnamon Gardens & Kollupitiya |
| **Dashboard URL** | `/municipal/dashboard` |

---

### 👷 Collection Worker (Field Crew)

| Field | Value |
|---|---|
| **Email** | `worker@colombo.mc.gov.lk` |
| **Password** | `Password123!` |
| **Full Name** | Kamal Jayasinghe |
| **Role** | `COLLECTION_WORKER` |
| **Organization** | Colombo Municipal Council |
| **Service Zone** | District 2B – Cinnamon Gardens & Kollupitiya |
| **Dashboard URL** | `/worker/dashboard` |

---

### 🚛 Driver (Fleet Operations)

| Field | Value |
|---|---|
| **Email** | `driver@colombo.mc.gov.lk` |
| **Password** | `Password123!` |
| **Full Name** | Bandara Jayawardena |
| **Role** | `DRIVER` |
| **Organization** | Colombo Municipal Council |
| **Assigned Vehicle** | WP-DA-4892 (Compactor Truck, 7.5 MT) |
| **Dashboard URL** | `/worker/dashboard` |

---

### ♻️ Recycling Partner

| Field | Value |
|---|---|
| **Email** | `partner@ecospindles.lk` |
| **Password** | `Password123!` |
| **Full Name** | Nimal Fernando |
| **Role** | `RECYCLING_PARTNER` |
| **Organization** | EcoSpindles Circular Recycling |
| **Dashboard URL** | `/partner/dashboard` |

---

### 🛡️ System Administrator

| Field | Value |
|---|---|
| **Email** | `admin@ecotrack.lk` |
| **Password** | `Password123!` |
| **Full Name** | System Administrator |
| **Role** | `SYSTEM_ADMIN` |
| **Organization** | Global (all tenants) |
| **Dashboard URL** | `/admin/dashboard` |

---

## ✨ All Features by Role

### 👤 RESIDENT — Citizen Portal

| # | Feature | Description |
|---|---|---|
| 1 | **📊 Resident Dashboard** | Live KPI cards (total reports, resolved, green points balance, recycling transactions), recent activity feed |
| 2 | **📸 Report Waste** | GPS-tagged, photo-evidenced complaint submission with AI-assisted category classification |
| 3 | **🗂️ My Reports** | Full history of submitted complaints with live status tracking (SUBMITTED → ASSIGNED → IN_PROGRESS → RESOLVED) |
| 4 | **📅 Collection Calendar** | Zone-specific waste collection schedule with category-color coding |
| 5 | **🏆 Rewards & Green Points** | Points ledger, transaction history, redemption overview, confetti celebration on milestones |
| 6 | **🗺️ Recycling Locator** | Interactive Leaflet map of all nearby recycling centers with accepted materials & opening hours |
| 7 | **📖 Waste Segregation Guide** | CEA-compliant color-coded segregation guide for organic, recyclable, and hazardous waste |

---

### 🏛️ MUNICIPAL OFFICER — Municipal Council Portal

| # | Feature | Description |
|---|---|---|
| 1 | **📊 Municipal Dashboard** | SLA compliance rate, active complaints, zone coverage KPIs, trend charts (Recharts), fleet status overview |
| 2 | **🗂️ Complaints Management** | Full complaint inbox — filter by zone/status/severity, assign to workers, update status, add notes |
| 3 | **🗺️ Interactive GIS Map** | Live map of all active waste reports with geospatial clustering, zone boundary overlays |
| 4 | **📅 Schedules Management** | Create, edit, and deactivate collection schedules per zone and waste category |
| 5 | **🔔 Notifications** | Broadcast alerts to citizens in a service zone about schedule changes or emergencies |
| 6 | **📈 Analytics** | KPI trend analysis, zone-level performance, SLA breach reports, waste category volume charts |

---

### 👷 COLLECTION WORKER — Field Worker Portal

| # | Feature | Description |
|---|---|---|
| 1 | **📋 Worker Dashboard** | Assigned task queue with priority indicators, today's route summary, completion status |
| 2 | **✅ Task Management** | Accept, start, and complete collection tasks; upload photo evidence on task closure |
| 3 | **📴 Offline-First Sync** | IndexedDB-based offline task caching with automatic background sync on reconnect |
| 4 | **📊 Performance Stats** | Daily/weekly task completion rates, average response time |

---

### 🚛 DRIVER — Fleet Operations Portal

| # | Feature | Description |
|---|---|---|
| 1 | **🚛 Driver Dashboard** | Route summary with vehicle context (WP-DA-4892 Compactor Truck, 7.5 MT capacity) |
| 2 | **🗺️ Route Navigation** | Optimized turn-by-turn route to collection task locations on integrated Leaflet map |
| 3 | **🔧 Vehicle Status** | View assigned vehicle details, capacity, and operational status |
| 4 | **📋 Task Coordination** | Linked task list synced with Collection Worker assignments |

---

### ♻️ RECYCLING PARTNER — Depot Portal

| # | Feature | Description |
|---|---|---|
| 1 | **📊 Partner Dashboard** | Transaction volume, material breakdown charts (Recharts), points issued KPIs |
| 2 | **🔍 Drop-off Verification** | Log citizen drop-offs by material type, weight, and auto-calculate green points |
| 3 | **💎 Green Points Issuance** | Issue and confirm reward points to citizen accounts upon verified drop-off |
| 4 | **📦 Materials Management** | Accepted materials: Plastic (PET), Paper, Metal, Glass, E-Waste |
| 5 | **📈 Transaction History** | Full log of all recycling transactions with filter by date, material, and citizen |

---

### 🛡️ SYSTEM ADMIN — Global Admin Portal

| # | Feature | Description |
|---|---|---|
| 1 | **📊 Admin Dashboard** | System-wide KPIs: total organizations, users by role, waste reports volume, rewards issued |
| 2 | **🏢 Organization Management** | Create and manage Municipal Councils and Recycling Consortiums; activate/deactivate |
| 3 | **👥 User Management** | View, create, edit, and deactivate any user across all tenants; assign roles and orgs |
| 4 | **🤖 AI Model Configuration** | Configure and toggle waste classification AI adapter; review confidence thresholds |
| 5 | **📜 Audit Logs** | Immutable audit trail of all system events — login, status changes, config edits |
| 6 | **🗺️ Global GIS View** | System-wide map of all service zones and active reports across all organizations |
| 7 | **⚙️ System Settings** | Manage global platform settings, notification pipelines, and API integrations |

---

### 🌐 Public Features (No Login Required)

| # | Feature | Description |
|---|---|---|
| 1 | **🏠 Landing Page** | Marketing homepage with features overview, platform stats, and CTA buttons |
| 2 | **🔐 Login Page** | Multi-role login with form validation and JWT-based session management |
| 3 | **📝 Register Page** | Citizen self-registration (RESIDENT role) with email & password |
| 4 | **🗺️ Recycling Locator** | Public-facing interactive map of all recycling centers with accepted materials |
| 5 | **📖 Waste Segregation Guide** | Public CEA-compliant guide with color-coded waste categories |

---

## 🔌 Backend API Modules

All API routes are prefixed with `/api/v1/`.

| Module | Base Path | Description |
|---|---|---|
| **Auth** | `/api/v1/auth` | Register, login, refresh JWT token |
| **Users** | `/api/v1/users` | User CRUD, profile updates |
| **Organizations** | `/api/v1/organizations` | Multi-tenant org management |
| **Waste Reports** | `/api/v1/waste-reports` | Complaint CRUD, status lifecycle |
| **Collection Tasks** | `/api/v1/collection-tasks` | Task assignment & field updates |
| **Schedules** | `/api/v1/schedules` | Collection schedule management |
| **Service Zones** | `/api/v1/service-zones` | GeoJSON zone boundary management |
| **Vehicles** | `/api/v1/vehicles` | Fleet vehicle registry |
| **Routes** | `/api/v1/routes` | GIS route optimization |
| **Recycling Centers** | `/api/v1/recycling-centers` | Depot locator & management |
| **Recycling Transactions** | `/api/v1/recycling-transactions` | Drop-off logging |
| **Rewards** | `/api/v1/rewards` | Green points ledger |
| **AI Classification** | `/api/v1/ai-classification` | Waste image classification |
| **Analytics** | `/api/v1/analytics` | KPI aggregation endpoints |
| **Notifications** | `/api/v1/notifications` | Push notification dispatch |
| **Audit Logs** | `/api/v1/audit-logs` | Immutable system event trail |
| **Upload** | `/api/v1/upload` | Multipart image upload (Multer) |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** v18+ (LTS recommended)
- **MongoDB** v6+ (local instance or MongoDB Atlas)
- **npm** v9+

---

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/ecotrack-srilanka.git
cd ecotrack-srilanka
```

#### Install Backend Dependencies
```bash
cd backend
npm install
```

#### Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

### 2. Configure Environment Variables

#### Backend
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets
```

#### Frontend
```bash
cd frontend
# Create .env file
echo "VITE_API_URL=http://localhost:5000/api/v1" > .env
```

---

### 3. Seed the Database

Run the seed script to populate MongoDB with organizations, service zones, vehicles, sample reports, recycling centers, and **all 6 demo user accounts**:

```bash
cd backend
npm run seed
```

**Expected output:**
```
[Seed] Connecting to MongoDB...
[Seed] Connected.
[Seed] Cleared existing data.
[Seed] Database populated successfully with authentic Sri Lankan datasets!
-----------------------------------------------------------------
Sample Logins (Password for all: Password123!)
👤 Resident:          resident@ecotrack.lk
🏛️ Municipal Officer: officer@colombo.mc.gov.lk
👷 Field Worker:      worker@colombo.mc.gov.lk
🚛 Driver:            driver@colombo.mc.gov.lk
♻️ Recycling Partner: partner@ecospindles.lk
🛡️ System Admin:      admin@ecotrack.lk
-----------------------------------------------------------------
```

---

### 4. Start Development Servers

#### Backend API Server (Terminal 1)
```bash
cd backend
npm run dev
# → API running on http://localhost:5000
```

#### Frontend Dev Server (Terminal 2)
```bash
cd frontend
npm run dev
# → Vite dev server on http://localhost:5173
```

Open **http://localhost:5173** in your browser and log in with any of the demo credentials above.

---

## ⚙️ Environment Variables

### Backend — `backend/.env`

```env
# MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/ecotrack_srilanka

# JWT Secrets (use long, random strings in production)
JWT_SECRET=your_super_secret_jwt_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# CORS allowed origins
CORS_ORIGIN=http://localhost:5173

# File upload directory
UPLOAD_DIR=uploads/
```

### Frontend — `frontend/.env`

```env
# Backend API base URL
VITE_API_URL=http://localhost:5000/api/v1
```

---

## 🌱 Seed Data

The seed script (`backend/src/scripts/seed.ts`) populates the following data:

### Organizations
| Organization | Type | District |
|---|---|---|
| **Colombo Municipal Council** | `MUNICIPAL_COUNCIL` | Colombo |
| **Kandy Municipal Council** | `MUNICIPAL_COUNCIL` | Kandy |
| **EcoSpindles Circular Recycling** | `RECYCLING_CONSORTIUM` | Colombo |

### Service Zones (Colombo)
| Zone | Coverage Area |
|---|---|
| District 2B – Cinnamon Gardens & Kollupitiya | Lat 6.895–6.915, Lng 79.851–79.870 |
| District 1 – Fort & Pettah Market | Lat 6.930–6.945, Lng 79.840–79.860 |

### Vehicles
| Registration | Type | Capacity | Driver |
|---|---|---|---|
| **WP-DA-4892** | Compactor Truck | 7.5 MT | Bandara Jayawardena |
| **WP-LH-1029** | Tipper | 4.0 MT | Unassigned |

### Recycling Centers
| Center | Location | Accepts |
|---|---|---|
| EcoSpindles Kirulapone Aggregation Hub | Baseline Road, Colombo 05 | Plastic, Paper, Metal |
| CEA Community Resource Recovery Center | Battaramulla | Plastic, Glass, E-Waste, Paper |

### Sample Waste Reports (3 pre-seeded)
| Ref No | Category | Severity | Status |
|---|---|---|---|
| ET-202610-00101 | Plastic | HIGH | ASSIGNED |
| ET-202610-00102 | Organic | CRITICAL | SUBMITTED |
| ET-202610-00103 | E-Waste | MEDIUM | RESOLVED |

### Sample Recycling Transaction
- **Resident:** Kasun Perera dropped off 5kg PET Bottles + 8kg Cardboard
- **Verified by:** Nimal Fernando (EcoSpindles)
- **Points Awarded:** 90 Green Points (50 for plastic + 40 for paper)

---

## 🔒 Standards & Compliance

| Standard | Details |
|---|---|
| **Specification** | IEEE Std 830-1998 / ISO/IEC/IEEE 29148:2018 |
| **Data Protection** | Personal Data Protection Act (PDPA) No. 9 of 2022 (Sri Lanka) |
| **Waste Segregation** | Central Environmental Authority (CEA) color-coded directives |
| **Accessibility** | WCAG 2.2 Level AA |
| **Timezone** | `Asia/Colombo` (UTC+05:30) |
| **Localization** | Trilingual — English (`en`), Sinhala (`si`), Tamil (`ta`) |
| **Security** | OWASP Top 10 mitigations, Helmet.js, rate limiting, CORS |
| **Performance Target** | p95 API response < 500ms |
| **PWA** | Offline-first with Service Worker + IndexedDB sync |

---

## 📚 Full Documentation

👉 **[Software Requirements Specification (SRS)](file:///e:/Project/Projects/Eco-Track-SriLanka/docs/SRS_EcoTrack_SriLanka.md)**

---

<p align="center">
  Made with 💚 for a Greener Sri Lanka<br/>
  <strong>EcoTrack Sri Lanka Engineering Team</strong>
</p>
