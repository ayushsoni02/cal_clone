"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST || 'smtp.example.com',
    port: Number(process.env.SMTP_PORT) || 587,
    auth: {
        user: process.env.SMTP_USER || 'test',
        pass: process.env.SMTP_PASS || 'test',
    },
});
const sendEmail = async (to, subject, html) => {
    if (!process.env.SMTP_USER || process.env.SMTP_USER === 'test') {
        // Development mode / no credentials — just log instead of crashing
        console.log(`[EMAIL DEV LOG] To: ${to} | Subject: ${subject}`);
        return;
    }
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || '"Cal.com Clone" <noreply@cal.com>',
            to,
            subject,
            html,
        });
    }
    catch (err) {
        console.error('Error sending email:', err);
    }
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.js.map