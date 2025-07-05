import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendNewComplaintEmail = async (complaint) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `New Complaint Submitted: ${complaint.title}`,
    html: `
      <h1>New Complaint Details</h1>
      <p><strong>Title:</strong> ${complaint.title}</p>
      <p><strong>Description:</strong> ${complaint.description}</p>
      <p><strong>Category:</strong> ${complaint.category}</p>
      <p><strong>Priority:</strong> ${complaint.priority}</p>
      <p><strong>Date Submitted:</strong> ${complaint.dateSubmitted}</p>
      <p>View in Admin Panel: <a href="http://localhost:3001/admin">Link to Admin Dashboard</a></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('New complaint email sent successfully!');
  } catch (error) {
    console.error('Error sending new complaint email:', error);
  }
};

export const sendStatusUpdateEmail = async (complaint, previousStatus) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.ADMIN_EMAIL,
    subject: `Complaint Status Updated: ${complaint.title}`,
    html: `
      <h1>Complaint Status Update</h1>
      <p><strong>Title:</strong> ${complaint.title}</p>
      <p><strong>Previous Status:</strong> ${previousStatus}</p>
      <p><strong>New Status:</strong> ${complaint.status}</p>
      <p><strong>Updated At:</strong> ${complaint.lastUpdated}</p>
      <p>View in Admin Panel: <a href="http://localhost:3001/admin">Link to Admin Dashboard</a></p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Status update email sent successfully!');
  } catch (error) {
    console.error('Error sending status update email:', error);
  }
};