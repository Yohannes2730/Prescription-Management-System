
## 1. Project Overview

**Project Name:** AthaNex

**Name Meaning:** Inspired by Elvish *Athae*, meaning healing herb, and Latin *Nexus*, meaning connection.

**Vision:** AthaNex is a digital healthcare platform that connects patients, doctors, hospitals, and pharmacies to simplify electronic prescriptions, medicine availability searches, pharmacy inventory management, online medicine ordering, and medication tracking.

**Authors:**
- Azariyas Mekonen
- Koket Alemayehu
- Egata Kebede
- Yohannes Girma

**Document Version:** 1.0  
**Last Updated:** August 6, 2025


## 2. Core Features to Document

Organize the platform features into understandable groups:

### Authentication and Authorization
- User registration and login
- Role-based access control
- Doctor, hospital, and pharmacy verification
- JWT authentication and OAuth 2.0 support
- Secure password hashing

### Electronic Prescription Management
- Prescription creation, editing, and viewing
- Secure prescription sharing and verification
- Prescription access restricted to authorized users
- QR codes or one-time tokens for prescription verification and sharing

### Pharmacy Inventory Management
- Medicine registration and inventory updates
- Stock availability tracking
- Medicine price, batch, and expiry-date management
- Real-time inventory synchronization as a planned capability unless implemented

### Medicine Search
- Search by medicine name and category
- Find pharmacies that have requested medicines available
- Location-based pharmacy discovery as a planned capability unless implemented

### Order Management
- Prescription-based medicine ordering
- Pharmacy order review and fulfillment
- Order statuses: placed, approved, delivered, and cancelled

### Notifications
- Email and SMS notifications
- Prescription alerts
- Order status updates
- Medication refill reminders

Clearly distinguish planned capabilities from implemented features.

## 3. User Roles

Document these four primary stakeholder categories:

- **Patient/User:** View prescriptions, search for medicines, place orders, and track order status.
- **Doctor:** Issue authorized electronic prescriptions.
- **Pharmacy:** Manage medicine inventory, review prescriptions, and fulfill orders.
- **Administrator:** Manage onboarding, verification, platform operations, and analytics.


## 4. Architecture and Technology Stack

The initial architecture described in the source document is a monolithic MVP.

Document the proposed stack accurately:

| Layer | Technology |
|---|---|
| Frontend | React / React Native |
| Backend | Node.js / Express.js |
| Database | MongoDB |
| Authentication | JWT / OAuth 2.0 |
| Password Security | bcrypt |
| Input Validation | Joi / express-validator |
| API Gateway / Reverse Proxy | NGINX or an appropriate gateway |
| Containerization | Docker |
| CI/CD | GitHub Actions |
| Version Control | Git / GitHub |
| Deployment | VPS or cloud platform such as AWS, DigitalOcean, or Render |

Treat these as the proposed architecture, not proof that all technologies are currently implemented.

Include a simple Mermaid architecture diagram showing:

Patient / Doctor / Pharmacy / Administrator → Frontend → Backend API → MongoDB

Show authentication, prescription management, inventory, ordering, and notifications as backend modules. Mark external services and optional infrastructure as proposed components.

Also document the planned Phase 2 evolution toward microservices:
- Authentication Service
- Prescription Service
- Pharmacy and Inventory Service
- Order Service
- Notification Service
- Medicine Search Service
- Message broker such as RabbitMQ or Kafka
- NGINX or another suitable API gateway


## 5. Project Structure

Use the following structure as the proposed initial backend layout:

athanex-server/
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
├── config/
├── index.js
├── .env.example
├── package.json
└── README.md


## 6. API Documentation

Create a clean API table using the endpoints from the source document:

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/user/register` | Public | Register a user |
| POST | `/auth/user/login` | Public | Authenticate a user |
| POST | `/auth/pharmacy/register` | Public | Register a pharmacy |
| POST | `/auth/pharmacy/login` | Public | Authenticate a pharmacy |
| POST | `/auth/hospital/register` | Public | Register a hospital |
| POST | `/auth/hospital/login` | Public | Authenticate a hospital |
| POST | `/prescriptions/` | Doctor | Issue a prescription |
| GET | `/prescriptions/user` | Authenticated user | Retrieve user prescriptions |
| POST | `/pharmacy/inventory` | Pharmacy | Add or update medicine inventory |
| GET | `/search` | User | Search medicine availability |
| POST | `/orders` | User | Place a medicine order |
| GET | `/orders/pharmacy` | Pharmacy | Retrieve pharmacy orders |


## 7. Setup and Configuration

Provide a practical setup section for a Node.js/Express/MongoDB application, but only use commands that are valid for the actual repository.


Include a `.env.example` template with placeholder variables such as:

- `PORT`
- `MONGODB_URI`
- `JWT_SECRET`
- `NODE_ENV`

