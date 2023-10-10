import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import * as mail from "@sendgrid/mail";
import { emailContent } from "./content";

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  if (req.method !== "POST") {
    context.res = {
      status: 405,
      body: "Method not allowed",
    };
    return;
  }

  if (!req.body || !req.body.email || !req.body.name) {
    context.res = {
      status: 400,
      body: "Bad request",
    };
    return;
  }

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    context.res = {
      status: 500,
      body: "Missing API key",
    };
    return;
  }

  context.log(apiKey);
  mail.setApiKey(apiKey);

  const { email, name } = req.body;

  const message = {
    to: email,
    from: "torgerboc@gmail.com",
    subject: "Verify your email",
    // text: "and easy to do anywhere, even with Node.js",
    html: emailContent(email, name),
  };

  try {
    const response = await mail.send(message);
    context.log(response);
    // statusCode 202
    context.res = response[0];
    context.res.body = `Email sent to ${email}`;
    return;
  } catch (error) {
    context.log(error);
    context.res = {
      status: error.code,
      body: "Forbidden",
    };
    return;
  }
};

export default httpTrigger;
