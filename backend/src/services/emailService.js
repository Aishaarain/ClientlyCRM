// import { Resend } from "resend";
// import User from "../models/user.js";

// const getFrontendUrl = () =>
//   process.env.FRONTEND_URL || process.env.CLIENT_URL || "http://localhost:5173";

// const getResendClient = () => {
//   if (!process.env.RESEND_API_KEY) {
//     throw new Error(
//       "Email service is not configured. Add RESEND_API_KEY in backend/.env."
//     );
//   }

//   return new Resend(process.env.RESEND_API_KEY);
// };

// const getFromEmail = () =>
//   process.env.RESEND_FROM_EMAIL || "Velora CRM <onboarding@resend.dev>";

// const buildInviteHtml = ({ adminName, inviteLink }) => `
//   <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:16px">
//     <h2 style="color:#6366f1;margin:0 0 12px">You're invited to Velora CRM!</h2>

//     <p style="color:#111827;font-size:15px;line-height:1.6">
//       <strong>${adminName}</strong> has invited you to join their workspace.
//     </p>

//     <a href="${inviteLink}"
//        style="display:inline-block;background:#6366f1;color:white;padding:12px 28px;
//               border-radius:10px;text-decoration:none;font-weight:bold;margin:18px 0">
//       Accept Invitation
//     </a>

//     <p style="color:#6b7280;font-size:13px;line-height:1.5">
//       This link expires in 48 hours. If you were not expecting this invitation,
//       you can ignore this email.
//     </p>
//   </div>
// `;

// export const sendInviteEmail = async ({ adminId, toEmail, inviteLink }) => {
//   const admin = await User.findById(adminId).select("name email");

//   if (!admin) {
//     throw new Error("Admin user not found.");
//   }

//   const resend = getResendClient();
//   const adminName = admin.name || "Velora CRM Admin";
//   const finalInviteLink = inviteLink || getFrontendUrl();

//   const { data, error } = await resend.emails.send({
//     from: getFromEmail(),
//     to: [toEmail],
//     replyTo: admin.email,
//     subject: `${adminName} invited you to join Velora CRM`,
//     text: `${adminName} invited you to join their workspace. Accept invitation: ${finalInviteLink}`,
//     html: buildInviteHtml({
//       adminName,
//       inviteLink: finalInviteLink,
//     }),
//   });

//   if (error) {
//     throw new Error(error.message || "Failed to send invite email with Resend.");
//   }

//   return data;
// };