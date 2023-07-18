module.exports = (firstName, otp) => `<!-- CONTENT-->
<p>Hi ${firstName},</p>
<p>Please enter below mentioned otp for email verification in natours app: </p>
<h1 class="otp-value">${otp}</h1>

<p>If email already verified, please ignore this email!</p>`;
