import nodemailer from "nodemailer";

export const sendInviteEmail = async ({
  to,
  invitedBy,
  inviteLink,
  workspaceName,
}) => {
  if (!to) throw new Error("Invite recipient email is missing");



  const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
  port: 587,
  secure: false,
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });

  // ← ADD THIS — verify connection before sending
  await transporter.verify().catch((err) => {
    console.error("❌ Transporter verify failed:", err.message);
    throw new Error(`Email transporter error: ${err.message}`);
  });

  const info = await transporter.sendMail({
    from: `"Cliently CRM" <${process.env.GMAIL_USER}>`,
    to,
    replyTo: invitedBy,
    subject: `You are invited to join ${workspaceName || "Cliently CRM"}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>You have been invited to Cliently CRM</h2>
        <p>You were invited by <strong>${invitedBy}</strong>.</p>
        <p>Workspace: <strong>${workspaceName || "Cliently CRM"}</strong></p>
        <p>Click below to accept your invite:</p>
        <a href="${inviteLink}"
           style="display:inline-block;padding:10px 16px;background:#111;color:#fff;text-decoration:none;border-radius:6px;">
          Accept Invite
        </a>
        <p>If the button does not work, copy this link:</p>
        <p>${inviteLink}</p>
      </div>
    `,
  });

  console.log("✅ Email sent:", info.messageId);
};