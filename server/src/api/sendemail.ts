import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { DB } from "src/db/index.ts";
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { lettersTable } from "src/db/schema.ts";
import { eq } from "drizzle-orm";
dotenv.config();

const dbController = DB.getInstance().dbController;

if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
  throw new Error('AWS credentials or region are not properly set');
}
const ses = new SESClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId:process.env.AWS_ACCESS_KEY || '',
        secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY || '',
    }
}); // AWS_REGION = "ap-northeast-2"

export const handler = async() => {
    try {
    const result = await dbController.letterstosend();
    if (result.isErr()) {
      return console.error("Error fetching letters to send:", result.error);
    }

    const letters = result.value;
    if (letters.length === 0) {
      return console.log("No letters to send at this time.");
    }

    const sendResults = [];
    for (const letter of letters) {
      try {
        const sendResult = await sendEmail(letter);
        console.log("✅ Email sent to", letter.email_get_notify_receive);
        await dbController.db
            .update(lettersTable)
            .set({ is_sent: true })
            .where(eq(lettersTable.id, letter.id));
        sendResults.push({ email: letter.email_get_notify_receive, success: true });
      } catch (err) {
        console.error("❌ Failed to send email to", letter.email_get_notify_receive, err);
        sendResults.push({ email: letter.email_get_notify_receive, success: false, error: err });
      }
    }

    console.log("Email sending results:", sendResults);
  } catch (e) {
    console.error("Unhandled error:", e);}
};


async function sendEmail(letter: Omit<typeof lettersTable.$inferSelect, "time_send" | "time_receive"> & { time_send: number; time_receive: number }) {
    try {
        const email = letter.email_get_notify_receive;
        const title = letter.title;
        const content = letter.content;
        const timeSend = new Date(letter.time_send);
        const timeReceive = new Date(letter.time_receive);

        
        console.log("Email to send:", email);
        const params = {
            Destination: {
            ToAddresses: [email],
            },
            Message: {
            Body: {
                Text: {
                Data: `제목: ${title}\n내용: ${content}`,
                },
            },
            Subject: {
                Data: "느린우체통으로부터 편지가 도착했습니다 📮",
            },
            },
            Source: "no-reply@slowpost.p-e.kr",
        };

        const command = new SendEmailCommand(params);
        return await ses.send(command);
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }  
}