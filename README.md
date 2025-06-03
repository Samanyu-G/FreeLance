# Fiverr Clone

freelance-hub/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── server.js
│   ├── models/
│   │   ├── User.js
│   │   └── Gig.js
│   └── uploads/
└── README.md

🚀 Setup Instructions
Prerequisites
Node.js (v14 or higher)
MongoDB (v4.4 or higher)
Git

Installation Steps
Clone the repository:

bash
git clone <repository-url>
cd freelance-hub
Install backend dependencies:

bash
cd backend
npm install
Set up MongoDB:

bash
# Start MongoDB service
mongod
Start the server:

bash
node server.js
Open frontend/index.html in a browser

✨ Features
Authentication
User registration (Client/Freelancer)
Secure login with JWT
Role-based access control
Freelancer Features
Create and manage gigs
Upload portfolio images
Set hourly rates
Add skills and descriptions
Client Features
Browse available gigs
Search functionality
View freelancer profiles
Filter by skills
Common Features
Responsive dashboard
Real-time stats
User settings
Message center (coming soon)
🔌 API Documentation
Authentication Endpoints
Code
POST /register
POST /login
GET /verify
Gig Endpoints
Code
POST /gigs - Create new gig
GET /gigs - Get all gigs
GET /gigs/my-gigs - Get user's gigs
DELETE /gigs/:id - Delete gig
User Endpoints
Code
GET /stats - Get dashboard stats
PUT /user/settings - Update user settings
📊 Database Schema
User Schema
JavaScript
{
    name: String,
    email: { type: String, unique: true },
    password: String,
    userType: String,
    date: Date
}
Gig Schema
JavaScript
{
    title: String,
    description: String,
    price: Number,
    skills: String,
    image: String,
    freelancerId: ObjectId,
    freelancerName: String,
    date: Date
}
🤝 Contributing Guidelines
Branch Naming Convention

feature/feature-name
bugfix/bug-name
hotfix/issue-name
Commit Messages

feat: Add new feature
fix: Bug fix
docs: Documentation updates
style: Code style changes
refactor: Code refactoring
Pull Request Process

Create feature branch
Make changes
Test thoroughly
Submit PR with description
Wait for review
🐛 Known Issues
Gig Creation Issues
Image upload occasionally fails
Form validation needs improvement
UI/UX Issues
Mobile responsiveness needs enhancement
Line clamp compatibility in some browsers
Upcoming Features
Real-time messaging
Payment integration
Rating system
Advanced search filters
🔒 Security Notes
JWT used for authentication
Password hashing with bcrypt
File upload validation
CORS enabled
Input sanitization
📈 Performance Optimization
Image compression
Lazy loading
Pagination (coming soon)
Cache implementation (planned)
For any questions or support, contact the team lead:

GitHub: @Samanyu-G
Last Updated: 2025-06-03 04:17:19 UTC
