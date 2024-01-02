import sgMail from "@sendgrid/mail";
import { env } from "../../env.mjs";

function influencerAddSocialMedia(params: {
  from: string;
  to: string;
  influencerUsername: string;
  language: string;
}) {
  const { language, from, to, influencerUsername } = params;

  let title = "Complete your profile so brands can find you";
  let subject = `Complete your profile so brands can find you`;
  let url = `${env.NEXT_PUBLIC_BASE_URL}/${influencerUsername}`;
  let imageUrl =
    "https://prodinfmarkt.blob.core.windows.net/inf-markt-assets/influencerAddSocialEN.png";

  if (language === "pt") {
    title = "Completa o teu perfil para as marcas te conseguirem encontrar";
    subject = `Completa o teu perfil para as marcas te conseguirem encontrar`;
    url = `${env.NEXT_PUBLIC_BASE_URL}/pt/${influencerUsername}`;
    imageUrl =
      "https://prodinfmarkt.blob.core.windows.net/inf-markt-assets/influencerAddSocialPT.png";
  }

  sgMail.setApiKey(process.env.EMAIL_SMTP_KEY || "");

  sgMail
    .send({
      from: { email: from, name: "Influencer Markt" },
      to,
      subject,
      text: text({ title }),
      html: html({ url, imageUrl }),
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
function html(params: { url: string; imageUrl: string }) {
  const { url, imageUrl } = params;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Influencers complete profile</title>
      <style type="text/css">
        @import url("https://fonts.googleapis.com/css2?family=Lobster&family=Playfair+Display&family=Poppins:wght@400;500;600;700;800&family=Roboto:wght@500&display=swap");
        body {
          margin: 0;
        }
        table {
          border-spacing: 0;
        }
        td {
          padding: 0;
        }
        img {
          border: 0;
        }
        .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #fbf3ef;
          padding-bottom: 60px;
        }
        .main {
          width: 100%;
          max-width: 600px;
          background-color: #fff;
          font-family: sans-serif;
          box-shadow: 0 0 25px rgba(0, 0, 0, 0.15);
          text-align: center;
        }
      </style>
    </head>
    <body>
      <center class="wrapper">
        <table class="main" width="100%">
          <!-- BORDER -->
          <tr>
            <a
              href="${url}"
              style="text-decoration: none; color: #fd3a84; font-family: Lobster"
              ><img
                src="${imageUrl}"
                alt="Complete your profile Image"
            /></a>
          </tr>
        </table>
        <!-- End Main Class -->
      </center>
      <!-- End Wrapper -->
    </body>
  </html>
  
  `;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({ title }: { title: string }) {
  return `${title}`;
}

export { influencerAddSocialMedia };
