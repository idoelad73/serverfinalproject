// import transporter from '../services/mailer.js';
import getTransporter from "../services/mailer.js";




export default async function emailValidationTemplate(user, verificationUrl) {
  // 🔁 Get next available transporter (rotates between accounts)
  const transporter = getTransporter();

  await transporter.sendMail({
    // Use the actual Gmail account as sender
    from: `"PuzzlePro" <${transporter.options.auth.user}>`,
    to: user.user_email,
    subject: "Email Verification",
    html: `
<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>אימות כתובת אימייל</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; background-color: #eef2f5;">
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eef2f5; padding: 40px 0;">
        <tr>
            <td align="center">
                
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    
                    <tr>
                        <td align="center" style="padding: 30px 20px 20px 20px;">
                            <div style="font-size: 24px; color: #10b981; font-weight: 700;">
                                ✅ אימות נדרש
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 0 50px 40px 50px; text-align: right;">
                            
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 24px; font-weight: 600; text-align: center;">
                                ברוכים הבאים!
                            </h2>
                            
                            <p style="margin: 0 0 25px 0; color: #4b5563; font-size: 16px; line-height: 1.7;">
                                תודה שהצטרפתם! לאפליקציה המגניבה שלי. כדי להפעיל את החשבון שלכם ולהתחיל להשתמש בשירות שלנו,
                                אנא לחצו על הכפתור למטה לאימות כתובת האימייל:
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${verificationUrl}" 
                                           style="display: inline-block; 
                                                  padding: 15px 35px; 
                                                  background-color: #10b981;
                                                  color: #ffffff; 
                                                  text-decoration: none; 
                                                  border-radius: 6px; 
                                                  font-size: 17px; 
                                                  font-weight: 600;
                                                  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.4);">
                                            🔐 אמת את כתובת האימייל עכשיו
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.6; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                                <strong style="color: #374151;">קישור חלופי:</strong>
                            </p>
                            
                            <p style="margin: 0; padding: 15px; background-color: #f3f4f6; border-radius: 4px; word-break: break-all; text-align: left; direction: ltr;">
                                <a href="${verificationUrl}" style="color: #059669; text-decoration: none; font-size: 13px;">
                                    ${verificationUrl}
                                </a>
                            </p>

                            <p style="margin: 20px 0 0 0; color: #9ca3af; font-size: 13px; line-height: 1.6; text-align: center;">
                                ⚠️ קישור זה יפוג תוך <strong style="color: #ef4444;">שעה אחת</strong> מרגע שליחתו.
                            </p>

                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 20px 50px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #9ca3af; font-size: 12px;">
                                אם לא ביקשתם אימות זה, אנא התעלמו מהודעה זו.
                            </p>
                            <p style="margin: 0; color: #d1d5db; font-size: 11px;">
                                © 2025 All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
    </table>
</body>
</html>
`
  });
}


