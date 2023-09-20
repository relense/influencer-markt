export const newOrderEmail = (params: {
  orderId: number;
  language: string;
}) => {
  const { orderId, language } = params;

  if (language === "pt") {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>New Order</title>
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
                        href="https://influencerMarkt.com"
                        style="
                          text-decoration: none;
                          color: #fd3a84;
                          font-family: Lobster;
                        "
                        ><img
                          src="../../../public/images/logo.png"
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
                      <h3 class="title">Recebeste Um Novo Pedido</h3>
    
                      <a
                        href="https://influencermarkt.com/sales/${orderId}"
                        class="button"
                        ><span style="color: #fff">Ver Pedido</span></a
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
  } else {
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
   <html xmlns="http://www.w3.org/1999/xhtml">
     <head>
       <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
       <meta http-equiv="X-UA-Compatible" content="IE=edge" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>New Order</title>
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
                       href="https://influencerMarkt.com"
                       style="
                         text-decoration: none;
                         color: #fd3a84;
                         font-family: Lobster;
                       "
                       ><img
                         src="../../../public/images/logo.png"
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
                     <h3 class="title">You Received An Order Request</h3>
   
                     <a
                       href="https://influencermarkt.com/sales/${orderId}"
                       class="button"
                       ><span style="color: #fff">View Order</span></a
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
};
