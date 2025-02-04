const express = require("express");
const bodyParser = require("body-parser");
const {v4: uuidv4} = require("uuid");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());

// In-memory storage
const nonprofits = {}; // Keyed by email
const sentEmails = [];

// Mock email sender
const mockSendEmail = (to, subject, body) => {
  console.log(`Email sent to: ${to}`);
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
};

// Routes

// 1. Create Nonprofits
app.post("/nonprofits", (req, res) => {
  const {name, address, email} = req.body;

  if (nonprofits[email]) {
    return res
      .status(400)
      .json({message: "Nonprofit with this email already exists."});
  }

  nonprofits[email] = {id: uuidv4(), name, address, email};
  res.status(201).json({
    message: "Nonprofit created successfully.",
    nonprofit: nonprofits[email],
  });
});

// 2. Bulk Send Emails
app.post("/emails/send", (req, res) => {
  const {nonprofitEmails, subject, template} = req.body;

  if (!Array.isArray(nonprofitEmails) || nonprofitEmails.length === 0) {
    return res
      .status(400)
      .json({message: "Nonprofit emails must be a non-empty array."});
  }

  const emailResults = nonprofitEmails.map((email) => {
    const nonprofit = nonprofits[email];
    if (!nonprofit) {
      return {email, success: false, message: "Nonprofit not found."};
    }

    const body = template
      .replace("{name}", nonprofit.name)
      .replace("{address}", nonprofit.address);

    mockSendEmail(email, subject, body);

    const sentEmail = {
      id: uuidv4(),
      to: email,
      subject,
      body,
      sentAt: new Date().toISOString(),
    };

    sentEmails.push(sentEmail);
    return {email, success: true};
  });

  res.status(200).json({message: "Emails processed.", results: emailResults});
});

// 3. Retrieve Sent Emails
app.get("/emails", (req, res) => {
  res.status(200).json({sentEmails});
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
