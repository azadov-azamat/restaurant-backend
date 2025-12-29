import { MenuItemType } from "@prisma/client";
export declare class CreateMenuItemDto {
    name: string;
    description?: string;
    price: number;
    image?: string;
    type?: MenuItemType;
    categoryId: string;
    requiresKitchen?: boolean;
    inStock?: boolean;
    quantity?: number;
}
