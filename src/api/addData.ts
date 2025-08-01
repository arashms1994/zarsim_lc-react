import { getDigest } from "@/utils/getDigest";
import type { ICustomerFactorUpdate } from "@/utils/type";
import { BASE_URL } from "./base";

export async function UpdateCustomerFactorItem(
  faktorNumber: string,
  data: Partial<ICustomerFactorUpdate>
): Promise<void> {
  const digest = await getDigest();
  const listName = "customer_factor";
  const itemType = "SP.Data.Customer_x005f_factorListItem";

  const getResponse = await fetch(
    `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items?$filter=Title eq '${faktorNumber}'`,
    {
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  );

  const result = await getResponse.json();
  const items = result.d?.results || [];

  const payload = {
    __metadata: { type: itemType },
    ...data,
  };

  if (items.length > 0) {
    const itemId = items[0].Id;

    const updateResponse = await fetch(
      `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`,
      {
        method: "POST",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": digest,
          "X-HTTP-Method": "MERGE",
          "IF-MATCH": "*",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!updateResponse.ok) {
      const error = await updateResponse.text();
      throw new Error("خطا در به‌روزرسانی آیتم: " + error);
    }
  } else {
    const createResponse = await fetch(
      `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items`,
      {
        method: "POST",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": digest,
        },
        body: JSON.stringify(payload),
      }
    );

    if (!createResponse.ok) {
      const error = await createResponse.text();
      throw new Error("خطا در ایجاد آیتم: " + error);
    }
  }
}

// export async function addToCustomerFactor(
//   state: IOpenningState
// ): Promise<void> {
//   const listName = "customer_factor";
//   const itemType = `SP.Data.Customer_x005f_factorListItem`;
//   const digest = await getDigest();

//   const response = await fetch(
//     `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items`,
//     {
//       method: "POST",
//       headers: {
//         Accept: "application/json;odata=verbose",
//         "Content-Type": "application/json;odata=verbose",
//         "X-RequestDigest": digest,
//         "X-HTTP-Method": "MERGE",
//         "IF-MATCH": "*",
//       },
//       body: JSON.stringify({
//         __metadata: { type: itemType },
//         LCNumber: String(state.LCNumber),
//         LCTotal: String(state.LCTotalPrice),
//         tarikhmabnavalue: String(state.LCSettlementDate),
//         mabnavalue: String(state.LCOriginOpenningDate),
//         Opening_Date: String(state.LCOpenningDate),
//         Communication_Date: String(state.LCCommunicationDate),
//       }),
//     }
//   );

//   if (!response.ok) {
//     const error = await response.text();
//     throw new Error("خطا در ثبت آیتم: " + error);
//   }

//   const data = await response.json();
//   console.log("آیتم با موفقیت ثبت شد:", data);
// }

export async function addToCarryReceipt(item: {
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
