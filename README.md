![logo-green](https://github.com/RoniChanda/Natours-V2/assets/86836682/e2b659e2-ce51-4ab1-a4ca-edf9da3cca20)
## Natours-Mern-V2
This is the modified version of *Jonas Schmedtmann's* Natours using **MERN** stack (React frontend and Node backend).
## Live Website
Visit the link -> https://natours-mern-v2.netlify.app/
## Some notable features of the Original Version
1. Authentication using email & password, jwt cookie
2. Marking the locations of tours on the map
3. Forgot/Reset password using reset link in email
4. Payment method using Stripe
5. Update user details/password 
## Newly added features
1. Authentication ->
   - Login with Google provider
   - Refresh and Access tokens/cookies with reuse detection and multiple device login compatibility
   - Two-Factor Authentication using any Authenticator app or using a verification code in email/phone
   - Forgot/Reset password using verification code in email/phone
2. User-related ->
   - Email and phone verification
   - Deactivate or Delete the User account
3. User Booking ->
   - Different booking status - "pending", "paid", "canceled" and "refund"
   - Refund functionality and also downloadable invoice and receipt from Stripe
   - Participants for each tour date
4. User Review ->
   - Only can review for booked tour after the tour is over
   - Feedback (like/unlike) for each review
5. Manage users, tours, reviews, and bookings
6. Sort, filter, pagination, and search box functionality
## Videos
### Overview page
https://github.com/RoniChanda/Natours-V2/assets/86836682/75f963cc-54d4-4430-9682-5155f075eca5
### Tour Details page
https://github.com/RoniChanda/Natours-V2/assets/86836682/d0b5e7c0-d56b-4250-89a3-81c35563ddf9
### Login / Signup / Account Recovery pages
https://github.com/RoniChanda/Natours-V2/assets/86836682/76316f08-0408-44b4-8cd3-aed7c2e5f614
### Profile and Security pages
https://github.com/RoniChanda/Natours-V2/assets/86836682/5c01dcf8-65b2-4dc9-9606-dc238069626f
### Tour Booking
https://github.com/RoniChanda/Natours-V2/assets/86836682/9d746e20-858b-4171-9d10-7dab004571a2
### User Reviews page
https://github.com/RoniChanda/Natours-V2/assets/86836682/8470a355-d63c-44ad-8fc2-4c20b9517df8
### Manage Tours page
https://github.com/RoniChanda/Natours-V2/assets/86836682/d1eb383f-e832-45a7-ad34-0bc08d970ecf
### Manage Users/Reviews/Bookings pages
https://github.com/RoniChanda/Natours-V2/assets/86836682/d6deca19-ed2c-43b4-b2a9-bdfb8775f91b
### Two-Factor Login pages
https://github.com/RoniChanda/Natours-V2/assets/86836682/cc5c974e-937f-42b7-bef6-d3e8612c26f4
## Platforms used
1. Frontend- [Vite](https://vitejs.dev/guide/)/[React](https://react.dev/), Backend- [Node](https://nodejs.org/en)/[Express](https://expressjs.com/), Database- [MongoDB](https://www.mongodb.com/)/[Mongoose](https://mongoosejs.com/)
2. Store- [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview)
3. Payment- [Stripe](https://stripe.com/en-in)
4. Mail- [MailTrap](https://mailtrap.io/) (Development) & [Brevo](https://app.brevo.com/) (Production) [Free version]
5. SMS- [Twilio](https://www.twilio.com/en-us) [Free version]
6. Image Upload- [Cloudinary](https://cloudinary.com/)
7. Google Login- [Passport](https://www.passportjs.org/)
8. Map- [Mapbox](https://www.mapbox.com/)
9. Frontend deployed in [Netlify](https://www.netlify.com/) and Backend deployed in [Vercel](https://vercel.com/)
## Packages used
### Backend
```
{
  "name": "backend",
  "version": "1.0.0",
  "description": "Natours tour app backend",
  "main": "app.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "prod": "SET NODE_ENV=production&nodemon server.js",
    "data:import": "node seeder.js --import",
    "data:delete": "node seeder.js --delete",
    "debug": "ndb server.js"
  },
  "author": "Supratim Chanda",
  "license": "ISC",
  "dependencies": {
    "bcryptjs": "^2.4.3",
    "cloudinary": "^1.37.1",
    "compression": "^1.7.4",
    "cookie-parser": "^1.4.6",
    "cors": "^2.8.5",
    "dotenv": "^16.1.3",
    "express": "^4.18.2",
    "express-mongo-sanitize": "^2.2.0",
    "express-rate-limit": "^6.7.0",
    "helmet": "^7.0.0",
    "hpp": "^0.2.3",
    "html-to-text": "^9.0.5",
    "jsonwebtoken": "^9.0.0",
    "mongoose": "^7.2.2",
    "morgan": "^1.10.0",
    "multer": "^1.4.5-lts.1",
    "nodemailer": "^6.9.3",
    "nodemailer-sendinblue-transport": "^2.0.1",
    "otplib": "^12.0.1",
    "passport": "^0.6.0",
    "passport-google-oauth20": "^2.0.0",
    "qrcode": "^1.5.3",
    "sanitize-html": "^2.11.0",
    "sharp": "^0.32.1",
    "slugify": "^1.6.6",
    "stripe": "^12.9.0",
    "twilio": "^4.12.0",
    "validator": "^13.9.0"
  },
  "devDependencies": {
    "eslint": "^8.41.0",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-config-prettier": "^8.8.0",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "eslint-plugin-node": "^11.1.0",
    "eslint-plugin-prettier": "^4.2.1",
    "eslint-plugin-react": "^7.32.2",
    "prettier": "^2.8.8"
  },
  "engines": {
    "node": ">=10.6.0"
  }
}
```
### Frontend
```
{
  "name": "frontend",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@reduxjs/toolkit": "^1.9.5",
    "async-mutex": "^0.4.0",
    "mapbox-gl": "^2.15.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-helmet-async": "^1.3.0",
    "react-phone-input-2": "^2.15.1",
    "react-redux": "^8.0.7",
    "react-router-dom": "^6.11.2"
  },
  "devDependencies": {
    "@types/react": "^18.0.37",
    "@types/react-dom": "^18.0.11",
    "@vitejs/plugin-react": "^4.0.0",
    "eslint": "^8.38.0",
    "eslint-plugin-react": "^7.32.2",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.3.4",
    "vite": "^4.3.9"
  }
}
```
## Issues in this website
1. Twilio is in the free version. So sending sms to an unverified number is not possible.
2. Vercel has a payload limit of 4.5MB; hence, an error will occur if the total size of the submitted file exceeds 4.5 MB. Better use images of fewer sizes.
   
If you find any other notable issues please get in touch with me at suprachanda97@gmail.com
## Future Ideas
1. To make this website mobile responsive
2. To add a carousel of top tours on the overview page
3. To Add a dashboard of tours about tour stats and monthly plans for admin, guide, and lead-guide
4. To Add the functionality of finding tours using coordinates and distances
5. To Add functionality of changing roles to admin, guide or lead-guide

### Thank you for visiting!




