# AI Letter Generator - NetZero

## Project Overview
AI Letter Generator is a web application that helps users create professional letters using AI. The application supports Arabic language and includes features for letter generation, validation, chat-based editing, and archival.

## Recent Changes (October 20, 2025)

### Maktoub Branding Implementation - Dark Mode
**NEW - Maktoub Dark Mode Theme Applied**
- Implemented complete dark mode branding based on Figma design specifications
- Created modular CSS system in `/css/` folder:
  - `maktoub-theme.css`: Core design system with variables
  - `maktoub-auth.css`: Authentication pages styling
  - `maktoub-override.css`: Theme integration layer

**Design Specifications from Figma:**
- **Colors**:
  - Primary Dark: #102320
  - Primary Teal: #1EA896
  - Light Accent: #A0ECDC
  - Teal variations: #F1FCFA, #67E1CB
  - Border: rgba(6, 100, 88, 0.5)

- **Typography**: 
  - Font family: Cairo, Tajawal (Arabic optimized)
  - Sizes: 16px base, 28px headings
  - Weights: 400 (regular), 700 (bold)

- **Components**:
  - Border radius: 6px
  - Shadows: Subtle (0px 1px 2px rgba(0, 0, 0, 0.05))
  - Navbar height: 78px
  - Button padding: 9px 17px

**Theme Toggle Status:**
- Theme toggle remains functional
- Users can switch between dark and light modes
- Light mode design pending (to be implemented when user provides specs)
- To set dark mode as default, update `main.js` localStorage initialization

**Files Modified:**
- All HTML files updated to include new CSS
- Created `/css/` folder for organized stylesheet management
- Maintained backward compatibility with existing functionality

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
  - `index.html`: Home page with feature cards
  - `login.html`: Authentication page with Google Sign-In and email/password
  - `signup.html`: New user registration
  - `create-letter.html`: Letter generation interface
  - `review-letter.html`: Letter review and editing
  - `letter-history.html`: Archive of generated letters
  - `admin-panel.html`: User management (admin only)

### Styling System
- **Maktoub Theme CSS** (`/css/` folder):
  - Modular design system with CSS variables
  - Dark mode optimized with light mode ready
  - Component-based styling
  - Responsive design built-in

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
7. **Theme Toggle**: Dark/Light mode switching

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
- Dark mode is the primary theme based on Maktoub branding

## Security Features
- Domain-based email filtering for Google Sign-In
- Password hashing using SHA-256
- CORS configured for API access
- Admin role separation with whitelist management
- Client-server separation maintained

## Next Steps (Pending)
1. Light mode design implementation (awaiting Figma specs from user)
2. Set dark mode as default in theme initialization
3. Fine-tune any component-specific styling based on user feedback
