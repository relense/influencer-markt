import sgMail from "@sendgrid/mail";

function toInfluencerOrderOnHoldEmail(params: {
  from: string;
  to: string;
  orderId: string;
  language: string;
  buyerName: string;
}) {
  const { orderId, language, from, to, buyerName } = params;

  let title = `The order with ref:${orderId} is on hold`;
  let buttonTitle = "View Order";
  let subject = `The order with ref:${orderId} is on hold`;
  let description = `Unfortunately, the delivery deadline for ${buyerName} has not been met. The order is currently on hold, awaiting the buyer's decision.`;

  if (language === "pt") {
    title = `O Pedido com ref:${orderId} está suspenso`;
    buttonTitle = "Ver Pedido";
    subject = `O pedido com a ref:${orderId} está suspenso`;
    description = `Lamentávelmente, o prazo de entrega para ${buyerName} não foi cumprido. O pedido encontra-se atualmente suspenso, aguardando a decisão do comprador.`;
  }

  sgMail.setApiKey(process.env.EMAIL_SMTP_KEY || "");

  sgMail
    .send({
      from: { email: from, name: "Influencer Markt" },
      to,
      subject,
      text: text({ title }),
      html: html({
        title,
        orderId: orderId.toString(),
        buttonTitle,
        description,
      }),
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
  title: string;
  orderId: string;
  buttonTitle: string;
  description: string;
}) {
  const { title, orderId, buttonTitle, description } = params;

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>To Influencer Order is Oh Hold</title>
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
          background-color: #64ea9e;
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
        .button {
          background: #64ea9e;
          border-radius: 4px;
          text-decoration: none;
          color: #fff;
          padding: 12px 20px;
          font-weight: bold;
        }
        .title {
          font-family: "Poppins", sans-serif;
          font-size: 22px;
          font-weight: 600;
          padding-bottom: 30px;
        }
        .description {
          padding-bottom: 30px;
        }
      </style>
    </head>
    <body>
      <center class="wrapper">
        <table class="main" width="100%">
          <!-- BORDER -->
          <tr>
            <td height="8" style="background-color: #d9d9d9"></td>
          </tr>
  
          <!-- LOGO & SOCIAL MEDIA SECTION -->
          <tr>
            <td style="padding: 0">
              <table width="100%">
                <tr>
                  <td style="padding: 15px">
                    <a
                      href="https://influencermarkt.com"
                      style="
                        text-decoration: none;
                        color: #fd3a84;
                        font-family: Lobster;
                      "
                      ><img
                        src="https://prodinfmarkt.blob.core.windows.net/inf-markt-assets/logo.png"
                        alt="logo"
                        width="600"
                    /></a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
  
          <!-- BORDER -->
          <tr>
            <td height="2" style="background-color: #d9d9d9"></td>
          </tr>
          <!-- INFLUENCER DETAILS -->
          <tr>
            <td style="padding: 20px 15px 50px">
              <table width="100%">
                <tr>
                  <td style="display: inline-block; vertical-align: top">
                    <h3 class="title">${title}</h3>
  
                    <p class="description">${description}</p>
  
                    <a
                      href="https://influencermarkt.com/sales/${orderId}"
                      class="button"
                      ><span style="color: #fff">${buttonTitle}</span></a
                    >
                  </td>
                </tr>
              </table>
            </td>
          </tr>
  
          <!-- BORDER -->
          <tr>
            <td height="2" style="background-color: #d9d9d9"></td>
          </tr>
  
          <!-- FOOTER SECTION -->
          <tr>
            <td style="padding: 20px 15px 20px">© Influencer Markt inc. 2023</td>
          </tr>
  
          <!-- END BORDER -->
          <tr>
            <td height="8" style="background-color: #d9d9d9"></td>
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

export { toInfluencerOrderOnHoldEmail };
