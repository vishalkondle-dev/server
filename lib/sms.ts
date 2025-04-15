import {
  CreateSMSSandboxPhoneNumberCommand,
  PublishCommand,
  SNSClient,
} from "@aws-sdk/client-sns";

export const sendSms = async (
  PhoneNumber: string,
  Message: string,
  accessKeyId: string,
  secretAccessKey: string
) => {
  try {
    const sns = new SNSClient({
      region: "us-east-1",
      credentials: { accessKeyId, secretAccessKey },
    });

    const params = { Message, PhoneNumber };

    const command = new PublishCommand(params);
    const response = await sns.send(command);
    console.log(`Message ${Message} sent to ${PhoneNumber}`, response);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const addPhoneNumber = async (
  PhoneNumber: string,
  accessKeyId: string,
  secretAccessKey: string
) => {
  try {
    const sns = new SNSClient({
      region: "us-east-1",
      credentials: { accessKeyId, secretAccessKey },
    });
    const command = new CreateSMSSandboxPhoneNumberCommand({
      PhoneNumber,
      LanguageCode: "en-US",
    });
    const response = await sns.send(command);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
