# Loan Management System

A robust and scalable loan management system built with TypeScript, Express, and TypeORM. This system provides comprehensive features for managing loans, borrowers, loan officers, and branch operations.

## Features

- **User Management**
  - Role-based access control (Admin, Loan Officer, User)
  - Email and phone verification
  - Secure authentication with JWT

- **Loan Management**
  - Multiple loan types support
  - Flexible interest calculation methods
  - Collateral management
  - Payment tracking
  - Fee management
  - Document management

- **Branch Operations**
  - Multi-branch support
  - Branch-specific loan configurations
  - Loan officer assignment
  - Branch-wise reporting

- **Group Lending**
  - Borrower group management
  - Group loan tracking
  - Meeting schedule management

- **Security & Monitoring**
  - Rate limiting
  - Activity logging
  - Error tracking
  - Request validation
  - API documentation with Swagger

## Tech Stack

- Node.js & TypeScript
- Express.js
- TypeORM with MySQL
- Redis for caching and rate limiting
- Winston for logging
- Twilio for SMS notifications
- Nodemailer for email communications
- Swagger for API documentation
- Jest for testing

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Redis
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone git@github.com:Ian-Balijawa/loan-management.git
cd loan-management
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

4. Start the server:

```bash
npm run start
```

5. Access the API documentation:

```bash
http://localhost:5000/api-docs
```
