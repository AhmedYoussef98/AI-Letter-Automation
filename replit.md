# AI Letter Generator - NetZero

## Project Overview
AI Letter Generator is a web application that helps users create professional letters using AI. The application supports Arabic language and includes features for letter generation, validation, chat-based editing, and archival.

## Recent Changes (October 20, 2025)
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

## Development Notes
- Server automatically restarts when files change (managed by Replit)
- Port 5000 is required for Replit's webview functionality
- Self-signed certificate handling enabled for external AI API
- Arabic RTL layout throughout the application

## Security Features
- Domain-based email filtering for Google Sign-In
- Password hashing using SHA-256
- CORS configured for API access
- Admin role separation with whitelist management
