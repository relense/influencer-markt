import { type Theme } from "next-auth";
import sgMail, { type MailDataRequired } from "@sendgrid/mail";
import { type SendVerificationRequestParams } from "next-auth/providers";

function customSendVerificationRequest(params: SendVerificationRequestParams) {
  const { identifier, url, provider, theme } = params;
  const { host, searchParams } = new URL(url);

  const callbackUrl = searchParams.get("callbackUrl");
  const callbackUrlSearchParams = new URLSearchParams(callbackUrl || "");
  const userLang = callbackUrlSearchParams.get("userLanguage") || "en";

  let subject = "Sign in to influencermarkt.com";

  if (userLang === "pt") {
    subject = "Login em influencermarkt.com";
  }

  sgMail.setApiKey(process.env.EMAIL_SMTP_KEY || "");

  const msg: MailDataRequired = {
    to: identifier,
    from: { email: provider.from, name: "Influencer Markt" },
    subject: subject,
    text: text({ url, host, userLang }),
    html: html({ url, theme, userLang }),
  };

  sgMail.send(msg).then(
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
function html(params: { url: string; theme: Theme; userLang: string }) {
  const { url, theme, userLang } = params;

  let title = "At Influencer Markt, your safety is of utmost importance to us.";
  let subTitle =
    "Every time you want to sign in, we will send a secure magic link to your email. This ensures that only you have access to your account.";
  let buttonTitle = "Magic Link";
  let disclaimer =
    "If you did not request this email you can safely ignore it.";

  if (userLang === "pt") {
    title =
      "Na Influencer Markt, a sua segurança é da máxima importância para nós.";
    subTitle =
      "Sempre que quiser entrar na sua conta, enviaremos um link mágico seguro para o seu email. Isto garante que apenas você tem acesso à sua conta.";
    buttonTitle = "Link Mágico";
    disclaimer = "Se não solicitou este email, pode ignorá-lo com segurança.";
  }

  const color = {
    background: "#f9f9f9",
    text: "#444",
    mainBackground: "#fff",
    buttonBackground: "#FD3A84",
    buttonBorder: "#FD3A84",
    buttonText: theme.buttonText || "#fff",
  };

  return `
  <body style="background: ${color.background};">
  <table
    width="100%"
    border="0"
    cellspacing="20"
    cellpadding="0"
    style="background: ${color.mainBackground}; max-width: 600px; margin: auto; border-radius: 10px;"
  >
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
      <td align="center" style="padding: 4px 0">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="font-size: 22px">
              <span
                >${title}</span
              >
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 4px 0">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="font-size: 22px">
              <span
                >${subTitle}</span
              >
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td
              align="center"
              style="border-radius: 5px"
              bgcolor="${color.buttonBackground}"
            >
              <a
                href="${url}"
                target="_blank"
                style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${color.buttonText}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${color.buttonBorder}; display: inline-block; font-weight: bold;"
                >${buttonTitle}</a
              >
            </td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td
        align="center"
        style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${color.text};"
      >
        ${disclaimer}
      </td>
    </tr>
  </table>
</body>

`;
}

/** Email Text body (fallback for email clients that don't render HTML, e.g. feature phones) */
function text({
  url,
  host,
  userLang,
}: {
  url: string;
  host: string;
  userLang: string;
}) {
  if (userLang === "pt") {
    return `Log in em ${host}\n${url}\n\n`;
  } else {
    return `Sign in to ${host}\n${url}\n\n`;
  }
}

export { customSendVerificationRequest };
