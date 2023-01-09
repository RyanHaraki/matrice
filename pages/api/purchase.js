// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default function handler(req, res) {
  const {
    to_email,
    product_name,
    product_description,
    product_price,
    product_url,
  } = JSON.parse(req.body);

  let nodemailer = require("nodemailer");

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.NEXT_PUBLIC_SENDER_EMAIL,
      pass: process.env.NEXT_PUBLIC_SENDER_EMAIL_PASSWORD,
    },
    secure: true,
  });

  const mailData = {
    from: "ryanharaki1@gmail.com",
    to: to_email,
    subject: `You purchased ${product_name}!`,
    text: `You purchased ${product_name}!`,
    html: `<div>
    <h1>You purchased ${product_name}!</h1>

    <p>Congratulations on your purchase, here are the details:
    <hr />
    <p>Product Description: ${product_description}</p>
    <p>Product Price: ${product_price}</p>
    <p>Product URL: ${
      product_url
        ? ` <a href=${product_url}>${product_url}</a>`
        : `No URL provided`
    }</p>
    <hr />
    <p>Thank you for using Matrice!</p>
    </div>`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      console.log(err);
      res.status(500);
    } else {
      console.log(info);
      res.status(200).send("Email sent!");
    }
  });
}

export const config = {
  api: {
    bodyParser: true,
  },
};
