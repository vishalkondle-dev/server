export const sendEmail = async (
  to: string,
  otp: string,
  serviceUrl?: string
) => {
  try {
    const data = await fetch(`${serviceUrl}/send-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, otp }),
    });
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
