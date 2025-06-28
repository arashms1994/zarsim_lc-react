import { BASE_URL } from "./base";
import { getDigest } from "./getDigest";

export interface IOpenningState {
  LCTotalPrice: number;
  LCNumber: string;
  LCOpenningDate: string;
  LCCommunicationDate: string;
  LCSettlementDate: string;
  LCOriginOpenningDate: string;
}

export async function AddToOpenningDate(state: IOpenningState): Promise<void> {
  const listName = "LC_Openning";
  const itemType = `SP.Data.LC_x005f_OpenningListItem`;
  const digest = await getDigest();

  console.log("Sending data:", {
    Title: "اعتبار اسنادی",
    LC_Number: state.LCNumber,
    Total_Price: state.LCTotalPrice,
    Openning_Date: state.LCOpenningDate,
    Communication_Date: state.LCCommunicationDate,
    Settlement_Period: state.LCSettlementDate,
    Origin_Openning_Date: state.LCOriginOpenningDate,
  });

  const response = await fetch(
    `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items`,
    {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest,
      },
      body: JSON.stringify({
        __metadata: { type: itemType },
        Title: "اعتبار اسنادی",
        LC_Number: String(state.LCNumber),
        Total_Price: String(state.LCTotalPrice),
        Settlement_Period: String(state.LCSettlementDate),
        Origin_Openning_Date: String(state.LCOriginOpenningDate),
        // Openning_Date: String(state.LCOpenningDate),
        // Communication_Date: String(state.LCCommunicationDate),
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error("خطا در ثبت آیتم: " + error);
  }

  const data = await response.json();
  console.log("آیتم با موفقیت ثبت شد:", data);
}
