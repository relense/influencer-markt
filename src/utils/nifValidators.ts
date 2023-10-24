const validatePortugueseNIF = (nif: string): boolean => {
  if (nif.length !== 9 || isNaN(Number(nif))) {
    return false;
  }

  const nifNumbers: number[] = nif.split("").map(Number);
  const weights: number[] = [9, 8, 7, 6, 5, 4, 3, 2, 1];
  const total: number = nifNumbers
    .slice(0, 8)
    .reduce((acc, digit, index) => acc + digit * weights[index]!, 0);
  const modulo11: number = total % 11;
  const checkDigit: number = modulo11 < 2 ? 0 : 11 - modulo11;

  return checkDigit === nifNumbers[8];
};

export const nifValidator = { validatePortugueseNIF };
