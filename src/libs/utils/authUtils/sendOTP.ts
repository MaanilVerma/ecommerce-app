import nodemailer from "nodemailer";

export async function sendOtp(email: string, otp: string) {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.NEXT_PUBLIC_SENDER_EMAIL,
        pass: process.env.NEXT_PUBLIC_EMAIL_PASSWORD,
        clientId: process.env.NEXT_PUBLIC_OAUTH_CLIENTID,
        clientSecret: process.env.NEXT_PUBLIC_OAUTH_CLIENT_SECRET,
        refreshToken: process.env.NEXT_PUBLIC_OAUTH_REFRESH_TOKEN,
      },
    } as nodemailer.TransportOptions);

    const mailOptions = {
      from: `"${process.env.NEXT_PUBLIC_SENDER_NAME}" <${process.env.NEXT_PUBLIC_SENDER_EMAIL}>`,
      to: `${email}`,
      subject: process.env.NEXT_PUBLIC_EMAIL_SUBJECT ?? "Your Verification PIN",
      generateTextFromHTML: true,
      html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
              <div style="background-color: #007bff; color: #fff; padding: 20px; border-top-left-radius: 10px; border-top-right-radius: 10px;">
                  <h1 style="margin: 0;">Verification PIN</h1>
              </div>
              <div style="padding: 20px;">
                  <p>Dear User,</p>
                  <p>Here is your verification PIN: <strong>${otp}</strong></p>
                  <p>Please use this PIN to complete your verification process.</p>
              </div>
              <div style="background-color: #f8f9fa; padding: 20px; border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; text-align: center;">
                  <p>Thank you,</p>
                  <p>${process.env.NEXT_PUBLIC_SENDER_NAME}</p>
              </div>
              </div>
        `,
    };

    await transporter.sendMail(mailOptions);

    return {
      status: 200,
      message: "OTP sent successfully!",
    };
  } catch (error: any) {
    console.error("Error sending OTP: ", error);

    return {
      status: "error",
      message: "Failed to send OTP",
      error: error.message,
    };
  }
}
