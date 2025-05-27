const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');
const Handlebars = require('handlebars');

// Configure transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Load email template
const welcomeTemplatePath = path.join(__dirname, '../templates/welcomeEmail.html');
const welcomeTemplateSource = fs.readFileSync(welcomeTemplatePath, 'utf8');
const welcomeTemplate = Handlebars.compile(welcomeTemplateSource);

// Send welcome email
exports.sendWelcomeEmail = async (user) => {
  try {
    const mailOptions = {
      from: `"Medibot AI" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to Medibot AI!',
      html: welcomeTemplate({
        userName: user.fullName || 'there',
        year: new Date().getFullYear()
      })
    };

    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent to:', user.email);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
    return false;
  }
};