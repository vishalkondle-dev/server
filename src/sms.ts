import { Hono } from "hono";
import {
  SNSClient,
  PublishCommand,
  CreateSMSSandboxPhoneNumberCommand,
} from "@aws-sdk/client-sns";
import { addPhoneNumber } from "../lib/sms";

type Env = {
  Bindings: {
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
  };
};

const smsApp = new Hono<Env>();

smsApp.post("/send-sms", async (c) => {
  const { phoneNumber, message } = await c.req.json();
  const sns = new SNSClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: c.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: c.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
  };

  try {
    const command = new PublishCommand(params);
    const response = await sns.send(command);
    return c.json({ success: true, messageId: response.MessageId });
  } catch (error) {
    console.error(error);
    return c.json({ success: false, error: (error as Error).message }, 500);
  }
});

smsApp.post("/add-phone-number", async (c) => {
  const { phoneNumber, message } = await c.req.json();
  const sns = new SNSClient({
    region: "us-east-1",
    credentials: {
      accessKeyId: c.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: c.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const params = {
    Message: message,
    PhoneNumber: phoneNumber,
  };

  try {
    const command = new CreateSMSSandboxPhoneNumberCommand({
      PhoneNumber: phoneNumber,
      LanguageCode: "en-US",
    });
    const response = await sns.send(command);
    // const command = new PublishCommand(params);
    // const response = await sns.send(command);
    // const response = await addPhoneNumber(
    //   phoneNumber,
    //   c.env.AWS_ACCESS_KEY_ID,
    //   c.env.AWS_SECRET_ACCESS_KEY
    // );
    console.log({ response });
    return c.json({ success: true, data: response });
  } catch (error) {
    console.error(error);
    return c.json({ success: false, error: (error as Error).message }, 500);
  }
});

export default smsApp;
