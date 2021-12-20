export interface SmartBillClient {
    name?: string;
    address?: string;
    isTaxPayer: boolean;
    city?: string;
    county?: string;
    country: string;
    saveToDb: boolean;
}

export interface SmartBillPayment {
    value?: number;
    type?: string;
    isCash: boolean;
}

export interface SmartBill {
    companyVatCode?: string;
    client: SmartBillClient;
    isDraft: boolean;
    seriesName: string;
    currency: string;
    language: string;
    dueDate?: string;
    products: SmartBillProduct[];
    payment: SmartBillPayment;
}

export interface SmartBillProduct {
    name?: string;
    code: string;
    productDescription: string;
    isDiscount: boolean;
    measuringUnitName: string;
    currency: string;
    quantity: number;
    price?: number;
    isTaxIncluded: boolean;
    taxName: string;
    taxPercentage: number;
    isService: boolean;
}
