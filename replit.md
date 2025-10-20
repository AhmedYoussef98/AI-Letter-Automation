# Maktoub - منشئ الخطابات الذكي

## Project Overview
Maktoub (مكتوب) is an AI-powered letter generation web application that helps users create professional letters using artificial intelligence. The application supports Arabic language and includes features for letter generation, validation, chat-based editing, and archival.

## Recent Changes (October 20, 2025)

### Complete Rebranding to Maktoub
**COMPLETED - Full Application Rebranding**
- Changed all branding from "AI Letter Generator" to "Maktoub" (مكتوب)
- Updated all page titles, logos, and navigation elements
- Maintained all existing functionality during rebranding

### Maktoub Design System - Dark & Light Mode
**COMPLETED - Dual Theme Implementation**
- Implemented complete design system based on Figma specifications
- Created modular CSS system in `/css/` folder:
  - `maktoub-theme.css`: Core design system with variables
  - `maktoub-auth.css`: Authentication pages styling
  - `maktoub-override.css`: Dual theme system (dark & light modes)

**Design Specifications from Figma:**

**Dark Mode (Default):**
- Background: #102320 (dark teal/forest green)
- Cards: Dark teal with subtle borders
- Text: White/light teal
- Primary Button: #1EA896 (teal)
- Borders: Teal borders with opacity

**Light Mode:**
- Background: #F1FCFA (very light teal/mint)
- Cards: White with subtle teal borders
- Text: Dark (#102320)
- Primary Button: #1EA896 (teal)
- Navbar: White with subtle shadow

**Typography**: 
- Font family: Cairo, Tajawal (Arabic optimized)
- Sizes: 16px base, 28px headings
- Weights: 400 (regular), 700 (bold)

**Components**:
- Border radius: 6px
- Shadows: Subtle (0px 1px 2px rgba(0, 0, 0, 0.05))
- Navbar height: 78px
- Button padding: 9px 17px

**Theme Toggle:**
- Fully functional theme toggle button in navbar
- Users can switch between dark and light modes seamlessly
- Theme preference saved in localStorage
- Consistent branding across both themes

**Files Updated:**
- All HTML files (login, signup, index, create-letter, review-letter, letter-history, admin-panel)
- Created comprehensive CSS theme system
- All branding references updated to Maktoub

### Vercel to Replit Migration
- **Migrated from Vercel serverless functions to Express.js server**
  - Created `server.js` as the main Express application
  - Converted `/api/proxy.js` and `/api/apps-script-proxy.js` from Vercel serverless format to Express routes
  - All API endpoints remain at `/api/proxy` and `/api/apps-script-proxy` (no client-side changes required)
  
- **Server Configuration**
  - Server runs on port 5000 with host 0.0.0.0 for Replit compatibility
  - Static file serving configured for HTML/CSS/JS files
  - CORS enabled for all origins

- **Updated package.json scripts**
  - `npm start`: Runs the Express server
  - `npm dev`: Same as start (for development)

## Project Architecture

### Frontend
- **Static HTML pages** (Arabic RTL layout):
  - `index.html`: Home page - منشئ الخطابات الذكي
  - `login.html`: Authentication page - تسجيل الدخول
  - `signup.html`: New user registration - إنشاء حساب جديد
  - `create-letter.html`: Letter generation interface - إنشاء خطاب جديد
  - `review-letter.html`: Letter review and editing - مراجعة خطاب
  - `letter-history.html`: Archive of generated letters - سجل الخطابات
  - `admin-panel.html`: User management (admin only) - لوحة الإدارة

### Styling System
- **Maktoub Theme CSS** (`/css/` folder):
  - Modular design system with CSS variables
  - Dual theme support (dark & light modes)
  - Component-based styling
  - Responsive design built-in
  - Arabic RTL optimized

### Backend
- **Express.js Server** (`server.js`):
  - Serves static files from root directory
  - Two main API proxy endpoints:
    1. `/api/proxy`: Proxies requests to external AI API (https://128.140.37.194:5000)
    2. `/api/apps-script-proxy`: Proxies requests to Google Apps Script

### Key Features
1. **Letter Generation**: AI-powered letter creation with templates
2. **Chat-based Editing**: Interactive editing using chat sessions
3. **Letter Validation**: Automated validation of generated content
4. **Archive System**: Store and manage generated letters
5. **Authentication**: Google Sign-In + email/password with domain filtering
6. **Admin Panel**: User management with whitelist control
7. **Dual Theme Toggle**: Dark/Light mode switching with localStorage persistence

### External Dependencies
- **External AI API**: https://128.140.37.194:5000 (requires HTTPS with self-signed cert)
- **Google Apps Script**: User data and whitelist management
- **Google Sheets API**: Data storage backend

### Environment Variables
The application uses the following configured values:
- `SPREADSHEET_ID`: Google Sheets ID for data storage
- `API_KEY`: Google Sheets API key
- `APPS_SCRIPT_WEB_APP_URL`: Google Apps Script deployment URL
- `ALLOWED_GOOGLE_DOMAINS`: Domain whitelist for Google Sign-In

### Technology Stack
- **Frontend**: Vanilla JavaScript, HTML, CSS
- **Backend**: Node.js, Express.js
- **APIs**: Axios for HTTP requests
- **File Handling**: Formidable for multipart/form-data
- **Authentication**: Google OAuth + custom email/password
- **Styling**: Maktoub custom CSS design system

## Development Notes
- Server automatically restarts when files change (managed by Replit)
- Port 5000 is required for Replit's webview functionality
- Self-signed certificate handling enabled for external AI API
- Arabic RTL layout throughout the application
- Dark mode is the default theme, light mode available via toggle

## Security Features
- Domain-based email filtering for Google Sign-In
- Password hashing using SHA-256
- CORS configured for API access
- Admin role separation with whitelist management
- Client-server separation maintained

## Brand Identity
- **Name**: Maktoub (مكتوب) - means "written" in Arabic
- **Logo**: Teal icon with Maktoub branding
- **Primary Color**: #1EA896 (Teal)
- **Design Philosophy**: Clean, professional, Arabic-first interface
- **Typography**: Cairo font family for optimal Arabic rendering
