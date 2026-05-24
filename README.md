# 🚀 EarnUnity - Community-Based Micro-Task Earning Platform

EarnUnity is a modern, full-stack micro-task and freelance platform designed to connect job creators with active earners. Users can perform simple digital tasks (such as completing surveys, subscribing to channels, or testing apps) to earn rewards, while admins and clients can post tasks, manage users, and track business analytics securely.

🌐 **Live Demo:** [https://earnunity.vercel.app](https://earnunity.vercel.app)

---

## ✨ Key Features

### 👤 For Earners (Users)
* **Browse Micro-Tasks:** Filter and search through active jobs sorted by categories (YouTube, Facebook, Surveys, Apps, and more).
* **Proof Submission:** Submit completed tasks with required proof types like Screenshots, Usernames, or Transaction IDs.
* **Real-time Balance:** Track earnings dynamically on a clean, responsive user dashboard.
* **Transaction History:** A detailed ledger showing approved earnings, pending approvals, and referral bonuses.

### 👑 For Administrators (Admin Panel)
* **Dynamic Job Management:** Full CRUD operations for creating, reading, updating, and deleting tasks/jobs.
* **Task Moderation:** Review user proof submissions to approve or reject tasks with custom feedback.
* **User Balance Control:** Safely update, manage, and correct user wallets directly from the panel.
* **Advanced Analytics:** Aggregate data using custom MongoDB pipelines to monitor overall platform growth and user earnings.

---

## 🛠️ Tech Stack

EarnUnity leverages the modern **MERN Stack** ecosystem and contemporary web architectures to guarantee scalability and performance:

| Layer | Technologies Used |
|---|---|
| **Frontend** | Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui, daisyUI |
| **State & Forms** | React Hook Form, Zod (Schema Validation) |
| **Backend** | Next.js Route Handlers (Serverless API Endpoints), Node.js |
| **Database** | MongoDB, Mongoose ODM (Aggregation Pipelines) |
| **Authentication** | NextAuth.js (JWT-based secure session management) |
| **Deployment** | Vercel (Frontend & Serverless Architecture) |

---

## 📂 Architecture & Folder Structure

The repository maintains a clean, highly scalable, and modular directory design, enforcing strict boundaries between UI components and server logic:

```text
earnunity/
├── app/                  # Next.js App Router folders
│   ├── admin/            # Admin Panel sub-routing and pages
│   ├── api/              # Secure Next.js 15 Route Handlers (Async Promises)
│   │   └── admin/        # Protected admin-only endpoints (Jobs, Balance, Stats)
│   └── components/       # Reusable Global UI Components
├── lib/                  # Core infrastructure configurations (Database, Auth settings)
├── models/               # Mongoose Schemas & Data Models (User, Job, Transaction)
├── hooks/                # Custom React Hooks
└── types/                # Centrally managed TypeScript Interfaces
