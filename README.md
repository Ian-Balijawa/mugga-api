# tours-travel CMS

A comprehensive Content Management System for tours-travel built with TypeScript, Express, and TypeORM. This system manages programs, coaches, facilities, registrations, and content.

## Features

- **Program Management**
  - Multiple program categories (training, camps, clinics)
  - Program scheduling and capacity control
  - Registration tracking
  - Pricing management

- **Coach Management**
  - Coach profiles and specialties
  - Image management
  - Expertise categorization
  - Schedule management

- **Facility Management**
  - Facility details and features
  - Equipment inventory
  - Image gallery
  - Availability tracking

- **Registration System**
  - Online program registration
  - Emergency contact information
  - Medical information handling
  - Registration confirmation emails
  - Capacity management

- **Content Management**
  - News and announcements
  - Image gallery management
  - Program updates
  - Facility information

- **Security & Administration**
  - Role-based access control (Admin)
  - Activity logging
  - File upload management
  - Secure authentication with JWT

## Tech Stack

- Node.js & TypeScript
- Express.js
- TypeORM with MySQL
- Nodemailer for email communications
- Zod for validation
- Swagger for API documentation
- Jest for testing

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone [repository-url]
cd tours-travel
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Edit the .env file with your configuration:

```env
PORT=5000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_user
DB_PASS=your_password
DB_NAME=tours-travel

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Email
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_password
MAIL_FROM=noreply@tours-travel.com
```

4. Start the server:

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

5. Access the API documentation:

```
http://localhost:5000/api-docs
```

## API Documentation

The API is documented using Swagger. Major endpoints include:

- `/api/programs` - Program management
- `/api/coaches` - Coach profiles
- `/api/facilities` - Facility management
- `/api/gallery` - Image gallery
- `/api/registrations` - Registration handling
- `/api/admin` - Administrative functions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details
