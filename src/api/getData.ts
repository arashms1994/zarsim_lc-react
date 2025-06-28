import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "./base";

async function fetcher(url: string) {
  const res = await fetch(url, {
    headers: { Accept: "application/json;odata=verbose" },
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

export function useOpenningListItems() {
  return useQuery({
    queryKey: ["openningListItems"],
    queryFn: async () => {
      const listTitle = "LC_Openning";

      const metadataData = await fetcher(
        `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')`
      );
      const entityType = metadataData.d.ListItemEntityTypeFullName;

      const itemsData = await fetcher(
        `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')/items`
      );

      return {
        entityType,
        items: itemsData.d.results,
      };
    },
  });
}

export function useCustomerFactor(factorNumber: string) {
  return useQuery({
    queryKey: ["customerFactor", factorNumber],
    queryFn: async () => {
      const listTitle = "customer_factor";

      const itemData = await fetcher(
        `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')/items?$filter=Title eq '${factorNumber}'`
      );

      return itemData.d.results.at(0);
    },
    enabled: !!factorNumber,
  });
}

export function useCustomerFactorDetails(factorNumber: string) {
  return useQuery({
    queryKey: ["customerFactorDetails", factorNumber],
    queryFn: async () => {
      const listTitle = "detail_customer_factor";
      let allResults: unknown[] = [];
      let nextUrl = `${BASE_URL}/_api/web/lists/getbytitle('${listTitle}')/items?$filter=OrderNumber eq '${factorNumber}'`;

      while (nextUrl) {
        const data = await fetcher(nextUrl);
        allResults = [...allResults, ...data.d.results];
        nextUrl = data.d.__next || null;
      }

      return allResults;
    },
    enabled: !!factorNumber,
  });
}
