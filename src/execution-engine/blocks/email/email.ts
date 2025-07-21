export async function sendEmail(to: string, subject: string, html: string) {
  
  const footerHTML = `<div style="text-align:center;font-size:12px;color:#888">Sent by a workflow on <a href="https://x.com/fraktal_app" style="font-size:12px;color:#888"> Fraktal </a>.</div>`;

  try {

    const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

    if (!SENDGRID_API_KEY) {
      throw new Error("SENDGRID_API_KEY is not defined in environment variables.");
    }

    await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        personalizations: [{
        to: [{ email: to, name: to }],
        subject: subject
        }],
        from: { email: 'teambitforge+fraktal@gmail.com', name: 'Fraktal App' },
        reply_to: { email: 'teambitforge+fraktal@gmail.com', name: 'Fraktal Support' },
        content: [{
        type: 'text/html',
        value: html + footerHTML
        }]
    }),
    });

    console.log("Email sent successfully");
    return { success: true, message: "Email sent" };
  } catch (error: any) {
    console.error(" Email send failed:", error.response?.body || error.message);
    return { success: false, error: error.message };
  }
}

export async function emailActionsHandler(action: any){
    //TODO add fail/execution logging
    switch(action.event){
        case "send_email":
            await sendEmail(
                action.credentials.to,
                action.credentials.subject,
                action.credentials.html
            );
            break;

        default:
            console.warn(`Unknown Email action event: ${action.event}`);
            break;
    }
}

