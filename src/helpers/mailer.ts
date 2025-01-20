import nodemailer from "nodemailer";
import bcryptjs from "bcryptjs";
import User from "@/models/user.model";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  try {
    // generating token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    // storing token in DB
    if (emailType == "VERIFY") {
      const updatedUser = await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
      if (!updatedUser) throw new Error("Problem updating verifyToken in DB");
    } else {
      const updatedUser = await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
      if (!updatedUser)
        throw new Error("Problem updating forgotPasswordToken in DB");
    }

    // coonfig from nodemailer plus mailtrap
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SENDER_MAIL,
      to: email,
      subject:
        emailType == "VERIFY" ? "Verify your email" : "Reset your password",
      html:
        emailType == "VERIFY"
          ? `<p>Click <a href="${process.env.DOMAIN}/verifyemail?token=${hashedToken}">here</a> to verify</p>
           <p>Or goto this link ${process.env.DOMAIN}/verifyemail?token=${hashedToken}</p>
          `
          : `<p>Click <a href="${process.env.DOMAIN}/resetpassword?token=${hashedToken}">here</a> to reset your password</p>
           <p>Or goto this link ${process.env.DOMAIN}/resetpassword?token=${hashedToken}</p>
          `,
    };

    const mailResponse = await transport.sendMail(mailOptions);

    return mailResponse;
  } catch (error) {
    console.log("Problem sending email", error);
  }
};
