declare class OrderItemDto {
    menuItemId: string;
    quantity: number;
    note?: string;
}
export declare class AddItemsDto {
    items: OrderItemDto[];
}
export {};
