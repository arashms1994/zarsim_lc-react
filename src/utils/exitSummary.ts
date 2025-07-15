export function calculateExitSummary(exitRequests: any[]) {
  let totalMetraj = 0;
  let totalMablagh = 0;

  exitRequests.forEach((item) => {
    const metraj = parseFloat(
      (item.metrajdarkhast || "0").replace(/\s/g, "")
    );
    const mablagh = parseFloat(
      (item.date_k || "0").replace(/,/g, "").replace(/\s/g, "")
    );
    totalMetraj += isNaN(metraj) ? 0 : metraj;
    totalMablagh += isNaN(mablagh) ? 0 : mablagh;
  });

  return {
    totalMetraj,
    totalMablagh,
  };
}

export function formatRial(amount: number) {
  return amount.toLocaleString("fa-IR");
}