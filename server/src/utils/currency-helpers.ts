import { Currency } from "../lib/types.js";

export const getCurrencySymbol = (currency: Currency): string => {
  switch (currency) {
    case "GBP":
      return "£";
    case "USD":
      return "$";
    case "CAD":
      return "$";
    case "EUR":
      return "€";
    default:
      return "£";
  }
};

export const getCurrencyCode = (currency: Currency): string => {
  return currency;
};