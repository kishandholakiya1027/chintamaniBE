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
        user: 'bharatdeny771@gmail.com',
        pass: 'ycgp xncf nvvc oftq',
        clientId: '727533022015-agi1p2hukban7g6pa14famf7i82bn24d.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04hGDPpdX0J2PCgYIARAAGAQSNwF-L9Ir3qxJuegxfgjZWenUT_ziMIKUrsn6r3j6PbpnjfFN0sT4nKtMHQSsOmEU3fh179XQuyY',
      },
    }));

    const mailConfigurations = {
      from: 'bharatdeny771@gmail.com',
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
