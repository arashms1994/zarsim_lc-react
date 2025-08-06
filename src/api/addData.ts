import { getDigest } from "@/utils/getDigest";
import type { ICarryReceipt, ICustomerFactorUpdate } from "@/utils/type";
import { BASE_URL } from "./base";

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
