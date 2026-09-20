import Mailgen from "mailgen";
import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  const mailgenGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "TaskFlow",
      link: "https://taskflow-link.com",
    },
  });

  const emailPlainText = mailgenGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailgenGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST,
    port: process.env.MAILTRAP_SMTP_PORT,
    auth: {
      user: process.env.MAILTRAP_SMTP_USER,
      pass: process.env.MAILTRAP_SMTP_PASS,
    },
  });

  const mail = {
    from: "mail.taskflow@example.com",
    to: options.email,
    subject: options.subject,
    text: emailPlainText,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed make sure you have provided the mailtrap credentials correctly",
      error
    );
  }
};

const emailVerificationMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to TaskFlow! We're very excited to have you on board.",
      action: {
        instructions: "To get started with TaskFlow, please click here:",
        button: {
          color: "#22BC66",
          text: "Confirm your account",
          link: verificationUrl,
        },
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, verificationUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of your account",
      action: {
        instructions: "To reset the password, please click here:",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: verificationUrl,
        },
      },
      outro: "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent, sendEmail };
