import nodemailer from "nodemailer"
import { DB } from "src/db/index.ts";
import { Request, Response } from 'express';
import dotenv from 'dotenv';
import { lettersTable } from "src/db/schema.ts";
import { eq } from "drizzle-orm";
dotenv.config();

const dbController = DB.getInstance().dbController;

// if (!process.env.AWS_ACCESS_KEY || !process.env.AWS_SECRET_ACCESS_KEY || !process.env.AWS_REGION) {
//   throw new Error('AWS credentials or region are not properly set');
// }

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user:"slowpost2025@gmail.com",
    pass:process.env.GOOGLE_APP_PASSWORD
  }
});
// const ses = new SESClient({
//     region: process.env.AWS_REGION,
//     credentials: {
//         accessKeyId:process.env.AWS_ACCESS_KEY || '',
//         secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY || '',
//     }
// }); // AWS_REGION = "ap-northeast-2"

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

const DateTimeFormatinstance = new Intl.DateTimeFormat("ko-KR", {
          year: "numeric",
          month: "numeric",
          day: "numeric",
          timeZone: "Asia/Seoul",
        });
async function sendEmail(letter: Omit<typeof lettersTable.$inferSelect, "time_send" | "time_receive"> & { time_send: number; time_receive: number }) {
    try {
        const email = letter.email_get_notify_receive;
        const title = letter.title;
        const content = letter.content;
        const timeSend = new Date(letter.time_send);
        const timeReceive = new Date(letter.time_receive);

        const id = letter.id;
        const resultUser = await dbController.getUserWithID(letter.user_id_from);
        const name = resultUser.isOk() ? resultUser.value.name : "Unknown Sender";
        const sendtime = DateTimeFormatinstance.format(timeSend);

        const htmlTemplate = `
  <div style="font-family:'Apple SD Gothic Neo','Malgun Gothic',sans-serif; background-color:#f9f9f9; padding:24px; color:#333;">
    <div style="background:#fff; padding:24px; border-radius:12px; box-shadow:0 4px 12px rgba(0,0,0,0.05); max-width:600px; margin:auto;">
      <div style="font-size:20px; margin-bottom:16px; color:#444;">📮 느린우체통에서 편지가 도착했어요!</div>
      <div style="margin-bottom:24px;">
        <div><strong style="color:#666;">📌 편지 제목:</strong> ${title}</div>
      </div>

      <div><strong style="color:#666;">💌 편지 내용:</strong></div>
      <div style="white-space:pre-line; line-height:1.6; margin-top:8px; background-color:#f0f0f5; padding:16px; border-radius:8px;">
        ${content}
        <div style="margin-top:24px; text-align:right; font-size:14px; color:#555;">
          ${sendtime}의 ${name}으로부터.
        </div>
      </div>

      <div style="text-align:center; margin-top:32px;">
        <a href="https://slow-postbox.netlify.app/view/${id}" style="display:inline-block; background-color:#1d72b8; color:#fff; padding:12px 24px; border-radius:6px; text-decoration:none; font-weight:bold;">📖 편지 읽으러 가기</a>
      </div>

      <div style="margin-top:32px; font-size:12px; color:#999; text-align:center;">
        이 편지는 느린우체통 서비스를 통해 전달되었습니다.<br>
        시간이 흘러도 당신의 마음은 도착합니다.
      </div>
    </div>
  </div>
`;
        console.log("Email to send:", email);
        // const params = {
        //     Destination: {
        //     ToAddresses: [email],
        //     },
        //     Message: {
        //     Body: {
        //         Text: {
        //         Data: `제목: ${title}\n내용: ${content}`,
        //         },
        //     },
        //     Subject: {
        //         Data: "느린우체통으로부터 편지가 도착했습니다 📮",
        //     },
        //     },
        //     Source: "no-reply@slowpost.p-e.kr",
        // };

        // const command = new SendEmailCommand(params);
        // return await ses.send(command);


        const info = await transport.sendMail({
          from: '"느린 우체통" <slowpost2025@gmail.com>', // sender address
          to: email, // list of receivers
          subject: "느린우체통으로부터 편지가 도착했습니다 📮", // Subject line
          html: htmlTemplate, // html body
        });

        console.log("Message sent: %s", info.messageId);
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        return true;

    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}