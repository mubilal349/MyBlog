<img width="1920" height="951" alt="image" src="https://github.com/user-attachments/assets/f7672b7e-3e7d-4da4-9556-34313264be5c" />


# 📝 MyBlog — Full-Stack Blog & Content Management System

A modern full-stack blogging platform built with the **MERN stack**, featuring authentication, role-based access control (RBAC), blog management, comment moderation, likes, and a dedicated administration/editor dashboard.

The project is designed to demonstrate real-world full-stack development practices, including secure authentication, protected APIs, role-based permissions, RESTful architecture, and a responsive React interface.

---

## 🚀 Features

### 🔐 Authentication

* User registration
* User login
* JWT-based authentication
* Persistent authentication after page refresh
* Secure logout
* Protected routes
* Authentication middleware
* Automatic token handling
* Unauthorized access handling

---

## 👥 Role-Based Access Control

The application implements **RBAC (Role-Based Access Control)** with three roles:

| Role      | Permissions                                 |
| --------- | ------------------------------------------- |
| 👤 User   | Read blogs, like posts, create comments     |
| ✍️ Editor | Create posts, edit posts, moderate comments |
| 🛡️ Admin | Full system access                          |

### User

Regular users can:

* Browse published blogs
* Read individual blog posts
* Like/unlike posts
* Create comments
* View approved comments

### Editor

Editors have access to the editorial dashboard and can:

* Create blog posts
* Edit blog posts
* Manage comments
* Approve comments
* Reject comments
* View editorial content

Editors **cannot** perform administrator-only operations such as:

* Managing users
* Deleting comments
* Accessing administrator-only settings
* Other restricted administrative operations

### Admin

Administrators have complete access to the dashboard:

* Dashboard overview
* Create posts
* Edit posts
* Delete posts
* Manage users
* Manage comments
* Approve comments
* Reject comments
* Delete comments
* Settings
* Administrative operations

---

# 🏗️ System Architecture

```text
                         ┌──────────────────┐
                         │      React       │
                         │    Frontend      │
                         └────────┬─────────┘
                                  │
                                  │ HTTP / REST API
                                  ▼
                         ┌──────────────────┐
                         │     Express      │
                         │      Server      │
                         └────────┬─────────┘
                                  │
                 ┌────────────────┼────────────────┐
                 │                │                │
                 ▼                ▼                ▼
          ┌────────────┐   ┌────────────┐   ┌────────────┐
          │    Auth    │   │    RBAC    │   │ Controllers│
          │ Middleware │   │ Middleware │   │            │
          └────────────┘   └────────────┘   └─────┬──────┘
                                                   │
                                                   ▼
                                           ┌──────────────┐
                                           │   MongoDB    │
                                           │   Database   │
                                           └──────────────┘
```

---

# 🛠️ Technology Stack

## Frontend

* React
* React Router
* Axios
* Tailwind CSS
* Lucide React
* JavaScript
* Context API

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt / bcryptjs
* CORS

## Development

* Vite
* Nodemon
* Git
* GitHub

---

# 📁 Project Structure

```text
MyBlog/
│
├── client/
│   │
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx
│   │   │   │   ├── Footer.jsx
│   │   │   │   └── BackToTop.jsx
│   │   │   │
│   │   │   ├── Hero.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Categories.jsx
│   │   │   └── Chatboat.jsx
│   │   │
│   │   ├── context/
│   │   │   ├── AuthContext.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── BlogDetails.jsx
│   │   │   ├── Categories.jsx
│   │   │   ├── Contact.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Unauthorized.jsx
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx
│   │   │       ├── Overview.jsx
│   │   │       ├── Posts.jsx
│   │   │       ├── Users.jsx
│   │   │       ├── Comments.jsx
│   │   │       └── Settings.jsx
│   │   │
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   │
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── blogController.js
│   │   │   └── commentController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js
│   │   │   └── roleMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Blog.js
│   │   │   └── Comment.js
│   │   │
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── blogRoutes.js
│   │   │   └── commentRoutes.js
│   │   │
│   │   ├── config/
│   │   │   └── db.js
│   │   │
│   │   └── server.js
│   │
│   └── package.json
│
└── README.md
```

---

# 🔑 Authentication Flow

The application uses JWT authentication.

```text
User
 │
 │ Login
 ▼
React Frontend
 │
 │ POST /api/auth/login
 ▼
Express Backend
 │
 │ Validate credentials
 ▼
MongoDB
 │
 │ User found
 ▼
JWT Token
 │
 ▼
React
 │
 │ localStorage
 ▼
Authenticated Requests
```

The token is attached to protected requests:

```http
Authorization: Bearer <token>
```

---

# 🛡️ Role-Based Authorization

The backend contains reusable role middleware.

