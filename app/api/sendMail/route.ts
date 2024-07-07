import { sendEmail } from "./sendMail";

interface EmailPayload {
  sender: {
    name: string;
    address: string;
  };
  receiver: {
    name: string;
    address: string;
  };
  subject: string;
  message: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    const { sender, receiver, subject, message }: EmailPayload = await request.json();

    const result = await sendEmail({
      sender,
      receiver,
      subject,
      message,
    });

    return new Response(
      JSON.stringify({
        accepted: result.accepted,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        message: "Unable to send",
      }),
      { status: 500 }
    );
  }
}
