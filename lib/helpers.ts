export const generateRandomNumber = (digits: number = 6): string =>
  Math.floor(Math.random() * 10 ** digits)
    .toString()
    .padStart(digits, "0");
