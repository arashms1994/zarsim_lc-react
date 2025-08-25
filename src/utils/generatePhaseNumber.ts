import type { ICarryReceipt } from "./type";

export const generatePhaseNumber = (
  existingReceipts: ICarryReceipt[]
): string => {
  const phaseNumbers = existingReceipts
    .filter(
      (receipt) =>
        receipt.Carry_Phase_GUID &&
        receipt.Carry_Phase_GUID.startsWith("مرحله ")
    )
    .map((receipt) => {
      const match = receipt.Carry_Phase_GUID?.match(/مرحله (\d+)/);
      return match ? parseInt(match[1], 10) : 0;
    });

  const maxPhaseNumber =
    phaseNumbers.length > 0 ? Math.max(...phaseNumbers) : 0;
  return `مرحله ${maxPhaseNumber + 1}`;
};
