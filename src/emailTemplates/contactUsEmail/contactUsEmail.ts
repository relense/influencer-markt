import sgMail from "@sendgrid/mail";

function contactUsEmail(params: {
  from: string;
  to: string;
  reason: string;
  name: string;
  email: string;
  message: string;
  messageId: string;
}) {
  const { from, to, reason, name, email, message, messageId } = params;

  sgMail.setApiKey(process.env.EMAIL_SMTP_KEY || "");

  sgMail
    .send({
      from: { email: from, name: "Influencer Markt" },
      to,
      subject: `${messageId} - ${reason}`,
      text: `New issue from ${name} with email ${email}`,
      html: html({ reason, name, email, message }),
    })
    .then(
      () => {
        console.log("success");
      },
      (error) => {
        console.error(error);
      }
    );
}

/**
 * Email HTML body
 * Insert invisible space into domains from being turned into a hyperlink by email
 * clients like Outlook and Apple mail, as this is confusing because it seems
 * like they are supposed to click on it to sign in.
 *
 * @note We don't add the email address to avoid needing to escape it, if you do, remember to sanitize it!
 */
function html(params: {
  reason: string;
  name: string;
  email: string;
  message: string;
}) {
  return `<!DOCTYPE html>
 <html>
   <head>
     <title></title>
     <meta charset="utf-8" />
     <meta name="viewport" content="width=device-width, initial-scale=1" />
     <meta http-equiv="X-UA-Compatible" content="IE=edge" />
     <style type="text/css">
       body,
       table,
       td,
       a {
         -webkit-text-size-adjust: 100%;
         -ms-text-size-adjust: 100%;
       }
       table {
         border-collapse: collapse !important;
       }
       body {
         height: 100% !important;
         margin: 0 !important;
         padding: 0 !important;
         width: 100% !important;
       }
       @media screen and (max-width: 525px) {
         .wrapper {
           width: 100% !important;
           max-width: 100% !important;
         }
         .responsive-table {
           width: 100% !important;
         }
         .padding {
           padding: 10px 5% 15px 5% !important;
         }
         .section-padding {
           padding: 0 15px 50px 15px !important;
         }
       }
       .form-container {
         margin-bottom: 24px;
         padding: 20px;
         border: 1px dashed #ccc;
       }
       .form-heading {
         color: #2a2a2a;
         font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
         font-weight: 400;
         text-align: left;
         line-height: 20px;
         font-size: 18px;
         margin: 0 0 8px;
         padding: 0;
       }
       .form-answer {
         color: #2a2a2a;
         font-family: "Helvetica Neue", "Helvetica", "Arial", sans-serif;
         font-weight: 300;
         text-align: left;
         line-height: 20px;
         font-size: 16px;
         margin: 0 0 24px;
         padding: 0;
       }
       div[style*="margin: 16px 0;"] {
         margin: 0 !important;
       }
     </style>
   </head>
   <body style="margin: 0 !important; padding: 0 !important; background: #fff">
     <div
       style="
         display: none;
         font-size: 1px;
         color: #fefefe;
         line-height: 1px;
         max-height: 0px;
         max-width: 0px;
         opacity: 0;
         overflow: hidden;
       "
     ></div>
     <table border="0" cellpadding="0" cellspacing="0" width="100%">
       <tr>
         <td
           bgcolor="#ffffff"
           align="center"
           style="padding: 10px 15px 30px 15px"
           class="section-padding"
         >
           <table
             border="0"
             cellpadding="0"
             cellspacing="0"
             width="100%"
             style="max-width: 500px"
             class="responsive-table"
           >
             <tr>
               <td>
                 <table width="100%" border="0" cellspacing="0" cellpadding="0">
                   <tr>
                     <td>
                       <table
                         width="100%"
                         border="0"
                         cellspacing="0"
                         cellpadding="0"
                       >
                         <tr>
                           <td
                             style="
                               padding: 0 0 0 0;
                               font-size: 16px;
                               line-height: 25px;
                               color: #232323;
                             "
                             class="padding message-content"
                           >
                             <h2>New Issue</h2>
                             <div class="form-container">
                               <div>
                                 <h3 class="form-heading" align="left">
                                   Reason:
                                 </h3>
                                 <p class="form-answer" align="left">
                                   ${params.reason}
                                 </p>
                               </div>
                               <div>
                                 <h3 class="form-heading" align="left">Name:</h3>
                                 <p class="form-answer" align="left">
                                   ${params.name}
                                 </p>
                               </div>
                               <div>
                                 <h3 class="form-heading" align="left">
                                   Email:
                                 </h3>
                                 <p class="form-answer" align="left">
                                   ${params.email}
                                 </p>
                               </div>
                               <div>
                                 <h3 class="form-heading" align="left">
                                   Message:
                                 </h3>
                                 <p class="form-answer" align="left">
                                   ${params.message}
                                 </p>
                               </div>
                             </div>
                           </td>
                         </tr>
                       </table>
                     </td>
                   </tr>
                 </table>
               </td>
             </tr>
           </table>
         </td>
       </tr>
     </table>
   </body>
 </html>
 `;
}

export { contactUsEmail };
