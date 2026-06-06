import fs from 'fs';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        new Paragraph({
          text: "Task Planned Document - Goodi Baddi PWA",
          heading: HeadingLevel.TITLE,
        }),
        new Paragraph({
          children: [new TextRun({ text: "1. Project Overview", bold: true, size: 28 })],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          text: "The Goodi Baddi platform is a PWA designed for companies and HR teams to verify employee background, behavior, and previous company feedback. Currently, the project consists of a React.js (Vite) frontend with simulated (mocked) backend services.",
        }),
        new Paragraph({
          children: [new TextRun({ text: "2. Completed Tasks (Frontend / UI)", bold: true, size: 28 })],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({ text: "• Project Setup: React 19 + Vite + PWA configuration." }),
        new Paragraph({ text: "• UI Pages: Landing, Login, Signup, Dashboard, Search, Add Employee, Edit Employee, Add Feedback, Reports, Profiles, Admin Panel." }),
        new Paragraph({ text: "• Routing & Protected Routes." }),
        new Paragraph({ text: "• Mock Services: Simulated API calls and data for testing UI features." }),
        new Paragraph({
          children: [new TextRun({ text: "3. Pending Tasks (Backend API & DB)", bold: true, size: 28 })],
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({ text: "• Setup Backend Directory: Initialize a Node.js/Express server." }),
        new Paragraph({ text: "• Auth APIs: Implement /api/auth/signup, /api/auth/login with JWT and bcrypt." }),
        new Paragraph({ text: "• Employee APIs: Implement /api/employees/search, /api/employees (CRUD)." }),
        new Paragraph({ text: "• Feedback APIs: Implement /api/feedbacks for adding and retrieving feedback." }),
        new Paragraph({ text: "• Database Integration: Use in-memory DB or lightweight DB (like SQLite) if MongoDB is unavailable, to ensure it works instantly, or implement standard MongoDB schemas." }),
        new Paragraph({ text: "• Frontend Integration: Update `src/utils/api.js` and remove `mockService.js` to connect the real backend." }),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("Task_Planned_Document.docx", buffer);
  console.log("Task_Planned_Document.docx generated successfully.");
}).catch(console.error);
