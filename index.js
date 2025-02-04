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

const checkIfAllTagsExistForUser = (template, nonprofit) => {
  const allTags = /{[^}]+}/g;
  const tags = template.match(allTags);
  return tags.every((tag) => nonprofit.hasOwnProperty(tag.slice(1, -1)));
};

// 2. Bulk Send Emails
app.post("/emails/send", (req, res) => {
  const {nonprofitEmails, cc, bcc, subject, template} = req.body;

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

    if (!checkIfAllTagsExistForUser(template, nonprofit)) {
      return {
        email,
        success: false,
        message: "Nonprofit does not have all required fields.",
      };
    }

    const body = template
      .replace("{name}", nonprofit.name)
      .replace("{address}", nonprofit.address);

    mockSendEmail(email, subject, body);

    const sentEmail = {
      id: uuidv4(),
      to: email,
      cc: cc || "",
      bcc: bcc || "",
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

app.get("/myemails", (req, res) => {
  /// get email from auth token, etc
  const myEmails = sentEmails.filter((sentEmail) => sentEmail.to === email);
  res.status(200).json({myEmails});
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
