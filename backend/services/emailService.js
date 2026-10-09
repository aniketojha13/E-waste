const nodemailer = require('nodemailer');

// In-memory OTP storage with 10-minute expiry: { [email]: { otp, expiresAt, attempts } }
const otpStore = new Map();

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOtp(email, otp) {
  const normalized = email.trim().toLowerCase();
  otpStore.set(normalized, {
    otp: String(otp),
    expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
    attempts: 0
  });
}

function verifyOtp(email, inputOtp) {
  const normalized = email.trim().toLowerCase();
  const record = otpStore.get(normalized);
  if (!record) {
    return { valid: false, message: 'OTP not found or expired. Please request a new verification code.' };
  }
  if (Date.now() > record.expiresAt) {
    otpStore.delete(normalized);
    return { valid: false, message: 'OTP has expired. Please click Resend OTP.' };
  }
  if (record.attempts >= 5) {
    otpStore.delete(normalized);
    return { valid: false, message: 'Too many incorrect attempts. Please request a new OTP.' };
  }
  if (record.otp !== String(inputOtp).trim()) {
    record.attempts += 1;
    return { valid: false, message: 'Invalid verification code. Please check your email and try again.' };
  }
  // Verified successfully
  otpStore.delete(normalized);
  return { valid: true };
}

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;

  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  } else {
    // Development simulator transporter with real-time delivery logs
    transporter = {
      sendMail: async (mailOptions) => {
        console.log('\n================== [REAL-TIME EMAIL DISPATCH] ==================');
        console.log(`To:      ${mailOptions.to}`);
        console.log(`From:    ${mailOptions.from || '"e-Amrit Portal" <notifications@e-amrit.org>'}`);
        console.log(`Subject: ${mailOptions.subject}`);
        console.log('-----------------------------------------------------------------');
        console.log(mailOptions.text || '(HTML Body dispatched)');
        console.log('=================================================================\n');
        return { messageId: 'msg_' + Date.now(), accepted: [mailOptions.to] };
      }
    };
  }

  return transporter;
}

const FROM_ADDRESS = process.env.EMAIL_FROM || '"e-Amrit Operations" <support@e-amrit.org>';

/**
 * Send real-time 6-digit OTP verification email
 */
async function sendOtpEmail({ to, name, purpose = 'Account Verification' }) {
  const otp = generateOtp();
  storeOtp(to, otp);

  try {
    const mailer = getTransporter();
    const subject = `${otp} is your e-Amrit Verification Code`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; background: #0b0f19; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 22px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 22px;">Email Verification Code</h1>
          <p style="color: #ecfdf5; margin: 4px 0 0 0; font-size: 13px;">e-Amrit Circular E-Waste Logistics</p>
        </div>
        <div style="padding: 26px 22px; background: #111827;">
          <h2 style="color: #f8fafc; margin-top: 0; font-size: 17px;">Hello ${name || 'User'},</h2>
          <p style="color: #94a3b8; line-height: 1.6; font-size: 14px;">
            Please use the one-time verification code below to complete your <strong>${purpose}</strong>.
          </p>
          <div style="background: #131c2e; border: 2px dashed #10b981; border-radius: 10px; padding: 20px; margin: 24px 0; text-align: center;">
            <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; letter-spacing: 8px; font-weight: 800; color: #10b981;">
              ${otp}
            </span>
            <div style="color: #64748b; font-size: 12px; margin-top: 8px;">
              Valid for 10 minutes • Do not share this code with anyone
            </div>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            If you did not request this verification code, please ignore this email.
          </p>
        </div>
        <div style="background: #0b0f19; padding: 14px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 11px;">
          e-Amrit Automated Security System • support@e-amrit.org
        </div>
      </div>
    `;

    await mailer.sendMail({
      from: FROM_ADDRESS,
      to,
      subject,
      text: `Hello ${name || 'User'},\n\nYour e-Amrit verification code is: ${otp}\nValid for 10 minutes.\n\nDo not share this code with anyone.`,
      html
    });

    return { success: true, otp };
  } catch (err) {
    console.error('Failed to send OTP email:', err.message);
    return { success: false, error: err.message, otp };
  }
}

/**
 * 1. Dispatched upon real-time customer account creation / registration
 */
async function sendWelcomeEmail({ to, name, username, role = 'customer' }) {
  try {
    const mailer = getTransporter();
    const subject = `Welcome to e-Amrit — Account Verified for ${name}`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Welcome to e-Amrit!</h1>
          <p style="color: #ecfdf5; margin: 6px 0 0 0; font-size: 14px;">National Circular E-Waste Management Network</p>
        </div>
        <div style="padding: 28px 24px; background: #111827;">
          <h2 style="color: #f8fafc; margin-top: 0; font-size: 18px;">Hello ${name},</h2>
          <p style="color: #94a3b8; line-height: 1.6; font-size: 14px;">
            Your e-Amrit account has been successfully verified and activated. You can now schedule doorstep device collections, diagnose gadgets with AI, and receive guaranteed instant buyback payouts.
          </p>
          <div style="background: #131c2e; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 13px;"><strong>Username:</strong> <span style="color: #10b981; font-family: monospace;">${username}</span></p>
            <p style="margin: 0; color: #94a3b8; font-size: 13px;"><strong>Authorized Role:</strong> <span style="color: #38bdf8; text-transform: uppercase; font-weight: 700;">${role}</span></p>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            Together, every device sustainably recycled prevents toxic heavy metals from contaminating local ecosystems.
          </p>
        </div>
        <div style="background: #0b0f19; padding: 16px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px;">
          e-Amrit Portal • Doorstep E-Waste Logistics & Ethical Refurbishment
        </div>
      </div>
    `;

    return await mailer.sendMail({
      from: FROM_ADDRESS,
      to,
      subject,
      text: `Hello ${name},\n\nYour e-Amrit account has been created and verified.\nUsername: ${username}\nRole: ${role}\n\nThank you for contributing to safe e-waste recycling!`,
      html
    });
  } catch (err) {
    console.error('Failed to send welcome email:', err.message);
  }
}

