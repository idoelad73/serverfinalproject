import nodemailer from "nodemailer";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load JSON file manually
const emailAccountsPath = path.join(__dirname, "../util/emailAccunts.json");
const emailAccounts = JSON.parse(
  fs.readFileSync(emailAccountsPath, "utf-8")
);

if (!Array.isArray(emailAccounts) || emailAccounts.length === 0) {
  throw new Error("emailAccunts.json is empty or invalid");
}

let currentIndex = 0;

// Create transporters
const transporters = emailAccounts.map(acc =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: acc.user,
      pass: acc.pass
    }
  })
);

// Rotate transporters
function getTransporter() {
  const transporter = transporters[currentIndex];
  currentIndex = (currentIndex + 1) % transporters.length;
  return transporter;
}

export default getTransporter;
