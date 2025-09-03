import type { ICarryReceipt, ICustomer } from "./../utils/type";
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./base";

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

export async function getCarryReceipts(
  factorNumber: string
): Promise<ICarryReceipt[]> {
  const listTitle = "LC_carry_receipt";
  let allResults: ICarryReceipt[] = [];
  let nextUrl = `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')/items?$filter=Order_Number eq '${factorNumber}'&$orderby=ID desc`;

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
    refetchInterval: 3000,
  });
}

export function useCarryReceipts(faktorNumber: string) {
  return useQuery<ICarryReceipt[], Error>({
    queryKey: ["customerFactorDetails", faktorNumber],
    queryFn: () => getCarryReceipts(faktorNumber),
    refetchInterval: 3000,
    enabled: !!faktorNumber,
  });
}
