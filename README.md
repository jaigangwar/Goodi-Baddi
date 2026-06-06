# Goodi Baddi - HR Hiring Ecosystem

A Progressive Web App (PWA) designed exclusively for companies and HR teams to create a trusted hiring ecosystem through verified employee feedback.

## 🚀 Features

- **Company-Only Access**: Secure platform for verified companies and HR teams
- **Employee Search**: Multi-parameter search (name, email, mobile, LinkedIn)
- **Verified Feedback**: Structured feedback system with admin verification
- **Employee Profiles**: Comprehensive work history and ratings
- **PWA Support**: Works offline with service worker caching
- **Mobile-First**: Responsive design optimized for all devices
- **Secure Authentication**: JWT-based auth with role-based access control

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend API server (see backend setup)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd goodi-baddi-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## 🧪 Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
goodi-baddi-app/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable components
│   │   └── Layout/       # Header, Footer
│   ├── config/           # Configuration files
│   │   └── constants.js  # App constants
│   ├── context/          # React Context
│   │   └── AuthContext.jsx
│   ├── pages/            # Page components
│   │   ├── Auth/        # Login, Signup
│   │   ├── Landing/     # Landing page
│   │   ├── Dashboard/   # Dashboard (to be implemented)
│   │   ├── Search/      # Employee search (to be implemented)
│   │   └── Admin/       # Admin panel (to be implemented)
│   ├── services/         # API services
│   │   ├── authService.js
│   │   ├── employeeService.js
│   │   ├── feedbackService.js
│   │   ├── companyService.js
│   │   ├── reportService.js
│   │   └── adminService.js
│   ├── utils/            # Utility functions
│   │   ├── api.js       # Axios instance
│   │   ├── auth.js      # Auth utilities
│   │   └── validation.js # Form validation
│   ├── App.jsx           # Main app component
│   ├── App.css           # Global styles
│   ├── main.jsx          # Entry point
│   └── index.css         # Base styles
├── .env                   # Environment variables
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies
```

## 🔑 Key Technologies

- **React 19** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Vite** - Build tool
- **PWA** - Progressive Web App support
- **JWT** - Authentication

## 🎨 Features Implemented

### ✅ Completed
- Landing page with hero section
- Company registration (signup)
- Company login
- Authentication context
- Protected routes setup
- Header and footer components
- API service layer
- Form validation utilities
- PWA configuration
- Responsive design

### 🚧 To Be Implemented
- Dashboard page
- Employee search page
- Employee profile page
- Add employee form
- Add feedback form
- Reports page
- Admin panel
- Forgot password flow
- Email verification
- Profile management

## 🔐 Authentication Flow

1. Company registers with official email
2. Email verification link sent
3. Admin approves company
4. Company can login and access platform
5. JWT token stored in localStorage
6. Token included in all API requests

## 🌐 API Integration

The app expects a backend API with the following endpoints:

### Auth Endpoints
- `POST /api/auth/signup` - Register company
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `POST /api/auth/verify-email` - Verify email

### Employee Endpoints
- `GET /api/employees/search` - Search employees
- `GET /api/employees/:id` - Get employee profile
- `POST /api/employees` - Add employee record
- `PUT /api/employees/:id` - Update employee record
- `DELETE /api/employees/:id` - Delete employee record

### Feedback Endpoints
- `POST /api/feedbacks` - Add feedback
- `PUT /api/feedbacks/:id` - Update feedback
- `DELETE /api/feedbacks/:id` - Delete feedback

### Company Endpoints
- `GET /api/companies/profile` - Get company profile
- `PUT /api/companies/profile` - Update profile
- `GET /api/companies/dashboard` - Get dashboard stats

### Report Endpoints
- `POST /api/reports` - Submit report
- `GET /api/reports/my-reports` - Get my reports

### Admin Endpoints
- `GET /api/admin/companies` - List companies
- `PUT /api/admin/companies/:id/verify` - Verify company
- `DELETE /api/admin/companies/:id` - Delete company
- `GET /api/admin/reports` - List reports
- `PUT /api/admin/reports/:id/resolve` - Resolve report
- `GET /api/admin/logs` - Get moderation logs

## 🎯 User Roles

1. **Super Admin**
   - Manage companies
   - Verify/reject registrations
   - Moderate content
   - View audit logs

2. **Company Admin / HR**
   - Add employee records
   - Submit feedback
   - Search employees
   - View profiles

## 📱 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Cached pages work without internet
- **Service Worker**: Background sync and caching
- **Responsive**: Mobile-first design
- **Fast**: Optimized performance

## 🔒 Security Features

- JWT authentication
- Password hashing (bcrypt)
- Input sanitization
- HTTPS enforcement
- Role-based access control
- CORS protection
- XSS prevention

## 🎨 Design System

### Colors
- Primary: `#2563eb` (Blue)
- Secondary: `#6b7280` (Gray)
- Success: `#10b981` (Green)
- Error: `#ef4444` (Red)
- Warning: `#f59e0b` (Orange)

### Typography
- Font Family: System fonts
- Headings: 600 weight
- Body: 400 weight

## 📄 License

Proprietary - All rights reserved

## 👥 Support

For support, email support@goodibaddi.com

## 🚀 Deployment

### Vercel
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

### Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000/api` |

## 🐛 Known Issues

- Backend API needs to be implemented
- Icon files need to be created (icon-192.png, icon-512.png)
- Additional pages need implementation

## 🔄 Next Steps

1. Implement remaining pages (Dashboard, Search, Profile, etc.)
2. Create backend API server
3. Add comprehensive testing
4. Implement real-time notifications
5. Add analytics tracking
6. Optimize performance
7. Add accessibility features
8. Implement i18n for multiple languages

## 📞 Contact

- Website: https://goodibaddi.com
- Email: info@goodibaddi.com
- Support: support@goodibaddi.com
