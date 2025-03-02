import nodemailer from 'nodemailer';

export default async function handler(req:any, res:any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { data } = req.body; // Oczekujemy tablicy danych

  if (!Array.isArray(data) || data.length === 0) {
    return res.status(400).json({ error: 'Invalid data format' });
  }

  // Konfiguracja transportera (użyj swoich danych SMTP)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST, // np. smtp.gmail.com
    port: 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // Formatowanie tablicy do e-maila
  const formattedData = data.map((item, index) => `${index + 1}. ${JSON.stringify(item)}`).join('\n');

  try {
    await transporter.sendMail({
      from: `"Next.js App" <${process.env.SMTP_USER}>`,
      to: 'cetex.tc@gmail.com',
      subject: 'Dane z tablicy',
      text: `Otrzymano dane:\n\n${formattedData}`,
    });

    return res.status(200).json({ message: 'E-mail wysłany!' });
  } catch (error) {
    return res.status(500).json({ error: 'Błąd wysyłania e-maila', details: error.message });
  }
}