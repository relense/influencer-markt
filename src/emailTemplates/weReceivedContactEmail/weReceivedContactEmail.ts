import sgMail from "@sendgrid/mail";

function weReceivedContactEmail(params: {
  from: string;
  to: string;
  reason: string;
  name: string;
  email: string;
  message: string;
  language: string;
}) {
  const { from, to, reason, name, email, message } = params;

  sgMail.setApiKey(process.env.EMAIL_SMTP_KEY || "");

  let subject = "Obrigado pelo teu contacto";
  let text = "Novo contacto de ${name} com o email ${email}";
  let description =
    "Thank you for getting in touch with us. Your communication is vital to us no matter the case. We appreciate your engagement and want to assist you in the best way possible.";

  if (params.language === "pt") {
    subject = "Thank You for Your Contact";
    text = `New issue from ${name} with email ${email}`;
    description =
      "Agradecemos por te teres dado ao trabalho de falar connosco. A tua mensagem é importante para nós, seja qual for o assunto. Valorizamos a tua interação e queremos ajudar-te da melhor forma possível.";
  }

  sgMail
    .send({
      from: { email: from, name: "Influencer Markt" },
      to,
      subject: subject,
      text: text,
      html: html({ reason, name, email, message, description }),
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
  description: string;
}) {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
 <html
   data-editor-version="2"
   class="sg-campaigns"
   xmlns="http://www.w3.org/1999/xhtml"
 >
   <head>
     <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
     <meta
       name="viewport"
       content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1"
     />
     <!--[if !mso]><!-->
     <meta http-equiv="X-UA-Compatible" content="IE=Edge" />
     <!--<![endif]-->
     <!--[if (gte mso 9)|(IE)]>
       <xml>
         <o:OfficeDocumentSettings>
           <o:AllowPNG />
           <o:PixelsPerInch>96</o:PixelsPerInch>
         </o:OfficeDocumentSettings>
       </xml>
     <![endif]-->
     <!--[if (gte mso 9)|(IE)]>
       <style type="text/css">
         body {
           width: 600px;
           margin: 0 auto;
         }
         table {
           border-collapse: collapse;
         }
         table,
         td {
           mso-table-lspace: 0pt;
           mso-table-rspace: 0pt;
         }
         img {
           -ms-interpolation-mode: bicubic;
         }
       </style>
     <![endif]-->
     <style type="text/css">
       body,
       p,
       div {
         font-family: arial, helvetica, sans-serif;
         font-size: 14px;
       }
       body {
         color: #000000;
       }
       body a {
         color: #1188e6;
         text-decoration: none;
       }
       p {
         margin: 0;
         padding: 0;
       }
       table.wrapper {
         width: 100% !important;
         table-layout: fixed;
         -webkit-font-smoothing: antialiased;
         -webkit-text-size-adjust: 100%;
         -moz-text-size-adjust: 100%;
         -ms-text-size-adjust: 100%;
       }
       img.max-width {
         max-width: 100% !important;
       }
       .column.of-2 {
         width: 50%;
       }
       .column.of-3 {
         width: 33.333%;
       }
       .column.of-4 {
         width: 25%;
       }
       ul ul ul ul {
         list-style-type: disc !important;
       }
       ol ol {
         list-style-type: lower-roman !important;
       }
       ol ol ol {
         list-style-type: lower-latin !important;
       }
       ol ol ol ol {
         list-style-type: decimal !important;
       }
       @media screen and (max-width: 480px) {
         .preheader .rightColumnContent,
         .footer .rightColumnContent {
           text-align: left !important;
         }
         .preheader .rightColumnContent div,
         .preheader .rightColumnContent span,
         .footer .rightColumnContent div,
         .footer .rightColumnContent span {
           text-align: left !important;
         }
         .preheader .rightColumnContent,
         .preheader .leftColumnContent {
           font-size: 80% !important;
           padding: 5px 0;
         }
         table.wrapper-mobile {
           width: 100% !important;
           table-layout: fixed;
         }
         img.max-width {
           height: auto !important;
           max-width: 100% !important;
         }
         a.bulletproof-button {
           display: block !important;
           width: auto !important;
           font-size: 80%;
           padding-left: 0 !important;
           padding-right: 0 !important;
         }
         .columns {
           width: 100% !important;
         }
         .column {
           display: block !important;
           width: 100% !important;
           padding-left: 0 !important;
           padding-right: 0 !important;
           margin-left: 0 !important;
           margin-right: 0 !important;
         }
         .social-icon-column {
           display: inline-block !important;
         }
       }
     </style>
     <!--user entered Head Start-->
     <!--End Head user entered-->
   </head>
   <body>
     <center
       class="wrapper"
       data-link-color="#1188E6"
       data-body-style="font-size:14px; font-family:arial,helvetica,sans-serif; color:#000000; background-color:#FFFFFF;"
     >
       <div class="webkit">
         <table
           cellpadding="0"
           cellspacing="0"
           border="0"
           width="100%"
           class="wrapper"
           bgcolor="#FFFFFF"
         >
           <tr>
             <td valign="top" bgcolor="#FFFFFF" width="100%">
               <table
                 width="100%"
                 role="content-container"
                 class="outer"
                 align="center"
                 cellpadding="0"
                 cellspacing="0"
                 border="0"
               >
                 <tr>
                   <td width="100%">
                     <table
                       width="100%"
                       cellpadding="0"
                       cellspacing="0"
                       border="0"
                     >
                       <tr>
                         <td>
                           <!--[if mso]>
     <center>
     <table><tr><td width="600">
   <![endif]-->
                           <table
                             width="100%"
                             cellpadding="0"
                             cellspacing="0"
                             border="0"
                             style="width: 100%; max-width: 600px"
                             align="center"
                           >
                             <tr>
                               <td
                                 role="modules-container"
                                 style="
                                   padding: 0px 0px 0px 0px;
                                   color: #000000;
                                   text-align: left;
                                 "
                                 bgcolor="#FFFFFF"
                                 width="100%"
                                 align="left"
                               >
                                 <table
                                   class="module preheader preheader-hide"
                                   role="module"
                                   data-type="preheader"
                                   border="0"
                                   cellpadding="0"
                                   cellspacing="0"
                                   width="100%"
                                   style="
                                     display: none !important;
                                     mso-hide: all;
                                     visibility: hidden;
                                     opacity: 0;
                                     color: transparent;
                                     height: 0;
                                     width: 0;
                                   "
                                 >
                                   <tr>
                                     <td role="module-content">
                                       <p>no-reply</p>
                                     </td>
                                   </tr>
                                 </table>
                                 <table
                                   class="wrapper"
                                   role="module"
                                   data-type="image"
                                   border="0"
                                   cellpadding="0"
                                   cellspacing="0"
                                   width="100%"
                                   style="table-layout: fixed"
                                   data-muid="afcc58e2-651f-499d-81fe-c93c0339f2b8"
                                 >
                                   <tbody>
                                     <tr>
                                       <td
                                         style="
                                           font-size: 6px;
                                           line-height: 10px;
                                           padding: 0px 0px 0px 0px;
                                         "
                                         valign="top"
                                         align="center"
                                       >
                                         <img
                                           class="max-width"
                                           border="0"
                                           style="
                                             display: block;
                                             color: #000000;
                                             text-decoration: none;
                                             font-family: Helvetica, arial,
                                               sans-serif;
                                             font-size: 16px;
                                             max-width: 100% !important;
                                             width: 100%;
                                             height: auto !important;
                                           "
                                           width="600"
                                           alt=""
                                           data-proportionally-constrained="true"
                                           data-responsive="true"
                                           src="https://publicdevinfmarkt.blob.core.windows.net/inf-markt-assets/logo.png"
                                         />
                                       </td>
                                     </tr>
                                   </tbody>
                                 </table>
                                 <table
                                   class="module"
                                   role="module"
                                   data-type="text"
                                   border="0"
                                   cellpadding="0"
                                   cellspacing="0"
                                   width="100%"
                                   style="table-layout: fixed"
                                   data-muid="7c401961-741b-48cf-aa49-fe40e7e01338"
                                   data-mc-module-version="2019-10-22"
                                 >
                                   <tbody>
                                     <tr>
                                       <td
                                         style="
                                           padding: 18px 0px 18px 0px;
                                           line-height: 22px;
                                           text-align: inherit;
                                         "
                                         height="100%"
                                         valign="top"
                                         bgcolor=""
                                         role="module-content"
                                       >
                                         <div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                             "
                                           >
                                             Dear ${params.name},
                                           </div>
                                           <div></div>
                                         </div>
                                       </td>
                                     </tr>
                                   </tbody>
                                 </table>
                                 <table
                                   class="module"
                                   role="module"
                                   data-type="text"
                                   border="0"
                                   cellpadding="0"
                                   cellspacing="0"
                                   width="100%"
                                   style="table-layout: fixed"
                                   data-muid="4ca4cd7d-b645-4576-bba0-0a68d170e257"
                                   data-mc-module-version="2019-10-22"
                                 >
                                   <tbody>
                                     <tr>
                                       <td
                                         style="
                                           padding: 18px 0px 18px 0px;
                                           line-height: 22px;
                                           text-align: inherit;
                                         "
                                         height="100%"
                                         valign="top"
                                         bgcolor=""
                                         role="module-content"
                                       >
                                         <div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                             "
                                           >
                                             ${params.description}
                                           </div>
                                           <div></div>
                                         </div>
                                       </td>
                                     </tr>
                                   </tbody>
                                 </table>
                                 <table
                                   class="module"
                                   role="module"
                                   data-type="text"
                                   border="0"
                                   cellpadding="0"
                                   cellspacing="0"
                                   width="100%"
                                   style="table-layout: fixed"
                                   data-muid="14d090b3-591d-4b6d-a94f-1d79b4b9f026"
                                   data-mc-module-version="2019-10-22"
                                 >
                                   <tbody>
                                     <tr>
                                       <td
                                         style="
                                           padding: 18px 0px 18px 0px;
                                           line-height: 22px;
                                           text-align: inherit;
                                         "
                                         height="100%"
                                         valign="top"
                                         bgcolor=""
                                         role="module-content"
                                       >
                                         <div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                             "
                                           >
                                             <strong
                                               >Here is the information you
                                               shared:</strong
                                             >
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                             "
                                           >
                                             <br />
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                               margin-left: 0px;
                                             "
                                           >
                                             <span
                                               style="
                                                 box-sizing: border-box;
                                                 padding-top: 0px;
                                                 padding-right: 0px;
                                                 padding-bottom: 0px;
                                                 padding-left: 0px;
                                                 margin-top: 0px;
                                                 margin-right: 0px;
                                                 margin-bottom: 0px;
                                                 margin-left: 0px;
                                                 font-style: inherit;
                                                 font-variant-ligatures: inherit;
                                                 font-variant-caps: inherit;
                                                 font-variant-numeric: inherit;
                                                 font-variant-east-asian: inherit;
                                                 font-variant-alternates: inherit;
                                                 font-weight: bold;
                                                 font-stretch: inherit;
                                                 line-height: inherit;
                                                 font-family: inherit;
                                                 font-optical-sizing: inherit;
                                                 font-kerning: inherit;
                                                 font-feature-settings: inherit;
                                                 font-variation-settings: inherit;
                                                 font-size: 14px;
                                                 vertical-align: baseline;
                                                 border-top-width: 0px;
                                                 border-right-width: 0px;
                                                 border-bottom-width: 0px;
                                                 border-left-width: 0px;
                                                 border-top-style: initial;
                                                 border-right-style: initial;
                                                 border-bottom-style: initial;
                                                 border-left-style: initial;
                                                 border-top-color: initial;
                                                 border-right-color: initial;
                                                 border-bottom-color: initial;
                                                 border-left-color: initial;
                                                 border-image-source: initial;
                                                 border-image-slice: initial;
                                                 border-image-width: initial;
                                                 border-image-outset: initial;
                                                 border-image-repeat: initial;
                                                 color: #000000;
                                                 letter-spacing: normal;
                                                 orphans: 2;
                                                 text-align: start;
                                                 text-indent: 0px;
                                                 text-transform: none;
                                                 widows: 2;
                                                 word-spacing: 0px;
                                                 -webkit-text-stroke-width: 0px;
                                                 white-space-collapse: preserve;
                                                 text-wrap: wrap;
                                                 background-color: rgb(
                                                   255,
                                                   255,
                                                   255
                                                 );
                                                 text-decoration-thickness: initial;
                                                 text-decoration-style: initial;
                                                 text-decoration-color: initial;
                                               "
                                               >Your Name:&nbsp;</span
                                             >
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                               margin-left: 0px;
                                             "
                                           >
                                             <span
                                               style="
                                                 box-sizing: border-box;
                                                 padding-top: 0px;
                                                 padding-right: 0px;
                                                 padding-bottom: 0px;
                                                 padding-left: 0px;
                                                 margin-top: 0px;
                                                 margin-right: 0px;
                                                 margin-bottom: 0px;
                                                 margin-left: 0px;
                                                 font-style: inherit;
                                                 font-variant-ligatures: inherit;
                                                 font-variant-caps: inherit;
                                                 font-variant-numeric: inherit;
                                                 font-variant-east-asian: inherit;
                                                 font-variant-alternates: inherit;
                                                 font-weight: inherit;
                                                 font-stretch: inherit;
                                                 line-height: inherit;
                                                 font-family: inherit;
                                                 font-optical-sizing: inherit;
                                                 font-kerning: inherit;
                                                 font-feature-settings: inherit;
                                                 font-variation-settings: inherit;
                                                 font-size: 14px;
                                                 vertical-align: baseline;
                                                 border-top-width: 0px;
                                                 border-right-width: 0px;
                                                 border-bottom-width: 0px;
                                                 border-left-width: 0px;
                                                 border-top-style: initial;
                                                 border-right-style: initial;
                                                 border-bottom-style: initial;
                                                 border-left-style: initial;
                                                 border-top-color: initial;
                                                 border-right-color: initial;
                                                 border-bottom-color: initial;
                                                 border-left-color: initial;
                                                 border-image-source: initial;
                                                 border-image-slice: initial;
                                                 border-image-width: initial;
                                                 border-image-outset: initial;
                                                 border-image-repeat: initial;
                                                 color: #000000;
                                                 letter-spacing: normal;
                                                 orphans: 2;
                                                 text-align: start;
                                                 text-indent: 0px;
                                                 text-transform: none;
                                                 widows: 2;
                                                 word-spacing: 0px;
                                                 -webkit-text-stroke-width: 0px;
                                                 white-space-collapse: preserve;
                                                 text-wrap: wrap;
                                                 background-color: rgb(
                                                   255,
                                                   255,
                                                   255
                                                 );
                                                 text-decoration-thickness: initial;
                                                 text-decoration-style: initial;
                                                 text-decoration-color: initial;
                                               "
                                               >${params.name}</span
                                             >
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                               margin-left: 0px;
                                             "
                                           >
                                             <br />
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                               margin-left: 0px;
                                             "
                                           >
                                             <span
                                               style="
                                                 box-sizing: border-box;
                                                 padding-top: 0px;
                                                 padding-right: 0px;
                                                 padding-bottom: 0px;
                                                 padding-left: 0px;
                                                 margin-top: 0px;
                                                 margin-right: 0px;
                                                 margin-bottom: 0px;
                                                 margin-left: 0px;
                                                 font-style: inherit;
                                                 font-variant-ligatures: inherit;
                                                 font-variant-caps: inherit;
                                                 font-variant-numeric: inherit;
                                                 font-variant-east-asian: inherit;
                                                 font-variant-alternates: inherit;
                                                 font-weight: bold;
                                                 font-stretch: inherit;
                                                 line-height: inherit;
                                                 font-family: inherit;
                                                 font-optical-sizing: inherit;
                                                 font-kerning: inherit;
                                                 font-feature-settings: inherit;
                                                 font-variation-settings: inherit;
                                                 font-size: 14px;
                                                 vertical-align: baseline;
                                                 border-top-width: 0px;
                                                 border-right-width: 0px;
                                                 border-bottom-width: 0px;
                                                 border-left-width: 0px;
                                                 border-top-style: initial;
                                                 border-right-style: initial;
                                                 border-bottom-style: initial;
                                                 border-left-style: initial;
                                                 border-top-color: initial;
                                                 border-right-color: initial;
                                                 border-bottom-color: initial;
                                                 border-left-color: initial;
                                                 border-image-source: initial;
                                                 border-image-slice: initial;
                                                 border-image-width: initial;
                                                 border-image-outset: initial;
                                                 border-image-repeat: initial;
                                                 color: #000000;
                                                 letter-spacing: normal;
                                                 orphans: 2;
                                                 text-align: start;
                                                 text-indent: 0px;
                                                 text-transform: none;
                                                 widows: 2;
                                                 word-spacing: 0px;
                                                 -webkit-text-stroke-width: 0px;
                                                 white-space-collapse: preserve;
                                                 text-wrap: wrap;
                                                 background-color: rgb(
                                                   255,
                                                   255,
                                                   255
                                                 );
                                                 text-decoration-thickness: initial;
                                                 text-decoration-style: initial;
                                                 text-decoration-color: initial;
                                               "
                                               >Email Address:&nbsp;</span
                                             >
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                               margin-left: 0px;
                                             "
                                           >
                                             <span
                                               style="
                                                 box-sizing: border-box;
                                                 padding-top: 0px;
                                                 padding-right: 0px;
                                                 padding-bottom: 0px;
                                                 padding-left: 0px;
                                                 margin-top: 0px;
                                                 margin-right: 0px;
                                                 margin-bottom: 0px;
                                                 margin-left: 0px;
                                                 font-style: inherit;
                                                 font-variant-ligatures: inherit;
                                                 font-variant-caps: inherit;
                                                 font-variant-numeric: inherit;
                                                 font-variant-east-asian: inherit;
                                                 font-variant-alternates: inherit;
                                                 font-weight: inherit;
                                                 font-stretch: inherit;
                                                 line-height: inherit;
                                                 font-family: inherit;
                                                 font-optical-sizing: inherit;
                                                 font-kerning: inherit;
                                                 font-feature-settings: inherit;
                                                 font-variation-settings: inherit;
                                                 font-size: 14px;
                                                 vertical-align: baseline;
                                                 border-top-width: 0px;
                                                 border-right-width: 0px;
                                                 border-bottom-width: 0px;
                                                 border-left-width: 0px;
                                                 border-top-style: initial;
                                                 border-right-style: initial;
                                                 border-bottom-style: initial;
                                                 border-left-style: initial;
                                                 border-top-color: initial;
                                                 border-right-color: initial;
                                                 border-bottom-color: initial;
                                                 border-left-color: initial;
                                                 border-image-source: initial;
                                                 border-image-slice: initial;
                                                 border-image-width: initial;
                                                 border-image-outset: initial;
                                                 border-image-repeat: initial;
                                                 color: #000000;
                                                 letter-spacing: normal;
                                                 orphans: 2;
                                                 text-align: start;
                                                 text-indent: 0px;
                                                 text-transform: none;
                                                 widows: 2;
                                                 word-spacing: 0px;
                                                 -webkit-text-stroke-width: 0px;
                                                 white-space-collapse: preserve;
                                                 text-wrap: wrap;
                                                 background-color: rgb(
                                                   255,
                                                   255,
                                                   255
                                                 );
                                                 text-decoration-thickness: initial;
                                                 text-decoration-style: initial;
                                                 text-decoration-color: initial;
                                               "
                                               >${params.email}</span
                                             >
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: start;
                                             "
                                           >
                                             <br />
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                               margin-left: 0px;
                                             "
                                           >
                                             <span
                                               style="
                                                 box-sizing: border-box;
                                                 padding-top: 0px;
                                                 padding-right: 0px;
                                                 padding-bottom: 0px;
                                                 padding-left: 0px;
                                                 margin-top: 0px;
                                                 margin-right: 0px;
                                                 margin-bottom: 0px;
                                                 margin-left: 0px;
                                                 font-style: inherit;
                                                 font-variant-ligatures: inherit;
                                                 font-variant-caps: inherit;
                                                 font-variant-numeric: inherit;
                                                 font-variant-east-asian: inherit;
                                                 font-variant-alternates: inherit;
                                                 font-weight: bold;
                                                 font-stretch: inherit;
                                                 line-height: inherit;
                                                 font-family: inherit;
                                                 font-optical-sizing: inherit;
                                                 font-kerning: inherit;
                                                 font-feature-settings: inherit;
                                                 font-variation-settings: inherit;
                                                 font-size: 14px;
                                                 vertical-align: baseline;
                                                 border-top-width: 0px;
                                                 border-right-width: 0px;
                                                 border-bottom-width: 0px;
                                                 border-left-width: 0px;
                                                 border-top-style: initial;
                                                 border-right-style: initial;
                                                 border-bottom-style: initial;
                                                 border-left-style: initial;
                                                 border-top-color: initial;
                                                 border-right-color: initial;
                                                 border-bottom-color: initial;
                                                 border-left-color: initial;
                                                 border-image-source: initial;
                                                 border-image-slice: initial;
                                                 border-image-width: initial;
                                                 border-image-outset: initial;
                                                 border-image-repeat: initial;
                                                 color: #000000;
                                                 letter-spacing: normal;
                                                 orphans: 2;
                                                 text-align: start;
                                                 text-indent: 0px;
                                                 text-transform: none;
                                                 widows: 2;
                                                 word-spacing: 0px;
                                                 -webkit-text-stroke-width: 0px;
                                                 white-space-collapse: preserve;
                                                 text-wrap: wrap;
                                                 background-color: rgb(
                                                   255,
                                                   255,
                                                   255
                                                 );
                                                 text-decoration-thickness: initial;
                                                 text-decoration-style: initial;
                                                 text-decoration-color: initial;
                                               "
                                               >Reason Type:&nbsp;</span
                                             >
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                               margin-left: 0px;
                                             "
                                           >
                                             <span
                                               style="
                                                 box-sizing: border-box;
                                                 padding-top: 0px;
                                                 padding-right: 0px;
                                                 padding-bottom: 0px;
                                                 padding-left: 0px;
                                                 margin-top: 0px;
                                                 margin-right: 0px;
                                                 margin-bottom: 0px;
                                                 margin-left: 0px;
                                                 font-style: inherit;
                                                 font-variant-ligatures: inherit;
                                                 font-variant-caps: inherit;
                                                 font-variant-numeric: inherit;
                                                 font-variant-east-asian: inherit;
                                                 font-variant-alternates: inherit;
                                                 font-weight: inherit;
                                                 font-stretch: inherit;
                                                 line-height: inherit;
                                                 font-family: inherit;
                                                 font-optical-sizing: inherit;
                                                 font-kerning: inherit;
                                                 font-feature-settings: inherit;
                                                 font-variation-settings: inherit;
                                                 font-size: 14px;
                                                 vertical-align: baseline;
                                                 border-top-width: 0px;
                                                 border-right-width: 0px;
                                                 border-bottom-width: 0px;
                                                 border-left-width: 0px;
                                                 border-top-style: initial;
                                                 border-right-style: initial;
                                                 border-bottom-style: initial;
                                                 border-left-style: initial;
                                                 border-top-color: initial;
                                                 border-right-color: initial;
                                                 border-bottom-color: initial;
                                                 border-left-color: initial;
                                                 border-image-source: initial;
                                                 border-image-slice: initial;
                                                 border-image-width: initial;
                                                 border-image-outset: initial;
                                                 border-image-repeat: initial;
                                                 color: #000000;
                                                 letter-spacing: normal;
                                                 orphans: 2;
                                                 text-align: start;
                                                 text-indent: 0px;
                                                 text-transform: none;
                                                 widows: 2;
                                                 word-spacing: 0px;
                                                 -webkit-text-stroke-width: 0px;
                                                 white-space-collapse: preserve;
                                                 text-wrap: wrap;
                                                 background-color: rgb(
                                                   255,
                                                   255,
                                                   255
                                                 );
                                                 text-decoration-thickness: initial;
                                                 text-decoration-style: initial;
                                                 text-decoration-color: initial;
                                               "
                                               >${params.reason}</span
                                             >
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: start;
                                             "
                                           >
                                             <br />
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                               margin-left: 0px;
                                             "
                                           >
                                             <span
                                               style="
                                                 box-sizing: border-box;
                                                 padding-top: 0px;
                                                 padding-right: 0px;
                                                 padding-bottom: 0px;
                                                 padding-left: 0px;
                                                 margin-top: 0px;
                                                 margin-right: 0px;
                                                 margin-bottom: 0px;
                                                 margin-left: 0px;
                                                 font-style: inherit;
                                                 font-variant-ligatures: inherit;
                                                 font-variant-caps: inherit;
                                                 font-variant-numeric: inherit;
                                                 font-variant-east-asian: inherit;
                                                 font-variant-alternates: inherit;
                                                 font-weight: bold;
                                                 font-stretch: inherit;
                                                 line-height: inherit;
                                                 font-family: inherit;
                                                 font-optical-sizing: inherit;
                                                 font-kerning: inherit;
                                                 font-feature-settings: inherit;
                                                 font-variation-settings: inherit;
                                                 font-size: 14px;
                                                 vertical-align: baseline;
                                                 border-top-width: 0px;
                                                 border-right-width: 0px;
                                                 border-bottom-width: 0px;
                                                 border-left-width: 0px;
                                                 border-top-style: initial;
                                                 border-right-style: initial;
                                                 border-bottom-style: initial;
                                                 border-left-style: initial;
                                                 border-top-color: initial;
                                                 border-right-color: initial;
                                                 border-bottom-color: initial;
                                                 border-left-color: initial;
                                                 border-image-source: initial;
                                                 border-image-slice: initial;
                                                 border-image-width: initial;
                                                 border-image-outset: initial;
                                                 border-image-repeat: initial;
                                                 color: #000000;
                                                 letter-spacing: normal;
                                                 orphans: 2;
                                                 text-align: start;
                                                 text-indent: 0px;
                                                 text-transform: none;
                                                 widows: 2;
                                                 word-spacing: 0px;
                                                 -webkit-text-stroke-width: 0px;
                                                 white-space-collapse: preserve;
                                                 text-wrap: wrap;
                                                 background-color: rgb(
                                                   255,
                                                   255,
                                                   255
                                                 );
                                                 text-decoration-thickness: initial;
                                                 text-decoration-style: initial;
                                                 text-decoration-color: initial;
                                               "
                                               >Message:&nbsp;</span
                                             >
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                               margin-left: 0px;
                                             "
                                           >
                                             <span
                                               style="
                                                 box-sizing: border-box;
                                                 padding-top: 0px;
                                                 padding-right: 0px;
                                                 padding-bottom: 0px;
                                                 padding-left: 0px;
                                                 margin-top: 0px;
                                                 margin-right: 0px;
                                                 margin-bottom: 0px;
                                                 margin-left: 0px;
                                                 font-style: inherit;
                                                 font-variant-ligatures: inherit;
                                                 font-variant-caps: inherit;
                                                 font-variant-numeric: inherit;
                                                 font-variant-east-asian: inherit;
                                                 font-variant-alternates: inherit;
                                                 font-weight: inherit;
                                                 font-stretch: inherit;
                                                 line-height: inherit;
                                                 font-family: inherit;
                                                 font-optical-sizing: inherit;
                                                 font-kerning: inherit;
                                                 font-feature-settings: inherit;
                                                 font-variation-settings: inherit;
                                                 font-size: 14px;
                                                 vertical-align: baseline;
                                                 border-top-width: 0px;
                                                 border-right-width: 0px;
                                                 border-bottom-width: 0px;
                                                 border-left-width: 0px;
                                                 border-top-style: initial;
                                                 border-right-style: initial;
                                                 border-bottom-style: initial;
                                                 border-left-style: initial;
                                                 border-top-color: initial;
                                                 border-right-color: initial;
                                                 border-bottom-color: initial;
                                                 border-left-color: initial;
                                                 border-image-source: initial;
                                                 border-image-slice: initial;
                                                 border-image-width: initial;
                                                 border-image-outset: initial;
                                                 border-image-repeat: initial;
                                                 color: #000000;
                                                 letter-spacing: normal;
                                                 orphans: 2;
                                                 text-align: start;
                                                 text-indent: 0px;
                                                 text-transform: none;
                                                 widows: 2;
                                                 word-spacing: 0px;
                                                 -webkit-text-stroke-width: 0px;
                                                 white-space-collapse: preserve;
                                                 text-wrap: wrap;
                                                 background-color: rgb(
                                                   255,
                                                   255,
                                                   255
                                                 );
                                                 text-decoration-thickness: initial;
                                                 text-decoration-style: initial;
                                                 text-decoration-color: initial;
                                               "
                                               >${params.message}</span
                                             >
                                           </div>
                                           <div></div>
                                         </div>
                                       </td>
                                     </tr>
                                   </tbody>
                                 </table>
                                 <table
                                   class="module"
                                   role="module"
                                   data-type="text"
                                   border="0"
                                   cellpadding="0"
                                   cellspacing="0"
                                   width="100%"
                                   style="table-layout: fixed"
                                   data-muid="2614d062-6b9c-4584-ac99-9f00158c01f8"
                                   data-mc-module-version="2019-10-22"
                                 >
                                   <tbody>
                                     <tr>
                                       <td
                                         style="
                                           padding: 18px 0px 18px 0px;
                                           line-height: 22px;
                                           text-align: inherit;
                                         "
                                         height="100%"
                                         valign="top"
                                         bgcolor=""
                                         role="module-content"
                                       >
                                         <div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                             "
                                           >
                                             <span
                                               style="
                                                 color: #000000;
                                                 font-family: arial, helvetica,
                                                   sans-serif;
                                                 font-size: 14px;
                                                 font-style: normal;
                                                 font-variant-ligatures: normal;
                                                 font-variant-caps: normal;
                                                 font-weight: 400;
                                                 letter-spacing: normal;
                                                 orphans: 2;
                                                 text-align: start;
                                                 text-indent: 0px;
                                                 text-transform: none;
                                                 widows: 2;
                                                 word-spacing: 0px;
                                                 -webkit-text-stroke-width: 0px;
                                                 white-space-collapse: preserve;
                                                 text-wrap: wrap;
                                                 background-color: rgb(
                                                   255,
                                                   255,
                                                   255
                                                 );
                                                 text-decoration-thickness: initial;
                                                 text-decoration-style: initial;
                                                 text-decoration-color: initial;
                                                 float: none;
                                                 display: inline;
                                               "
                                               >Your input is incredibly valuable
                                               to us, and we are committed to
                                               addressing your concerns and
                                               inquiries promptly.</span
                                             >
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                             "
                                           >
                                             <br />
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                             "
                                           >
                                             If you have any additional details
                                             to share or need further assistance,
                                             please don't hesitate to reach out
                                             to us at
                                             <span
                                               style="
                                                 color: #000000;
                                                 font-family: arial, helvetica,
                                                   sans-serif;
                                                 font-size: 14px;
                                                 font-style: normal;
                                                 font-variant-ligatures: normal;
                                                 font-variant-caps: normal;
                                                 font-weight: 400;
                                                 letter-spacing: normal;
                                                 orphans: 2;
                                                 text-align: start;
                                                 text-indent: 0px;
                                                 text-transform: none;
                                                 widows: 2;
                                                 word-spacing: 0px;
                                                 -webkit-text-stroke-width: 0px;
                                                 white-space-collapse: preserve;
                                                 text-wrap: wrap;
                                                 background-color: rgb(
                                                   255,
                                                   255,
                                                   255
                                                 );
                                                 text-decoration-thickness: initial;
                                                 text-decoration-style: initial;
                                                 text-decoration-color: initial;
                                                 float: none;
                                                 display: inline;
                                               "
                                               >info@influencermarkt.com</span
                                             >.
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                             "
                                           >
                                             <br />
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                             "
                                           >
                                             <span
                                               style="
                                                 color: #000000;
                                                 font-family: arial, helvetica,
                                                   sans-serif;
                                                 font-size: 14px;
                                                 font-style: normal;
                                                 font-variant-ligatures: normal;
                                                 font-variant-caps: normal;
                                                 font-weight: 400;
                                                 letter-spacing: normal;
                                                 orphans: 2;
                                                 text-align: start;
                                                 text-indent: 0px;
                                                 text-transform: none;
                                                 widows: 2;
                                                 word-spacing: 0px;
                                                 -webkit-text-stroke-width: 0px;
                                                 white-space-collapse: preserve;
                                                 text-wrap: wrap;
                                                 background-color: rgb(
                                                   255,
                                                   255,
                                                   255
                                                 );
                                                 text-decoration-thickness: initial;
                                                 text-decoration-style: initial;
                                                 text-decoration-color: initial;
                                                 float: none;
                                                 display: inline;
                                               "
                                               >Thank you for choosing us, and
                                               rest assured, we are dedicated to
                                               ensuring your satisfaction and
                                               providing the support you
                                               require.</span
                                             >
                                           </div>
                                           <div></div>
                                         </div>
                                       </td>
                                     </tr>
                                   </tbody>
                                 </table>
                                 <table
                                   class="module"
                                   role="module"
                                   data-type="text"
                                   border="0"
                                   cellpadding="0"
                                   cellspacing="0"
                                   width="100%"
                                   style="table-layout: fixed"
                                   data-muid="52b6811b-6b2b-41c1-b6f9-0295070ff71f"
                                   data-mc-module-version="2019-10-22"
                                 >
                                   <tbody>
                                     <tr>
                                       <td
                                         style="
                                           padding: 18px 0px 18px 0px;
                                           line-height: 22px;
                                           text-align: inherit;
                                         "
                                         height="100%"
                                         valign="top"
                                         bgcolor=""
                                         role="module-content"
                                       >
                                         <div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                             "
                                           >
                                             Best Regards,
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                             "
                                           >
                                             Influencer Martk,
                                           </div>
                                           <div
                                             style="
                                               font-family: inherit;
                                               text-align: inherit;
                                             "
                                           >
                                             info@influencermarkt.com
                                           </div>
                                           <div></div>
                                         </div>
                                       </td>
                                     </tr>
                                   </tbody>
                                 </table>
                               </td>
                             </tr>
                           </table>
                           <!--[if mso]>
                                   </td>
                                 </tr>
                               </table>
                             </center>
                             <![endif]-->
                         </td>
                       </tr>
                     </table>
                   </td>
                 </tr>
               </table>
             </td>
           </tr>
         </table>
       </div>
     </center>
   </body>
 </html>
 `;
}

export { weReceivedContactEmail };
