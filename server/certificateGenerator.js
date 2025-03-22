import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Derive __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to generate a PDF certificate
export const generateCertificate = async (userName, courseName) => {
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([800, 600]); // Increase page size for better layout

  // Embed fonts
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  // Add a gradient background
  const gradient = page.drawRectangle({
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    color: rgb(0.95, 0.95, 0.95), // Light gray background
  });

  // Add a decorative border
  page.drawRectangle({
    x: 50,
    y: 50,
    width: 700,
    height: 500,
    borderColor: rgb(0, 0, 0),
    borderWidth: 2,
  });

  // Add a header with the platform name
  page.drawText("Edemy", {
    x: 300,
    y: 520,
    size: 40,
    font,
    color: rgb(0, 0.5, 0.8), // Blue color
  });

  // Add a subheader
  page.drawText("Certificate of Completion", {
    x: 250,
    y: 480,
    size: 30,
    font,
    color: rgb(0, 0, 0),
  });

  // Add a decorative line
  page.drawLine({
    start: { x: 100, y: 460 },
    end: { x: 700, y: 460 },
    thickness: 2,
    color: rgb(0, 0, 0),
  });

  // Add the main certificate text
  page.drawText(`This certifies that`, {
    x: 100,
    y: 420,
    size: 20,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`${userName}`, {
    x: 100,
    y: 380,
    size: 30,
    font,
    color: rgb(0, 0.5, 0.8), // Blue color
  });

  page.drawText(`has successfully completed the course`, {
    x: 100,
    y: 340,
    size: 20,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  page.drawText(`${courseName}`, {
    x: 100,
    y: 300,
    size: 30,
    font,
    color: rgb(0, 0.5, 0.8), // Blue color
  });

  // Add a unique certificate ID
  const certificateId = Math.random()
    .toString(36)
    .substring(2, 10)
    .toUpperCase();
  page.drawText(`Certificate ID: ${certificateId}`, {
    x: 100,
    y: 250,
    size: 15,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  // Add a signature section
  page.drawText("Signature: ________________________", {
    x: 100,
    y: 200,
    size: 15,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("Manas Gupta", {
    x: 100,
    y: 180,
    size: 15,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("CEO of Edemy", {
    x: 100,
    y: 160,
    size: 15,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  // Add a footer
  page.drawText("Edemy - Online Learning Platform", {
    x: 250,
    y: 100,
    size: 15,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  page.drawText("www.edemy.com | contact@edemy.com", {
    x: 250,
    y: 80,
    size: 12,
    font: regularFont,
    color: rgb(0, 0, 0),
  });

  // Serialize the PDF to bytes
  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
};

// Function to save the certificate file
export const saveCertificate = async (pdfBytes, userId, courseId) => {
  const filePath = path.join(
    __dirname,
    "certificates",
    `${userId}_${courseId}.pdf`
  );

  // Ensure the "certificates" directory exists
  if (!fs.existsSync(path.join(__dirname, "certificates"))) {
    fs.mkdirSync(path.join(__dirname, "certificates"));
  }

  // Save the PDF file
  fs.writeFileSync(filePath, pdfBytes);
  return filePath;
};