async function resetPasswordTemplate(user, resetPasswordUrl) {
    await transporter.sendMail({
        from: 'noreply@example.com',
        to: user.user_email,
        subject: 'איפוס סיסמה',
        html: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>איפוס סיסמה</title>
    </head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; background-color: #eef2f5;">
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eef2f5; padding: 40px 0;">
        <tr>
            <td align="center">
                
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    
                    <tr>
                        <td align="center" style="padding: 30px 20px 20px 20px;">
                            <div style="font-size: 24px; color: #10b981; font-weight: 700;">
                                🔐 איפוס סיסמה
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 0 50px 40px 50px; text-align: right;">
                            
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600; text-align: center;">
                                בקשה לשינוי סיסמה
                            </h2>
                            
                            <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.7;">
                                שלום, <br>
                                קיבלנו בקשה לאיפוס הסיסמה עבור החשבון שלך. אם אתה זה שביקש את האיפוס, אנא לחץ על הכפתור הירוק למטה כדי להמשיך:
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="padding: 20px 0;">
                                        <a href="${resetPasswordUrl}" 
                                           style="display: inline-block; 
                                                  padding: 16px 40px; 
                                                  background-color: #10b981; /* ירוק רענן - צבע ראשי */
                                                  color: #ffffff; 
                                                  text-decoration: none; 
                                                  border-radius: 50px; 
                                                  font-size: 17px; 
                                                  font-weight: 600;
                                                  box-shadow: 0 5px 15px rgba(16, 185, 129, 0.4);
                                                  transition: background-color 0.3s ease;">
                                            🔒 צור סיסמה חדשה
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 30px 0 10px 0; color: #9ca3af; font-size: 13px; line-height: 1.6; text-align: center; border-top: 1px solid #f3f4f6; padding-top: 20px;">
                                <strong style="color: #ef4444;">⏱️ תוקף:</strong> קישור זה יפוג תוך **שעה אחת** מטעמי אבטחה.
                            </p>
                            
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 20px; margin-bottom: 20px;">
                                <tr>
                                    <td style="padding: 15px; background-color: #fee2e2; border-right: 4px solid #ef4444; border-radius: 6px;">
                                        <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6;">
                                            🚨 <strong>אבטחת חשבון:</strong> אם לא ביקשת איפוס זה, אנא התעלם ממייל זה לחלוטין. הסיסמה שלך תישאר מאובטחת וללא שינוי. אין צורך בפעולה נוספת.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 20px 0 10px 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                קישור ישיר (אם הכפתור אינו עובד):
                            </p>
                            <p style="margin: 0; padding: 15px; background-color: #f3f4f6; border-radius: 4px; word-break: break-all; text-align: left; direction: ltr;">
                                <a href="${resetPasswordUrl}" style="color: #059669; text-decoration: none; font-size: 13px;">
                                    ${resetPasswordUrl}
                                </a>
                            </p>

                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 30px 50px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                מייל זה נשלח אוטומטית. נא לא להשיב למייל זה.
                            </p>
                            <p style="margin: 5px 0 0 0; color: #d1d5db; font-size: 11px;">
                                © 2025 All rights reserved
                            </p>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
    </table>
</body>
</html>`,
    });
}

async function supportTicketNotificationTemplate(user, ticket) {
    const transporter = getTransporter();
    await transporter.sendMail({
        from: `"IDO Support" <${process.env.EMAIL_USER}>`,
        to: user.user_email,
        subject: 'Support Case',
        html: `<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>פנייה חדשה נפתחה</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji'; background-color: #eef2f5;">
    
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #eef2f5; padding: 40px 0;">
        <tr>
            <td align="center">
                
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05); overflow: hidden;">
                    
                    <tr>
                        <td align="center" style="padding: 30px 20px 20px 20px;">
                            <div style="font-size: 24px; color: #3b82f6; font-weight: 700;">
                                🎫 פנייה חדשה נפתחה
                            </div>
                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 0 50px 40px 50px; text-align: right;">
                            
                            <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 22px; font-weight: 600; text-align: center;">
                                הפנייה שלך התקבלה בהצלחה
                            </h2>
                            
                            <p style="margin: 0 0 30px 0; color: #4b5563; font-size: 16px; line-height: 1.7;">
                                שלום ${user.name || 'משתמש יקר'}, <br>
                                תודה שפנית אלינו. הצוות שלנו קיבל את הפנייה ויטפל בה בהקדם האפשרי.
                            </p>
                            
                            <!-- Ticket Details Card -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                                <tr>
                                    <td style="padding: 20px; background-color: #f9fafb;">
                                        <h3 style="margin: 0 0 15px 0; color: #1f2937; font-size: 16px; font-weight: 600;">
                                            פרטי הפנייה
                                        </h3>
                                        
                                        <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 120px;">
                                                    <strong>מספר פנייה:</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
                                                    #${ticket.ticketNumber}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                                                    <strong>נושא:</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                                                    ${ticket.subject}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                                                    <strong>קטגוריה:</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                                                    ${ticket.category || 'כללי'}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                                                    <strong>עדיפות:</strong>
                                                </td>
                                                <td style="padding: 8px 0;">
                                                    <span style="display: inline-block; padding: 4px 12px; background-color: ${ticket.priority === 'high' ? '#fee2e2' : ticket.priority === 'medium' ? '#fef3c7' : '#dbeafe'}; color: ${ticket.priority === 'high' ? '#991b1b' : ticket.priority === 'medium' ? '#92400e' : '#1e40af'}; border-radius: 12px; font-size: 13px; font-weight: 600;">
                                                        ${ticket.priority === 'high' ? 'גבוהה' : ticket.priority === 'medium' ? 'בינונית' : 'נמוכה'}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">
                                                    <strong>תאריך פתיחה:</strong>
                                                </td>
                                                <td style="padding: 8px 0; color: #1f2937; font-size: 14px;">
                                                    ${ticket.createdAt || new Date().toLocaleDateString('he-IL')}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <!-- Message Content -->
                            ${ticket.message ? `
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 20px 0;">
                                <tr>
                                    <td style="padding: 20px; background-color: #f3f4f6; border-radius: 8px;">
                                        <h4 style="margin: 0 0 10px 0; color: #1f2937; font-size: 14px; font-weight: 600;">
                                            תוכן הפנייה:
                                        </h4>
                                        <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">
                                            ${ticket.message}
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            ` : ''}
                            
                            <!-- Info Box -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 30px;">
                                <tr>
                                    <td style="padding: 15px; background-color: #dbeafe; border-right: 4px solid #3b82f6; border-radius: 6px;">
                                        <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                                            💡 <strong>מה הלאה?</strong> הצוות שלנו בודק את הפנייה שלך ויחזור אליך בהקדם. זמן תגובה משוער: 24-48 שעות בימי עסקים.
                                        </p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 30px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.6; text-align: center;">
                                נשמח לעזור! אם יש לך מידע נוסף, אתה מוזמן להשיב למייל זה.
                            </p>

                        </td>
                    </tr>
                    
                    <tr>
                        <td style="padding: 30px 50px; background-color: #f9fafb; border-top: 1px solid #e5e7eb; text-align: center;">
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                מייל זה נשלח אוטומטית מעקב אחר פנייתך.
                            </p>
                            <p style="margin: 5px 0 0 0; color: #d1d5db; font-size: 11px;">
                                © 2025 All rights reserved
                            </p>
                        </td>
                    </tr>
                </table>
                
            </td>
        </tr>
    </table>
</body>
</html>`,
    });
}



export { emailValidationTemplate, resetPasswordTemplate, supportTicketNotificationTemplate };