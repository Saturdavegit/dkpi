import nodemailer from 'nodemailer';

// Vérification des variables d'environnement requises
const requiredEnvVars = ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_TOKEN', 'SMTP_FROM', 'ADMIN_EMAIL'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Variables d\'environnement manquantes:', missingEnvVars);
}

export const emailConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_TOKEN,
  },
};

export const transporter = nodemailer.createTransport(emailConfig);

// Fonction utilitaire pour vérifier la connexion SMTP
export async function verifyEmailConnection() {
  try {
    await transporter.verify();
    console.log('Connexion SMTP établie avec succès');
    return true;
  } catch (error) {
    console.error('Erreur de connexion SMTP:', error);
    return false;
  }
} 