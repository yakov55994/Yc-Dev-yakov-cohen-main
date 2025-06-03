import express from 'express';
import { Resend } from 'resend';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// טוען משתני סביבה מקובץ .env
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// יצירת חיבור ל-Resend עם API KEY ממשתנה סביבה
const resend = new Resend(process.env.RESEND_API_KEY);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // לקבצים סטטיים

// אנדפוינט לשליחת אימייל
app.post('/api/send-email', async (req, res) => {
  const { name, email, phone, message } = req.body;

  // ולידציה בסיסית
  if (!name || !email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: 'שם, אימייל והודעה הם שדות חובה' 
    });
  }

  // ולידציה של כתובת אימייל
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: 'כתובת אימייל לא תקינה' 
    });
  }

  try {
    const emailData = await resend.emails.send({
      // ⚠️ חשוב: צריך להיות דומיין מאומת ב-Resend
      from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
      to: [process.env.TO_EMAIL || 'yakov1002444@gmail.com'],
      subject: '📧 פנייה חדשה מהאתר',
      html: `
        <!DOCTYPE html>
        <html dir="rtl" lang="he">
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; direction: rtl; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #667eea; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 20px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #333; }
            .value { margin-top: 5px; padding: 10px; background: white; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>📧 פנייה חדשה מהאתר</h2>
            </div>
            <div class="content">
              <div class="field">
                <div class="label">👤 שם:</div>
                <div class="value">${name}</div>
              </div>
              <div class="field">
                <div class="label">📧 אימייל:</div>
                <div class="value">${email}</div>
              </div>
              ${phone ? `
              <div class="field">
                <div class="label">📞 טלפון:</div>
                <div class="value">${phone}</div>
              </div>
              ` : ''}
              <div class="field">
                <div class="label">💬 הודעה:</div>
                <div class="value">${message.replace(/\n/g, '<br>')}</div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
      // אופציונלי: שליחת אימייל אישור ללקוח
      replyTo: email
    });

    console.log('Email sent successfully:', emailData.id);
    res.status(200).json({ 
      success: true, 
      message: 'ההודעה נשלחה בהצלחה!',
      emailId: emailData.id 
    });

  } catch (error) {
    console.error('Resend Error:', error);
    
    // טיפול מפורט בשגיאות
    let errorMessage = 'אירעה שגיאה בשליחת ההודעה';
    
    if (error.message?.includes('Invalid from')) {
      errorMessage = 'שגיאה בהגדרת כתובת השולח';
    } else if (error.message?.includes('API key')) {
      errorMessage = 'שגיאה באימות המערכת';
    }

    res.status(500).json({ 
      success: false, 
      error: errorMessage 
    });
  }
});

// דף הודיה (אופציונלי)
app.get('/thanks', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="he" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>תודה על פנייתך</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          text-align: center; 
          padding: 50px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .container {
          background: white;
          color: #333;
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🙏 תודה על פנייתך!</h1>
        <p>ההודעה נשלחה בהצלחה. אחזור אליך בהקדם האפשרי.</p>
        <p><a href="/">חזרה לאתר</a></p>
      </div>
    </body>
    </html>
  `);
});

// הגשת דף הבית
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// טיפול בשגיאות
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: 'שגיאת שרת פנימית' });
});

// הפעלת השרת
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Contact form available at http://localhost:${PORT}`);
});

export default app;