/**
 * 2. Dispatched upon submitting application form for joining as collection agent
 */
async function sendAgentApplicationReceivedEmail({ to, name, phone, city }) {
  try {
    const mailer = getTransporter();
    const subject = `Agent Application Received — Review In Progress for ${name}`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Application Received</h1>
          <p style="color: #f0f9ff; margin: 6px 0 0 0; font-size: 14px;">e-Amrit Doorstep Collection Fleet</p>
        </div>
        <div style="padding: 28px 24px; background: #111827;">
          <h2 style="color: #f8fafc; margin-top: 0; font-size: 18px;">Dear ${name},</h2>
          <p style="color: #94a3b8; line-height: 1.6; font-size: 14px;">
            Thank you for applying to become an authorized <strong>Doorstep Collection Agent</strong> with e-Amrit. Your application has been logged into our administrative recruitment queue.
          </p>
          <div style="background: #131c2e; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0 0 6px 0; color: #94a3b8; font-size: 13px;"><strong>Designated City/Depot:</strong> <span style="color: #f8fafc;">${city || 'Pending Verification'}</span></p>
            <p style="margin: 0 0 6px 0; color: #94a3b8; font-size: 13px;"><strong>Registered Phone:</strong> <span style="color: #f8fafc;">${phone}</span></p>
            <p style="margin: 0; color: #f59e0b; font-size: 13px;"><strong>Status:</strong> Under Administrative Verification (takes up to 24 hours)</p>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            Once our administration reviews and approves your submission, you will receive an official confirmation email containing your Agent credentials (username and temporary password) to start taking doorstep pickup dispatches.
          </p>
        </div>
        <div style="background: #0b0f19; padding: 16px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px;">
          e-Amrit Recruitment Cell • New Delhi, India
        </div>
      </div>
    `;

    return await mailer.sendMail({
      from: FROM_ADDRESS,
      to,
      subject,
      text: `Hello ${name},\n\nYour application to become a Collection Agent has been received. Our admin team will review it within 24 hours.\nCity: ${city}\n\nStay tuned for credentials upon approval.`,
      html
    });
  } catch (err) {
    console.error('Failed to send application confirmation email:', err.message);
  }
}

/**
 * 3. Dispatched upon Admin approval with configured username and password
 */
async function sendAgentApprovedEmail({ to, name, username, tempPassword }) {
  try {
    const mailer = getTransporter();
    const subject = `Congratulations ${name}! You are Approved as an e-Amrit Collection Agent`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Application Approved! 🎉</h1>
          <p style="color: #ecfdf5; margin: 6px 0 0 0; font-size: 14px;">Welcome to the Authorized Collection Agent Fleet</p>
        </div>
        <div style="padding: 28px 24px; background: #111827;">
          <h2 style="color: #f8fafc; margin-top: 0; font-size: 18px;">Congratulations, ${name}!</h2>
          <p style="color: #94a3b8; line-height: 1.6; font-size: 14px;">
            The e-Amrit administration team has approved your application. Your field collection agent account has been created and configured with the following credentials:
          </p>
          <div style="background: #131c2e; border: 1px solid #10b981; border-radius: 8px; padding: 18px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 13px;">
              <strong>Agent Username:</strong> 
              <span style="color: #38bdf8; font-family: monospace; font-size: 15px; font-weight: 700; margin-left: 6px;">${username}</span>
            </p>
            <p style="margin: 0 0 10px 0; color: #94a3b8; font-size: 13px;">
              <strong>Access Password:</strong> 
              <span style="color: #10b981; font-family: monospace; font-size: 15px; font-weight: 700; margin-left: 6px;">${tempPassword}</span>
            </p>
            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
              <strong>Agent Login Portal:</strong> 
              <a href="http://localhost:3000/login/agent" style="color: #38bdf8; text-decoration: underline; margin-left: 6px;">http://localhost:3000/login/agent</a>
            </p>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            <strong>Next steps:</strong> Log in to your Agent Operations dashboard to see customer collection requests matched to your locality, inspect device conditions, and process doorstep buyback disbursements.
          </p>
        </div>
        <div style="background: #0b0f19; padding: 16px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px;">
          e-Amrit Administration • Security Team
        </div>
      </div>
    `;

    return await mailer.sendMail({
      from: FROM_ADDRESS,
      to,
      subject,
      text: `Congratulations ${name}!\n\nYour application has been approved by the Admin team.\n\nYour Agent Credentials:\nUsername: ${username}\nPassword: ${tempPassword}\nAgent Portal: http://localhost:3000/login/agent\n\nPlease log in and update your profile.`,
      html
    });
  } catch (err) {
    console.error('Failed to send agent approved email:', err.message);
  }
}

