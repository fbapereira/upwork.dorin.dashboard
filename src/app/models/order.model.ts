/**
 * Order basic
 * The fields orderId, ProductName, orderDate and shippingDate are coming from the client integration
 */
export interface Order {
    orderId: string;
    productName: string;
    orderDate: Date;
    shippingDate: Date;
    name?: string;
    street?: string;
    city?: string;
    mobile?: string;
    status?: any;
    shippingPrice?: string;
    shippingCity?: string;
    shippingStreet?: string;
    shippingNumber?: string;
    comment?: string;
    isShipped?: boolean;
    isInvoiceMade?: boolean;
}