import { getDigest } from "@/utils/getDigest";
import type { IOpenningState } from "@/utils/type";
import { BASE_URL } from "./base";


export async function AddToOpenningDate(state: IOpenningState): Promise<void> {
  const listName = "LC_Openning";
  const itemType = `SP.Data.LC_x005f_OpenningListItem`;
  const digest = await getDigest();

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
        Opening_Date: String(state.LCOpenningDate),
        Communication_Date: String(state.LCCommunicationDate),
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

export async function AddToCarryReceipt(item: {
  Title: string;
  GUID: string | null;
  TotalPrice: number;
  LCNumber: string;
  Price: number;
  Count: number;
}) {
  const listName = "LC_carry_receipt";
  const itemType = `SP.Data.${listName}ListItem`;
  const digest = await getDigest();

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
        Title: item.Title,
        GUID: item.GUID,
        TotalPrice: item.TotalPrice,
        LCNumber: item.LCNumber,
        Price: item.Price,
        Count: item.Count,
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


