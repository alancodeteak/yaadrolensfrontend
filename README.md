# Yaadrolens Frontend - Admin Management System

A modern React web application built with Vite for comprehensive admin management including user management, payroll, attendance monitoring, and reporting.

## Features..

- **User Management**: Complete CRUD operations for user accounts
- **User Registration**: Self-service registration with admin approval workflow
- **User Details**: Detailed user profiles and information management
- **Pending Approvals**: Admin interface for approving/rejecting user registrations
- **Admin Login**: Secure authentication system
- **Payroll Management**: Comprehensive payroll processing and management
- **Reports**: Generate and export various business reports
- **Settings**: Configurable system settings and preferences
- **Live Attendance Monitoring**: Real-time attendance tracking and monitoring

## Tech Stack

- **Frontend Framework**: React 19.1.1
- **Build Tool**: Vite 7.1.2
- **State Management**: Redux Toolkit + React-Redux
- **API Layer**: RTK Query
- **Routing**: React Router DOM 7.9.1
- **Styling**: Tailwind CSS 4.1.13
- **Icons**: Heroicons React 2.2.0
- **Utilities**: clsx for conditional classes

## Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Page components
│   ├── AdminLogin/     # Admin authentication
│   ├── UserManagement/ # User CRUD operations
│   ├── UserRegistration/ # User registration form
│   ├── UserDetails/    # Individual user details
│   ├── UserPendingApproval/ # Approval workflow
│   ├── PayrollManagement/ # Payroll processing
│   ├── Reports/        # Report generation
│   ├── Settings/       # System configuration
│   └── LiveAttendance/ # Real-time attendance
├── layouts/            # Layout components
├── hooks/              # Custom React hooks
├── services/           # API services
├── store/              # Redux store configuration
│   ├── slices/         # Redux slices
│   └── api/            # RTK Query API definitions
├── utils/              # Utility functions and constants
├── context/            # React context providers
├── assets/             # Static assets
└── styles/             # Global styles and CSS
```

## Redux Store Structure

The application uses Redux Toolkit with the following slices:

- **authSlice**: Authentication state and user session management
- **userSlice**: User management, filtering, and pagination
- **payrollSlice**: Payroll data and processing state
- **attendanceSlice**: Live attendance monitoring and history
- **reportSlice**: Report generation and management
- **settingsSlice**: Application configuration and preferences
- **apiSlice**: RTK Query API endpoints for all backend communication

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd YaadrolensFrontEnd
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=http://localhost:3001/api
   REACT_APP_ENV=development
   ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## API Integration

The application is configured to work with a backend API. Update the `REACT_APP_API_URL` environment variable to point to your backend server.

### API Endpoints Expected:

- `POST /auth/login` - Admin authentication
- `GET /users` - Fetch users with pagination and filtering
- `POST /users` - Create new user
- `GET /users/pending` - Fetch pending user approvals
- `POST /users/:id/approve` - Approve user registration
- `GET /payroll` - Fetch payroll data
- `GET /attendance/live` - Get live attendance data
- `GET /reports` - Fetch reports
- `GET /settings` - Get system settings

## State Management

The application uses Redux Toolkit for state management with the following features:

- **Centralized State**: All application state managed through Redux store
- **RTK Query**: Efficient data fetching and caching
- **Optimistic Updates**: Immediate UI updates with automatic rollback on errors
- **Persistent Authentication**: Token-based authentication with localStorage persistence

## Styling

The application uses Tailwind CSS for styling with:

- **Responsive Design**: Mobile-first approach
- **Custom Utility Classes**: Extended utility classes in globals.css
- **Component Variants**: Consistent button, form, and card styles
- **Dark Mode Support**: Basic dark mode configuration

## Development Guidelines

### Adding New Pages

1. Create a new directory in `src/pages/`
2. Create the main component file
3. Add routing in `src/main.jsx`
4. Add any necessary Redux slice updates

### Adding New API Endpoints

1. Add endpoint to `src/store/api/apiSlice.js`
2. Export the generated hook
3. Use the hook in your components

### State Management Best Practices

- Use RTK Query for server state
- Use Redux slices for client-side state
- Keep components focused and use custom hooks
- Use selectors for derived state

## Deployment

### Production Build

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Environment Configuration

For production deployment, ensure you have:

- Correct API URL in environment variables
- Proper CORS configuration on your backend
- HTTPS enabled for production

## Contributing

1. Create a feature branch from `main`
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is private and confidential.

## Support

For support and questions, please contact the development team.
