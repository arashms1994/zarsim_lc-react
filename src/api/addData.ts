import { getDigest } from "@/utils/getDigest";
import type {
  ICarryReceipt,
  ICustomerFactorUpdate,
  INotificationItem,
} from "@/utils/type";
import { BASE_URL } from "./base";
import { generatePhaseNumber } from "@/utils/generatePhaseNumber";

export async function updateCustomerFactorItem(
  faktorNumber: string,
  data: Partial<ICustomerFactorUpdate>
): Promise<void> {
  const digest = await getDigest();
  const listName = "customer_factor";

  const metaRes = await fetch(
    `${BASE_URL}/_api/web/lists/getbytitle('${listName}')?$select=ListItemEntityTypeFullName`,
    { headers: { Accept: "application/json;odata=verbose" } }
  );

  if (!metaRes.ok) {
    const err = await metaRes.text();
    throw new Error(
      `خطا در دریافت metadata: ${err} (وضعیت: ${metaRes.status})`
    );
  }

  const metaJson = await metaRes.json();
  const itemType = metaJson?.d?.ListItemEntityTypeFullName;
  if (!itemType) throw new Error("نوع آیتم یافت نشد");

  const safeFaktorNumber = faktorNumber.replace(/'/g, "''");
  const getRes = await fetch(
    `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items?$filter=Title eq '${safeFaktorNumber}'&$top=1`,
    { headers: { Accept: "application/json;odata=verbose" } }
  );

  if (!getRes.ok) {
    const err = await getRes.text();
    throw new Error(`خطا در گرفتن آیتم: ${err} (وضعیت: ${getRes.status})`);
  }

  const getJson = await getRes.json();
  const items = getJson?.d?.results;
  if (!Array.isArray(items)) {
    throw new Error("فرمت پاسخ SharePoint نامعتبر است");
  }

  if (items.length > 1) {
    throw new Error("چند آیتم با این شماره فاکتور یافت شد");
  }

  const payload = {
    __metadata: { type: itemType },
    ...data,
  };

  const baseHeaders: HeadersInit = {
    Accept: "application/json;odata=verbose",
    "Content-Type": "application/json;odata=verbose",
    "X-RequestDigest": digest,
  };

  if (items.length > 0) {
    const itemId = items[0].Id;
    const updateHeaders = {
      ...baseHeaders,
      "X-HTTP-Method": "MERGE",
      "IF-MATCH": items[0].__metadata?.etag || "*",
    };

    const updateRes = await fetch(
      `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items(${itemId})`,
      {
        method: "POST",
        headers: updateHeaders,
        body: JSON.stringify(payload),
      }
    );

    if (!updateRes.ok) {
      const err = await updateRes.text();
      throw new Error(
        `خطا در به‌روزرسانی آیتم: ${err} (وضعیت: ${updateRes.status})`
      );
    }
  } else {
    const createRes = await fetch(
      `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items`,
      {
        method: "POST",
        headers: baseHeaders,
        body: JSON.stringify(payload),
      }
    );

    if (!createRes.ok) {
      const err = await createRes.text();
      throw new Error(
        `خطا در ایجاد آیتم جدید: ${err} (وضعیت: ${createRes.status})`
      );
    }
  }
}

export const updateLCEnding = async (faktorNumber: string) => {
  try {
    const digest = await getDigest();
    const listName = "customer_factor";

    const metaRes = await fetch(
      `${BASE_URL}/_api/web/lists/getbytitle('${listName}')?$select=ListItemEntityTypeFullName`,
      {
        headers: {
          Accept: "application/json;odata=verbose",
        },
      }
    );
    if (!metaRes.ok) {
      throw new Error("خطا در دریافت متادیتای لیست");
    }
    const metaData = await metaRes.json();
    const listItemEntityTypeFullName = metaData.d.ListItemEntityTypeFullName;

    const queryRes = await fetch(
      `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items?$filter=Title eq '${faktorNumber}'`,
      {
        headers: {
          Accept: "application/json;odata=verbose",
        },
      }
    );
    if (!queryRes.ok) {
      throw new Error("خطا در پیدا کردن ردیف");
    }
    const queryData = await queryRes.json();
    const items = queryData.d.results;

    if (items.length === 0) {
      throw new Error(`ردیفی با شماره فاکتور ${faktorNumber} یافت نشد`);
    }
    if (items.length > 1) {
      throw new Error(`چند ردیف با شماره فاکتور ${faktorNumber} یافت شد`);
    }

    const itemId = items[0].Id;

    const updateRes = await fetch(
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
        body: JSON.stringify({
          __metadata: {
            type: listItemEntityTypeFullName,
          },
          LCEnding: "1",
        }),
      }
    );

    if (!updateRes.ok) {
      throw new Error("خطا در به‌روزرسانی اختتامیه اعتبار اسنادی");
    }

    return {
      success: true,
      message: "اختتامیه اعتبار اسنادی با موفقیت ثبت شد!",
    };
  } catch (error) {
    console.error("Error updating LCEnding:", error);
    return {
      success: false,
      message: `خطایی در ثبت اختتامیه رخ داد: ${error}`,
    };
  }
};

