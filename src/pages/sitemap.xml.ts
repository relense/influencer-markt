import { type GetServerSideProps } from "next";
import { generateSSGHelper } from "../server/helper/ssgHelper";

const generateSiteMap = (usernames: string[]) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://www.influencermarkt.com</loc>
     </url>
     <url>
       <loc>https://www.influencermarkt.com/faq</loc>
     </url>
     <url>
        <loc>https://www.influencermarkt.com/privacy-policy</loc>
     </url>
     <url>
        <loc>https://www.influencermarkt.com/about</loc>
     </url>
     <url>
        <loc>https://www.influencermarkt.com/contact-us</loc>
     </url>
     <url>
        <loc>https://www.influencermarkt.com/terms-conditions</loc>
     </url>
     <url>
        <loc>https://www.influencermarkt.com/explore/influencers</loc>
     </url>
     ${usernames
       .map((username) => {
         if (!username.includes("delete") || !username.includes("test")) {
           return `
        <url>
            <loc>${`https://www.influencermarkt.com/${username}`}</loc>
        </url>
      `;
         }
       })
       .join("")}
   </urlset>
 `;
};

function SiteMap() {
  // getServerSideProps will do the heavy lifting
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const ssg = generateSSGHelper();
  const users = await ssg.users.getAllUsernames.fetch();

  const sitemap = generateSiteMap(
    users.map((user) => {
      return user.username || "";
    })
  );

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  // This is required for Next.js 12 or later
  return {
    props: {},
  };
};

export default SiteMap;
