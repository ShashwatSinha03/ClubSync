# ClubSync

ClubSync is a robust full-stack application designed for managing club events and memberships. It features a premium "Dark Wine Red" UI, secure role-based authentication, and a comprehensive admin dashboard.

## Tech Stack

**Frontend:**
- **Next.js 16** (App Router)
- **CSS3** (Custom Variables, Premium Dark Theme)
- **Context API** (State Management)

**Backend:**
- **Node.js & Express**
- **Prisma ORM**
- **MongoDB**
- **JWT & bcryptjs** (Authentication)

## Features

- **Role-Based Access Control (RBAC):**
  - **User:** Pending approval state (default).
  - **Member:** Can view exclusive club events.
  - **Admin:** Can manage users (approve/promote/remove) and events (create/delete).
- **Authentication:** Secure Signup/Login with password visibility toggle.
- **Admin Dashboard:** Centralized control for user & content management.
- **CLI Scripts:** Handy tools for server-side user management.

## Getting Started

### Prerequisites
- Node.js
- MongoDB Database URL

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd clubsync
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    # Create .env file with PORT, JWT_SECRET, and DATABASE_URL
    npx prisma generate
    npm run dev
    ```

3.  **Setup Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

### Useful Scripts (Backend)

Run these from the `backend` directory:

- **Make Admin:** `npm run make-admin <email>`
- **Delete User:** `npm run delete-user <email>`
- **List Users:** `npm run list-users`
