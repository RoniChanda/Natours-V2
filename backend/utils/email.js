const nodemailer = require("nodemailer");
const htmlToText = require("html-to-text");
const BrevoTransport = require("nodemailer-sendinblue-transport");

const baseTemplate = require("../email-templates/base-template");
const welcomeTemplate = require("../email-templates/welcome-template");
const passwordResetTemplate = require("../email-templates/passwordReset-template");
const verificationOtpTemplate = require("../email-templates/verificationOtp-template");

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = `Supratim Chanda <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === "production") {
      // send grid or sendinblue or brevo (in production)
      return nodemailer.createTransport(
        new BrevoTransport({ apiKey: process.env.BREVO_API_KEY })
      );
    }

    // MailTrap (in development)
    return nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });
  }

  async send(content, subject) {
    const html = baseTemplate(content, this.firstName, this.url);

    // email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      text: htmlToText.convert(html),
      html,
    };

    // create transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send(welcomeTemplate, "Welcome to natours family!");
  }

  async sendPasswordReset() {
    await this.send(
      passwordResetTemplate,
      "Your password reset token (valid for 10 mins)."
    );
  }

  async sendVerificationCode() {
    await this.send(
      verificationOtpTemplate,
      "Your email verification OTP (valid for 10 mins)."
    );
  }
};
