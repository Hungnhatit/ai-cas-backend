import nodemailer from 'nodemailer'
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: 'education.aicas@gmail.com',
    pass: 'iahwujttxjjmzmsu'
  },
  tls: {
    rejectUnauthorized: false
  }
});

export const sendResetPasswordEmail = async (email, resetUrl) => {
  const mailOptions = {
    from: '"AI-CAS Support" <no-reply@aicas.com>',
    to: email,
    subject: 'Yêu cầu đặt lại mật khẩu',
    html: `
      <h3>Xin chào,</h3>
      <p>Bạn nhận được email này vì chúng tôi đã nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
      <p>Vui lòng nhấp vào liên kết bên dưới hoặc dán vào trình duyệt để hoàn tất quá trình:</p>
      <a href="${resetUrl}" target="_blank" style="">Đặt lại mật khẩu</a>
      <p>Liên kết này sẽ hết hạn trong vòng 15 phút.</p>
      <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};