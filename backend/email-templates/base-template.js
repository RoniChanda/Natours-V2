const styles = require("./styles");

module.exports = (content, firstName, url) => `<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title></title>
    ${styles}
  </head>
  <body>
    <table class="body" role="presentation" border="0" cellpadding="0" cellspacing="0">
      <tbody>
        <tr>
          <td></td>
          <td class="container">
            <div class="content">
              <!-- START CENTERED WHITE CONTAINER-->
              <table class="main" role="presentation">
                <!-- START MAIN AREA-->
                <tbody>
                  <tr>
                    <td class="wrapper">
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                        <tbody>
                          <tr>
                            <td>
                              ${content(firstName, url)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
              <!-- START FOOTER-->
              <div class="footer">
                <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                  <tbody>
                    <tr>
                      <td class="content-block"><span class="apple-link">Natours Inc, 123 Nowhere Road, San Francisco CA 99999</span><br> Don't like these emails? <a href="#">Unsubscribe</a></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </body>
</html>`;