/**
 * 4. Dispatched upon Admin rejecting an agent application
 */
async function sendAgentRejectedEmail({ to, name, reason = 'Application does not meet current regional depot capacity criteria.' }) {
  try {
    const mailer = getTransporter();
    const subject = `Update Regarding Your e-Amrit Agent Application`;
    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0b0f19; color: #f8fafc; border-radius: 12px; overflow: hidden; border: 1px solid #1e293b;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%); padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Application Status Update</h1>
          <p style="color: #fee2e2; margin: 6px 0 0 0; font-size: 14px;">e-Amrit Doorstep Collection Fleet</p>
        </div>
        <div style="padding: 28px 24px; background: #111827;">
          <h2 style="color: #f8fafc; margin-top: 0; font-size: 18px;">Dear ${name},</h2>
          <p style="color: #94a3b8; line-height: 1.6; font-size: 14px;">
            Thank you for your interest in joining the e-Amrit collection network. Following administrative review, we regret to inform you that your application could not be approved at this time.
          </p>
          <div style="background: #131c2e; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; color: #f87171; font-size: 13px;">
              <strong>Review Outcome:</strong> ${reason}
            </p>
          </div>
          <p style="color: #94a3b8; font-size: 13px; line-height: 1.5;">
            Our agent quotas are based on current volume demands in specific localities. You are welcome to submit a new application in the future as we expand collection zones.
          </p>
        </div>
        <div style="background: #0b0f19; padding: 16px; text-align: center; border-top: 1px solid #1e293b; color: #64748b; font-size: 12px;">
          e-Amrit Recruitment Cell • support@e-amrit.org
        </div>
      </div>
    `;

    return await mailer.sendMail({
      from: FROM_ADDRESS,
      to,
      subject,
      text: `Dear ${name},\n\nThank you for applying to e-Amrit. We regret to inform you that your agent application was not accepted at this time due to regional quota limitations.\n\nThank you for your interest.`,
      html
    });
  } catch (err) {
    console.error('Failed to send rejection email:', err.message);
  }
}

module.exports = {
  sendOtpEmail,
  verifyOtp,
  sendWelcomeEmail,
  sendAgentApplicationReceivedEmail,
  sendAgentApprovedEmail,
  sendAgentRejectedEmail
};
