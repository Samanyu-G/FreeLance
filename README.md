# FreelanceHub - Full Stack Web Application

![FreelanceHub Logo](https://example.com/logo.png) <!-- Add your logo URL -->

**Current Version:** 1.0.0  
**Last Updated:** 2025-06-03 04:32:13 UTC  
**Project Lead:** [@Samanyu-G](https://github.com/Samanyu-G)  
**Team Size:** 4 members

## 📑 Table of Contents
- [Overview](#overview)
- [Team Roles](#team-roles)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Features](#features)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Contributing Guidelines](#contributing-guidelines)
- [Known Issues](#known-issues)

## 🎯 Overview

FreelanceHub is a full-stack web application that connects freelancers with clients. It provides a platform for freelancers to showcase their services through gigs and for clients to browse and engage with these services.

<details>
<summary><strong>Screenshots</strong></summary>

![Dashboard](https://example.com/dashboard.png)
![Gigs Page](https://example.com/gigs.png)
<!-- Add your actual screenshot URLs -->

</details>

## 👥 Team Roles

| Role | Responsibilities | Technologies |
|------|-----------------|--------------|
| Frontend Developer | UI/UX, Client-side JS, Responsive Design | HTML, CSS, JavaScript |
| Backend Developer | Server Logic, API, Database | Node.js, Express, MongoDB |
| Full Stack Developer | Integration, Auth, File Uploads | Full Stack + Integration |
| QA & Documentation | Testing, Docs, Version Control | Testing Tools, Git |

## 💻 Tech Stack

### Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Font Awesome Icons

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication

### Dependencies
```json
{
  "dependencies": {
    "express": "^4.17.1",
    "mongoose": "^6.0.0",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^8.5.1",
    "multer": "^1.4.3"
  }
}
```

### 🚀 Setup Instructions
-- Prerequisites: 
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- Git

### Installation Steps

- Clone the repository:
- ![image](https://github.com/user-attachments/assets/5d7d26c0-49a6-4a5d-8659-62495636d258)

- Install backend dependencies:
- ![image](https://github.com/user-attachments/assets/b8010838-e762-44c0-b907-64b3167e6fa6)

- Set up MongoDB:
- ![image](https://github.com/user-attachments/assets/8246eb96-dee8-400f-aff8-160b115b36d5)

- Start the server:
- ![image](https://github.com/user-attachments/assets/eddd4f41-ec71-4ad9-a3ad-aeb89c987757)

- Open ```frontend/index.html``` in a browser
  
### ✨ Features


### Authentication
User registration (Client/Freelancer)
Secure login with JWT
Role-based access control

### Freelancer Features
Create and manage gigs
Upload portfolio images
Set hourly rates
Add skills and descriptions

### Client Features
Browse available gigs
Search functionality
View freelancer profiles
Filter by skills

### Common Features
Responsive dashboard
Real-time stats
User settings
Message center (coming soon)


### 🔌 API Documentation

### Authentication Endpoints

### Gig Endpoints

### User Endpoints

### 📊 Database Schema

### User Schema

### Gig Schema

### 🤝 Contributing Guidelines

### Branch Naming Convention
- feature/feature-name
- bugfix/bug-name
- hotfix/issue-name

### Commit Messages
- feat: Add new feature
- fix: Bug fix
- docs: Documentation updates
- style: Code style changes
- refactor: Code refactoring

### Pull Request Process
- Create feature branch
- Make changes
- Test thoroughly
- Submit PR with description
- Wait for review

### 🐛 Known Issues
### Current Issues
- ## Gig Creation
- Image upload occasionally fails
- Form validation needs improvement

- ## UI/UX
- Mobile responsiveness needs enhancement
- Line clamp compatibility in some browsers

- ## Upcoming Features
- Real-time messaging
- Payment integration
- Rating system
- Advanced search filters
  
### 🔒 Security Implementation
- JWT Authentication
- Password hashing (bcrypt)
- File upload validation
- CORS enabled
- Input sanitization

### 📈 Performance Optimization
- Image compression
- Lazy loading
- Pagination (coming soon)
-  Cache implementation (planned)
