import type { ICustomer } from "./../utils/type";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./base";
import type { IProduct } from "@/utils/type";

export async function getOpenningListItems() {
  const listTitle = "LC_Openning";

  const metadataRes = await fetch(
    `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')`,
    {
      method: "GET",
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  );

  if (!metadataRes.ok) {
    const err = await metadataRes.text();
    throw new Error("خطا در گرفتن metadata لیست: " + err);
  }

  const metadataData = await metadataRes.json();
  const entityType = metadataData.d.ListItemEntityTypeFullName;
  console.log("Entity Type:", entityType);

  const itemsRes = await fetch(
    `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')/items`,
    {
      method: "GET",
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  );

  if (!itemsRes.ok) {
    const err = await itemsRes.text();
    throw new Error("خطا در گرفتن آیتم‌ها: " + err);
  }

  const itemsData = await itemsRes.json();
  console.log("آیتم‌ها:", itemsData.d.results);

  return {
    entityType,
    items: itemsData.d.results,
  };
}

export async function getCustomerFactor(
  factorNumber: string
): Promise<ICustomer> {
  const listTitle = "customer_factor";

  const itemsRes = await fetch(
    `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')/items?$filter=Title eq '${factorNumber}'`,
    {
      method: "GET",
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  );

  if (!itemsRes.ok) {
    const err = await itemsRes.text();
    throw new Error("خطا در گرفتن آیتم‌ها: " + err);
  }

  const itemData = await itemsRes.json();

  return itemData.d.results.at(0) as ICustomer;
}

export async function getCustomerFactorDetails(
  factorNumber: string
): Promise<IProduct[]> {
  const listTitle = "detail_customer_factor";
  let allResults: IProduct[] = [];
  let nextUrl = `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')/items?$filter=OrderNumber eq '${factorNumber}'`;

  try {
    while (nextUrl) {
      const response: Response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          Accept: "application/json;odata=verbose",
        },
      });

      if (!response.ok) {
        const err = await response.text();
        throw new Error("خطا در گرفتن جزئیات محصولات: " + err);
      }

      const data = await response.json();

      allResults = [...allResults, ...data.d.results];

      nextUrl = data.d.__next || null;
    }

    return allResults;
  } catch (err) {
    console.error("خطا در دریافت آیتم‌ها:", err);
    return [];
  }
}

export function useCustomerFactor(faktorNumber: string) {
  return useQuery<ICustomer, Error>({
    queryKey: ["customerFactor", faktorNumber],
    queryFn: () => getCustomerFactor(faktorNumber),
    enabled: !!faktorNumber,
  });
}

export function useCustomerFactorDetails(faktorNumber: string) {
  return useQuery<IProduct[], Error>({
    queryKey: ["customerFactorDetails", faktorNumber],
    queryFn: () => getCustomerFactorDetails(faktorNumber),
    enabled: !!faktorNumber,
  });
}

export async function getLCNumberAndTotalPrice(
  faktorNumber: string
): Promise<{ LCNumber: string | null; TotalPrice: string | null } | null> {
  const listName = "LC_Openning";

  const response = await fetch(
    `${BASE_URL}/_api/web/lists/getbytitle('${listName}')/items?$select=LC_Number,Total_Price&$filter=Title eq '${faktorNumber}'`,
    {
      method: "GET",
      headers: {
        Accept: "application/json;odata=verbose",
      },
    }
  );

  if (!response.ok) {
    console.error(
      "خطا در دریافت اطلاعات LC_Number و Total_Price:",
      await response.text()
    );
    return null;
  }

  const data = await response.json();
  const items = data.d.results;

  if (items.length === 0) {
    console.warn("هیچ آیتمی با این فاکتور پیدا نشد.");
    return null;
  }

  const item = items[0];
  return {
    LCNumber: item.LC_Number || null,
    TotalPrice: item.Total_Price || null,
  };
}

export async function getExitRequestsByOrderNumber(faktorNumber: string) {
  const listTitle = "ExitRequest";
  let allResults: unknown[] = [];

  let nextUrl:
    | string
    | null = `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')/items?$filter=OrderNumber eq '${faktorNumber}'`;
  try {
    while (nextUrl) {
      const response: Response = await fetch(nextUrl, {
        method: "GET",
        headers: {
          Accept: "application/json;odata=verbose",
        },
      });

      if (!response.ok) {
        throw new Error(`خطا در دریافت داده‌ها: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data.d || !data.d.results) {
        break;
      }

      allResults = [...allResults, ...data.d.results];

      if (data.d.__next) {
        nextUrl = data.d.__next.startsWith("http")
          ? data.d.__next
          : `${BASE_URL}${data.d.__next}`;
      } else {
        nextUrl = null;
      }
    }

    return allResults;
  } catch (err) {
    console.error("خطا در دریافت آیتم‌های ExitRequest:", err);
    return [];
  }
}

export function useLCNumberAndTotalPrice(faktorNumber: string) {
  return useQuery({
    queryKey: ["LCNumberAndTotalPrice", faktorNumber],
    queryFn: () => getLCNumberAndTotalPrice(faktorNumber),
    enabled: !!faktorNumber,
  });
}

export function useExitRequestsByOrderNumber(faktorNumber: string) {
  return useQuery({
    queryKey: ["exitRequestsByOrderNumber", faktorNumber],
    queryFn: () => getExitRequestsByOrderNumber(faktorNumber),
    enabled: !!faktorNumber,
  });
}
