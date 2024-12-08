import { Resend } from 'resend';
import { createHash } from 'crypto';

const resend = new Resend(process.env.RESEND_API_KEY);

export const emailVerificationToken = (email: string) => {
  const token = createHash('sha256')
    .update(email + process.env.EMAIL_SECRET)
    .digest('hex');
  return token;
};

export const sendVerificationEmail = async (email: string, name: string) => {
  const token = emailVerificationToken(email);
  const verificationLink = `${process.env.NEXTAUTH_URL}/auth/verify?token=${token}&email=${encodeURIComponent(email)}`;

  await resend.emails.send({
    from: 'no-reply@yourdomain.com',
    to: email,
    subject: 'Vérifiez votre adresse email',
    html: `
      <h1>Bienvenue ${name}!</h1>
      <p>Merci de vous être inscrit. Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
      <a href="${verificationLink}">Vérifier mon email</a>
      <p>Ce lien expirera dans 24 heures.</p>
    `,
  });
};