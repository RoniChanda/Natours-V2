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
## Tools used
1. Frontend- [Vite](https://vitejs.dev/guide/)/[React](https://react.dev/), Backend- [Node](https://nodejs.org/en)/[Express](https://expressjs.com/), Database- [MongoDB](https://www.mongodb.com/)/[Mongoose](https://mongoosejs.com/)
2. Store- [Redux Toolkit Query](https://redux-toolkit.js.org/rtk-query/overview)
3. Payment- [Stripe](https://stripe.com/en-in)
4. Mail- [Nodemailer](https://github.com/nodemailer/nodemailer), [MailTrap](https://mailtrap.io/) (Development) & [Brevo](https://app.brevo.com/) (Production) [Free version]
5. SMS- [Twilio](https://www.twilio.com/en-us) [Free version]
6. Image Upload- [multer](https://github.com/expressjs/multer), [sharp](https://github.com/lovell/sharp) and [Cloudinary](https://cloudinary.com/)
7. Google Login- [passport](https://www.passportjs.org/)
8. Two-Factor Authentication- [otplib](https://github.com/yeojz/otplib), [qrcode](https://github.com/soldair/node-qrcode)
9. Map- [Mapbox](https://www.mapbox.com/)
10. Frontend deployed in [Netlify](https://www.netlify.com/) and Backend deployed in [Vercel](https://vercel.com/)
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

### Thankyou for visiting!




