const axios = require("axios");

const BASE_URL = "http://localhost:3000";

// Helper function to create a nonprofit
async function createNonprofit(name, address, email) {
  try {
    const response = await axios.post(`${BASE_URL}/nonprofits`, {
      name,
      address,
      email,
    });
    console.log("Create Nonprofit Response:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error creating nonprofit:", error.response.data);
    } else {
      console.error("Error creating nonprofit:", error.message);
    }
  }
}

// Helper function to send bulk emails
async function sendBulkEmails(nonprofitEmails, subject, template) {
  try {
    const response = await axios.post(`${BASE_URL}/emails/send`, {
      nonprofitEmails,
      subject,
      template,
    });
    console.log("Bulk Send Emails Response:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error sending bulk emails:", error.response.data);
    } else {
      console.error("Error sending bulk emails:", error.message);
    }
  }
}

// Helper function to retrieve all sent emails
async function getSentEmails() {
  try {
    const response = await axios.get(`${BASE_URL}/emails`);
    console.log("Retrieve Sent Emails Response:", response.data);
  } catch (error) {
    if (error.response) {
      console.error("Error retrieving sent emails:", error.response.data);
    } else {
      console.error("Error retrieving sent emails:", error.message);
    }
  }
}

// Main function to run all calls in sequence
(async function main() {
  try {
    // 1. Create nonprofits
    await createNonprofit("Charity A", "123 Main St", "charityA@example.com");
    await createNonprofit("Charity B", "456 Side St", "charityB@example.com");

    // 2. Send bulk emails
    await sendBulkEmails(
      ["charityA@example.com", "charityB@example.com", "missing@example.com"],
      "Hello from Our Service!",
      "Hi {name} at {address}, we wanted to reach out..."
    );

    // 3. Retrieve sent emails
    await getSentEmails();
  } catch (error) {
    console.error("Unexpected error in script:", error.message);
  }
})();
