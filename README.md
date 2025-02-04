# Nonprofit Email Management API

## Overview
The Nonprofit Email Management API is designed to streamline the grant-making workflow by simplifying the process of sending personalized emails to nonprofits. This application enables foundations to:

- Create and manage nonprofit entities.
- Bulk send templated emails to a list of nonprofits.
- Retrieve records of all sent emails.

This project is built with **Node.js** and **Express.js** and uses in-memory storage for simplicity.

---

## Prerequisites
- **Node.js** (v14 or higher)
- **npm** (Node Package Manager)

---

## Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/zoofan/grant-management.git
   cd grant-managemen
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the server**:
   ```bash
   node index.js
   ```
   The server will start at `http://localhost:3000`.

4. **Run test script (in another terminal)**:
   ```bash
   node testEndpoints.js
   ```

---

## API Endpoints

### 1. Create Nonprofits
**Endpoint**: `POST /nonprofits`

**Description**: Adds a new nonprofit entity with metadata.

**Request Body**:
```json
{
  "name": "Charity A",
  "address": "123 Elm St",
  "email": "contact@charitya.org"
}
```

**Response**:
- **201 Created**:
  ```json
  {
    "message": "Nonprofit created successfully.",
    "nonprofit": {
      "id": "<uuid>",
      "name": "Charity A",
      "address": "123 Elm St",
      "email": "contact@charitya.org"
    }
  }
  ```
- **400 Bad Request**: If the email already exists.

---

### 2. Bulk Send Emails
**Endpoint**: `POST /emails/send`

**Description**: Sends a templated email to a list of nonprofits. The placeholders in the template (`{name}`, `{address}`) will be dynamically populated with nonprofit data.

**Request Body**:
```json
{
  "nonprofitEmails": ["contact@charitya.org", "contact@charityb.org"],
  "subject": "Grant Notification",
  "template": "Dear {name}, we are sending funds to {address}."
}
```

**Response**:
- **200 OK**:
  ```json
  {
    "message": "Emails processed.",
    "results": [
      { "email": "contact@charitya.org", "success": true },
      { "email": "contact@charityb.org", "success": false, "message": "Nonprofit not found." }
    ]
  }
  ```

---

### 3. Retrieve Sent Emails
**Endpoint**: `GET /emails`

**Description**: Retrieves all sent emails.

**Response**:
- **200 OK**:
  ```json
  {
    "sentEmails": [
      {
        "id": "<uuid>",
        "to": "contact@charitya.org",
        "subject": "Grant Notification",
        "body": "Dear Charity A, we are sending funds to 123 Elm St.",
        "sentAt": "2025-01-21T12:00:00.000Z"
      }
    ]
  }
  ```

---

## Example Interactions

### Create a Nonprofit
```bash
curl -X POST http://localhost:3000/nonprofits \
-H "Content-Type: application/json" \
-d '{"name": "Charity A", "address": "123 Elm St", "email": "contact@charitya.org"}'
```

### Bulk Send Emails
```bash
curl -X POST http://localhost:3000/emails/send \
-H "Content-Type: application/json" \
-d '{
  "nonprofitEmails": ["contact@charitya.org"],
  "subject": "Grant Notification",
  "template": "Dear {name}, we are sending funds to {address}."
}'
```

### Retrieve Sent Emails
```bash
curl http://localhost:3000/emails
```

---

## Mock Email Sender
This project includes a mock email sender, which logs the following details to the console:
- Recipient email
- Subject
- Body

Replace this functionality with a real email client (e.g., SendGrid, Amazon SES) for production.

---

## Future Enhancements
- Replace in-memory storage with a database (e.g., PostgreSQL or MongoDB).
- Add authentication and authorization for enhanced security.
- Implement rate limiting and email throttling.