```js
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "You do not have permission to perform this action.",
      });
    }

    next();
  };
};
```

Predefined permissions:

```js
export const adminOnly = requireRole("admin");

export const editorOrAdmin = requireRole("editor", "admin");
```

This allows the backend to enforce permissions independently of the frontend.

---

# ✍️ Editor Permissions

Editors are allowed to access:

```text
Editor Dashboard
      │
      ├── Overview
      │
      ├── Manage Posts
      │     ├── Create
      │     └── Edit
      │
      └── Manage Comments
            ├── View
            ├── Approve
            └── Reject
```

The frontend can display navigation items based on the user's role:

```js
const visibleMenuItems = menuItems.filter((item) =>
  item.roles.includes(user?.role)
);
```

Example:

```js
const menuItems = [
  {
    name: "Overview",
    path: "overview",
    icon: Home,
    roles: ["admin", "editor"],
  },
  {
    name: "Manage posts",
    path: "posts",
    icon: FileText,
    roles: ["admin", "editor"],
  },
  {
    name: "Manage users",
    path: "users",
    icon: Users,
    roles: ["admin"],
  },
  {
    name: "Manage comments",
    path: "comments",
    icon: MessageSquare,
    roles: ["admin", "editor"],
  },
  {
    name: "Settings",
    path: "settings",
    icon: Settings,
    roles: ["admin"],
  },
];
```

---

# 📝 Blog API

## Create Blog

```http
POST /api/blogs
```

Required authorization:

```text
Admin / Editor
```

---

## Get Published Blogs

```http
GET /api/blogs
```

Public endpoint.

---

## Get Blog By Slug

```http
GET /api/blogs/:slug
```

Public endpoint.

---

## Get All Blogs

```http
GET /api/blogs/admin/all
```

Used for dashboard/admin content management.

---

## Update Blog

```http
PUT /api/blogs/:id
```

Allowed roles:

```text
Admin
Editor
```

---

## Delete Blog

```http
DELETE /api/blogs/:id
```

Allowed role:

```text
Admin
```

---

# 💬 Comment API

## Create Comment

```http
POST /api/comments
```

Available to authenticated users.

New comments start as:

```text
Pending
```

---

## Get Approved Comments

```http
GET /api/comments/blog/:blogId
```

Public endpoint.

---

## Get All Comments

```http
GET /api/comments
```

Allowed roles:

```text
Editor
Admin
```

---

## Approve Comment

```http
PATCH /api/comments/:id/approve
```

Allowed roles:

```text
Editor
Admin
```

---

## Reject Comment

```http
PATCH /api/comments/:id/reject
```

Allowed roles:

```text
Editor
Admin
```

---

## Delete Comment

```http
DELETE /api/comments/:id
```

Allowed role:

```text
Admin
```

---

# 🧭 Frontend Route Protection

Protected routes use a reusable `ProtectedRoute` component.

Example:

```jsx
<Route
  path="/admin"
  element={
    <ProtectedRoute allowedRoles={["admin", "editor"]}>
      <AdminDashboard />
    </ProtectedRoute>
  }
>
  <Route
    index
    element={<Navigate to="/admin/overview" replace />}
  />

  <Route
    path="overview"
    element={<Overview />}
  />

  <Route
    path="posts"
    element={<Posts />}
  />

  <Route
    path="comments"
    element={<Comments />}
  />
</Route>
```

Admin-only routes can use:

```jsx
<ProtectedRoute allowedRoles={["admin"]}>
  <UsersPage />
</ProtectedRoute>
```

---

# ⚠️ Frontend vs Backend Security

The frontend hides navigation items based on roles, but **frontend role checks are not enough for security**.

For example:

```text
Frontend
   │
   ├── Hide Users menu from Editor
   │
   └── Show Posts menu to Editor
```

The backend still validates every request:

```text
Editor
  │
  │ DELETE /api/comments/123
  ▼
Backend
  │
  ├── Authenticate JWT
  │
  ├── Check role
  │
  └── 403 Forbidden
```

This prevents users from bypassing the UI by manually calling APIs.

---

# 📊 Dashboard

The dashboard provides a centralized control panel for content management.

### Admin Dashboard

```text
┌──────────────────────────────┐
│ The Desk                     │
│ Blog control room            │
├──────────────────────────────┤
│ Overview                     │
│ Manage posts                 │
│ Manage users                 │
│ Manage comments              │
│ Settings                     │
├──────────────────────────────┤
│ User Profile                 │
│ Theme                        │
│ Logout                       │
└──────────────────────────────┘
```

### Editor Dashboard

```text
┌──────────────────────────────┐
│ The Desk                     │
│ Blog control room            │
├──────────────────────────────┤
│ Overview                     │
│ Manage posts                 │
│ Manage comments              │
├──────────────────────────────┤
│ Editor Profile               │
│ Theme                        │
│ Logout                       │
└──────────────────────────────┘
```

