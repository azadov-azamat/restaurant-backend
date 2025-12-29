import { MenuService } from "./menu.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
export declare class MenuController {
    private menuService;
    constructor(menuService: MenuService);
    findAll(categoryId?: string, inStock?: string): import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            color: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.MenuItemType;
        quantity: number | null;
        price: number;
        description: string | null;
        image: string | null;
        categoryId: string;
        requiresKitchen: boolean;
        inStock: boolean;
    })[]>;
    findOne(id: string): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            color: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.MenuItemType;
        quantity: number | null;
        price: number;
        description: string | null;
        image: string | null;
        categoryId: string;
        requiresKitchen: boolean;
        inStock: boolean;
    }>;
    create(dto: CreateMenuItemDto): import(".prisma/client").Prisma.Prisma__MenuItemClient<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            color: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.MenuItemType;
        quantity: number | null;
        price: number;
        description: string | null;
        image: string | null;
        categoryId: string;
        requiresKitchen: boolean;
        inStock: boolean;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateMenuItemDto): Promise<{
        category: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            color: string;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        type: import(".prisma/client").$Enums.MenuItemType;
        quantity: number | null;
        price: number;
        description: string | null;
        image: string | null;
        categoryId: string;
        requiresKitchen: boolean;
        inStock: boolean;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
