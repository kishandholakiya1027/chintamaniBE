import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

const sendEmail = async (email: string, otp: string): Promise<void> => {
  try {
    const transporter = nodemailer.createTransport(smtpTransport({
      host: "stmp.gmail.com",
      port: 587,
      service: "gmail",
      requireTLS: true,
      auth: {
        type: "OAuth2",
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
        clientId: process.env.MAILCLIENT_ID,
        clientSecret: process.env.MAILCLIENT_SECRET,
        refreshToken: process.env.MAILREFRESH_TOKEN,
      },
    }));

    const mailConfigurations = {
      from: process.env.SMPT_MAIL,
      to: email,
      subject: "OTP for Registration",
      html: `
                <p>Dear User,</p>
                <p>Thank you for registering with our service. Your OTP is:</p>
                <h2>${otp}</h2>
                <p>Please use this OTP to complete the registration process.</p>
                <p>Best regards,<br/></p>
            `,
    };

    await transporter.sendMail(mailConfigurations, (error, info) => {
      // if (error) throw new Error(error.message);
      console.log("Email Sent Successfully");
      console.log(info);
    });
  } catch (error) {
    // throw new Error();
  }
};

export default sendEmail;
