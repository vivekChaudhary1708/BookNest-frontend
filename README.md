# BookNest-Frontend

Welcome to the BookNest Frontend repository! This project forms the modern, responsive user interface for the BookNest e-commerce platform.

## 🚀 Tech Stack

- **Core Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/) for blazing fast development and builds
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Routing**: [React Router v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) for utility-first responsive design
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Visualization**: [Recharts](https://recharts.org/) (Admin Analytics)
- **UI Feedback**: [React Hot Toast](https://react-hot-toast.com/) for toast notifications
- **Quality Assurance**: SonarQube integration via `sonar-scanner`

## 🏗️ Project Structure

The frontend application follows a clean, feature-driven architecture:

```text
src/
├── assets/         # Static images, icons (e.g., hero.png, vite.svg)
├── components/     # Reusable UI components (Navbar, Footer, BookCard, etc.)
├── layouts/        # Page layouts based on roles (Public, Customer, Admin)
├── pages/          # Individual route pages
│   ├── admin/      # Admin dashboard, Manage Books, Manage Orders, etc.
│   ├── customer/   # Profile, Cart, Orders, Checkout, Wishlist
│   └── public/     # Landing page, Login, Register, Forgot Password
├── redux/          # Redux store and slices (auth, book, cart, order, wishlist)
├── routes/         # Routing logic (ProtectedRoute, RoleRoute)
├── services/       # API interaction services (authService, productService, etc.)
├── utils/          # Helper functions, constants, validators, and mock data
├── App.jsx         # Root React component
├── main.jsx        # Entry point
└── index.css       # Global styles and Tailwind directives
```

## 🌐 Branching Strategy

- **`main`**: The production-ready code.
- **`dev`**: The active development branch.
- **`React-practice`**: A dedicated branch for feature development, experiments, and practices before merging to `dev` or `main`.

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn

### Installation
1. Clone the repository and switch to your desired branch (`dev` or `React-practice`):
   ```bash
   git checkout dev
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```
