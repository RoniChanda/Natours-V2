const client = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

module.exports = (code, receiver) =>
  client.messages.create({
    body: `Your Natours verification code is ${code}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: receiver,
  });