Administrative options such as **Manage Users** and **Settings** remain unavailable to Editors.

---

# 🌗 Theme Support

The dashboard supports:

* Light mode
* Dark mode
* System preference detection
* Persistent theme selection

Theme preference is stored in:

```text
localStorage
```

under:

```text
admin-theme
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend:

```env
PORT=5001

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLIENT_URL=http://localhost:5173
```

Never commit your `.env` file to GitHub.

Add:

```text
.env
```

to `.gitignore`.

---

# 📦 Installation

## 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/myblog.git
```

```bash
cd myblog
```

---

# 🔧 Backend Setup

Go into the server directory:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The backend should run on:

```text
http://localhost:5001
```

---

# 💻 Frontend Setup

Open another terminal:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start Vite:

```bash
npm run dev
```

The frontend should run on:

```text
http://localhost:5173
```

---

# 🗄️ MongoDB

This project uses MongoDB for storing:

* Users
* Blogs
* Comments

Example user document:

```json
{
  "username": "bilal",
  "email": "bilal@example.com",
  "role": "editor"
}
```

Available roles:

```text
user
editor
admin
```

---

# 🔒 Security

Security features implemented in the project include:

* JWT authentication
* Password hashing
* Protected API routes
* Role-based authorization
* Authorization headers
* Backend permission checks
* CORS configuration
* Protected frontend routes
* Unauthorized route handling

---

# 🧪 Testing Roles

For development, create test accounts for each role.

### User

```text
Role: user
```

Expected access:

```text
Public website
Blog
Comments
Likes
```

### Editor

```text
Role: editor
```

Expected access:

```text
/admin/overview
/admin/posts
/admin/comments
```

Should NOT have access to:

```text
/admin/users
/admin/settings
```

### Admin

```text
Role: admin
```

Expected access:

```text
/admin/overview
/admin/posts
/admin/users
/admin/comments
/admin/settings
```

---

# 🧩 Example Permission Matrix

| Feature          | User | Editor | Admin |
| ---------------- | :--: | :----: | :---: |
| View blogs       |   ✅  |    ✅   |   ✅   |
| Like posts       |   ✅  |    ✅   |   ✅   |
| Create comments  |   ✅  |    ✅   |   ✅   |
| Create posts     |   ❌  |    ✅   |   ✅   |
| Edit posts       |   ❌  |    ✅   |   ✅   |
| Delete posts     |   ❌  |    ❌   |   ✅   |
| View comments    |   ❌  |    ✅   |   ✅   |
| Approve comments |   ❌  |    ✅   |   ✅   |
| Reject comments  |   ❌  |    ✅   |   ✅   |
| Delete comments  |   ❌  |    ❌   |   ✅   |
| Manage users     |   ❌  |    ❌   |   ✅   |
| Settings         |   ❌  |    ❌   |   ✅   |
| Dashboard        |   ❌  |    ✅   |   ✅   |

---

# 🎯 Future Improvements

Possible future features include:

* Rich text editor
* Image upload with Cloudinary
* Post scheduling
* Draft autosave
* Post version history
* Analytics dashboard
* Search and filtering
* Pagination
* Email notifications
* Comment notifications
* User profile management
* Password reset
* Email verification
* Two-factor authentication
* Activity/audit logs
* Post categories and tags
* SEO metadata
* Social sharing
* Reading-time calculation
* Admin notifications
* Deployment with Docker
* CI/CD pipeline

---

# 📈 What This Project Demonstrates

This project demonstrates practical experience with:

```text
React
│
├── Component Architecture
├── React Router
├── Context API
├── Protected Routes
├── State Management
└── Responsive UI

Node.js + Express
│
├── REST APIs
├── Middleware
├── Authentication
├── Authorization
├── Controllers
└── Route Architecture

MongoDB
│
├── Schema Design
├── Mongoose
├── Relationships
└── Data Persistence

Security
│
├── JWT
├── Password Hashing
├── RBAC
├── Protected APIs
└── CORS
```

---

# 👨‍💻 Author

**Muhammad Bilal**

Software Engineering Graduate
Full-Stack Developer

### Technologies

```text
React
Node.js
Express
MongoDB
JavaScript
Tailwind CSS
JWT
REST API
Git
GitHub
```

---

# ⭐ Project Goal

The goal of MyBlog is to provide a production-style blogging platform while demonstrating modern full-stack development concepts.

The project goes beyond basic CRUD by implementing:

> **Authentication + Authorization + RBAC + Content Management + Comment Moderation + Protected APIs**

This makes the project suitable as a **full-stack portfolio project** and demonstrates the type of architecture commonly used in real-world web applications.

---

# 📄 License

This project is intended for educational and portfolio purposes.

