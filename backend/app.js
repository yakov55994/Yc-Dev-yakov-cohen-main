import express from 'express';
import { Resend } from 'resend';
import bodyParser from 'body-parser';
import cors from 'cors';

const app = express();
const resend = new Resend('re_WuPYgTHX_Pi1isLDfv7kYC4eaKPnVXngF'); // הכנס את ה-API KEY שלך

app.use(cors());
app.use(bodyParser.json());

app.post('/api/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    await resend.emails.send({
      from: 'יעקב כהן <yakov100>',
      to: ['yakov1002444@gmail.com'],
      subject: `פנייה חדשה מהאתר`,
      html: `<p><strong>שם:</strong> ${name}</p>
             <p><strong>אימייל:</strong> ${email}</p>
             <p><strong>טלפון:</strong> ${phone}</p>
             <p><strong>הודעה:</strong><br>${message}</p>`
    });

    res.status(200).send('נשלח בהצלחה');
  } catch (err) {
    console.error(err);
    res.status(500).send('שגיאה בשליחה');
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