export async function addCarryReceipt(
  formData: Partial<ICarryReceipt>
): Promise<void> {
  const itemType = `SP.Data.LC_x005f_carry_x005f_receiptListItem`;
  const digest = await getDigest();

  const response = await fetch(
    `${BASE_URL}/_api/web/lists(guid'0353e805-7395-46c1-8767-0ad173f3190b')/items`,
    {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest,
      },
      credentials: "include",
      body: JSON.stringify({
        __metadata: { type: itemType },
        ...formData,
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

export async function addCarryPhaseGuid(
  receipts: ICarryReceipt[],
  existingReceipts: ICarryReceipt[]
): Promise<string> {
  const itemType = `SP.Data.LC_x005f_carry_x005f_receiptListItem`;
  const digest = await getDigest();
  const phaseNumber = generatePhaseNumber(existingReceipts);

  const validReceipts = receipts.filter((receipt) => !receipt.Carry_Phase_GUID);

  if (validReceipts.length === 0) {
    throw new Error("هیچ رسید معتبری برای افزودن به مرحله حمل یافت نشد.");
  }

  const updatePromises = validReceipts.map(async (receipt) => {
    const response = await fetch(
      `${BASE_URL}/_api/web/lists(guid'0353e805-7395-46c1-8767-0ad173f3190b')/items(${receipt.Id})`,
      {
        method: "MERGE",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": digest,
          "IF-MATCH": "*",
        },
        credentials: "include",
        body: JSON.stringify({
          __metadata: { type: itemType },
          Carry_Phase_GUID: phaseNumber,
          Status: "1",
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`خطا در به‌روزرسانی رسید ${receipt.Id}: ${error}`);
    }
  });

  await Promise.all(updatePromises);
  return phaseNumber;
}

export async function addNotificationItem(
  data: INotificationItem
): Promise<void> {
  const digest = await getDigest();

  const itemType = "SP.Data.NotificationListItem";

  const response = await fetch(
    `${BASE_URL}/_api/web/lists/getbytitle('Notification')/items`,
    {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-Type": "application/json;odata=verbose",
        "X-RequestDigest": digest,
      },
      credentials: "include",
      body: JSON.stringify({
        __metadata: { type: itemType },
        ...data,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error("خطا در ثبت نوتیفیکیشن: " + error);
  }
}

export async function updateCarryReceiptStatus(
  itemIds: number[],
  status: string
): Promise<void> {
  const itemType = "SP.Data.LC_x005f_carry_x005f_receiptListItem";
  const digest = await getDigest();

  await Promise.all(
    itemIds.map(async (itemId) => {
      const response = await fetch(
        `${BASE_URL}/_api/web/lists(guid'0353e805-7395-46c1-8767-0ad173f3190b')/items(${itemId})`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": digest,
            "IF-MATCH": "*",
          },
          credentials: "include",
          body: JSON.stringify({
            __metadata: { type: itemType },
            Status: status,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`خطا در آپدیت Status آیتم ${itemId}: ${errorText}`);
      }
    })
  );
}

export async function updateCarryReceiptBankRejectionStatus(
  itemIds: number[],
  Description: string
): Promise<void> {
  const itemType = "SP.Data.LC_x005f_carry_x005f_receiptListItem";
  const digest = await getDigest();

  await Promise.all(
    itemIds.map(async (itemId) => {
      const response = await fetch(
        `${BASE_URL}/_api/web/lists(guid'0353e805-7395-46c1-8767-0ad173f3190b')/items(${itemId})`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": digest,
            "IF-MATCH": "*",
          },
          credentials: "include",
          body: JSON.stringify({
            __metadata: { type: itemType },
            Status: "1",
            Bank_Confirm: "1",
            Description: Description,
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`خطا در آپدیت Status آیتم ${itemId}: ${errorText}`);
      }
    })
  );
}

export async function updateCarryBankConfirmation(
  itemIds: number[],
  bankConfirm: string
): Promise<void> {
  const itemType = "SP.Data.LC_x005f_carry_x005f_receiptListItem";
  const digest = await getDigest();

  await Promise.all(
    itemIds.map(async (itemId) => {
      const response = await fetch(
        `${BASE_URL}/_api/web/lists(guid'0353e805-7395-46c1-8767-0ad173f3190b')/items(${itemId})`,
        {
          method: "GET",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`خطا در دریافت اطلاعات آیتم ${itemId}: ${errorText}`);
      }

      const itemData = await response.json();
      const currentRejectVersion = Number(itemData.d.Reject_Version || 0);

      const newRejectVersion = currentRejectVersion + 1;

      const updateBody: any = {
        __metadata: { type: itemType },
        Bank_Confirm: bankConfirm,
        Reject_Version: String(newRejectVersion),
      };

      const updateResponse = await fetch(
        `${BASE_URL}/_api/web/lists(guid'0353e805-7395-46c1-8767-0ad173f3190b')/items(${itemId})`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json;odata=verbose",
            "Content-Type": "application/json;odata=verbose",
            "X-RequestDigest": digest,
            "IF-MATCH": "*",
          },
          credentials: "include",
          body: JSON.stringify(updateBody),
        }
      );

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        throw new Error(`خطا در آپدیت آیتم ${itemId}: ${errorText}`);
      }
    })
  );
}

