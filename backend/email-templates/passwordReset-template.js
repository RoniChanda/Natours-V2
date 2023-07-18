module.exports = (firstName, url) => `<!-- CONTENT-->
<p>Hi ${firstName},</p>
<p>Forgot your password? Submit a PATCH request with your password and passwordConfirm to: ${url} or click on the button below:</p>
<table class="btn btn-primary" role="presentation" border="0" cellpadding="0" cellspacing="0">
  <tbody>
    <tr>
      <td align="left">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0">
          <tbody>
            <tr>
              <td><a href=${url} target="_blank">Reset your password</a></td>
            </tr>
          </tbody>
        </table>
      </td>
    </tr>
  </tbody>
</table>
<p>If you didn't forget your password, please ignore this email!</p>`;
