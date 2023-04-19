import ICurrency from "../models/ICurrency.js";

const generateAccountNumber = (): string => {
    let accountNumber = '';
    const possibleDigits = '0123456789';

    for (let i = 0; i < 4; i++) {
        accountNumber += possibleDigits.charAt(Math.floor(Math.random() * possibleDigits.length));
    }

    for (let i = 0; i < 12; i++) {
        accountNumber += possibleDigits.charAt(Math.floor(Math.random() * possibleDigits.length));
    }

    return accountNumber;
}

export const exchangeMoney = (baseCurrency: string, targetCurrency: string, amount: number, data: ICurrency[]): number => {
    const baseRate = baseCurrency === "CZK" ? 1 : data.find((currency) => currency.name === baseCurrency)?.rate;
    const targetRate = targetCurrency === "CZK" ? 1 : data.find((currency) => currency.name === targetCurrency)?.rate;

    if (!baseRate || !targetRate) {
        throw new Error("Unsupported currency");
    }

    return (amount / targetRate) * baseRate;
}

export default generateAccountNumber;