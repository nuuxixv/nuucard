import { google } from "googleapis";
import { NextResponse } from "next/server";
import { POSTCARDS } from "@/lib/constants";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, phone, email, address, detailAddress, message, items, totalAmount, date } = body;

    // 각 상품별 수량을 매핑 (주문하지 않은 상품은 0)
    const productQuantities = POSTCARDS.map((product) => {
      const orderedItem = items.find((item: any) => item.id === product.id);
      return orderedItem ? orderedItem.quantity : 0;
    });

    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive",
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/spreadsheets",
      ],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "시트1!A:Z", // 충분한 열 범위 확보
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [
          [
            date,                           // A: 주문일시
            name,                           // B: 이름
            phone,                          // C: 연락처
            email,                          // D: 이메일
            `${address} ${detailAddress}`,  // E: 주소
            message,                        // F: 응원 메시지
            totalAmount,                    // G: 총 금액
            ...productQuantities,           // H열부터: 각 상품별 수량
          ],
        ],
      },
    });

    return NextResponse.json({ success: true, data: response.data });
  } catch (error) {
    console.error("Google Sheets API Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save order" },
      { status: 500 }
    );
  }
}
