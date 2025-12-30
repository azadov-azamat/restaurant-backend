import { MenuService } from "./menu.service";
import { CreateMenuItemDto } from "./dto/create-menu-item.dto";
import { UpdateMenuItemDto } from "./dto/update-menu-item.dto";
export declare class MenuController {
    private menuService;
    constructor(menuService: MenuService);
    findAll(categoryId?: string, inStock?: string): import(".prisma/client").Prisma.PrismaPromise<({
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MenuItemType;
        description: string | null;
        price: number;
        image: string | null;
        categoryId: string;
        requiresKitchen: boolean;
        inStock: boolean;
        quantity: number | null;
    })[]>;
    findOne(id: string): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MenuItemType;
        description: string | null;
        price: number;
        image: string | null;
        categoryId: string;
        requiresKitchen: boolean;
        inStock: boolean;
        quantity: number | null;
    }>;
    create(dto: CreateMenuItemDto): import(".prisma/client").Prisma.Prisma__MenuItemClient<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MenuItemType;
        description: string | null;
        price: number;
        image: string | null;
        categoryId: string;
        requiresKitchen: boolean;
        inStock: boolean;
        quantity: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateMenuItemDto): Promise<{
        category: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            color: string;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        type: import(".prisma/client").$Enums.MenuItemType;
        description: string | null;
        price: number;
        image: string | null;
        categoryId: string;
        requiresKitchen: boolean;
        inStock: boolean;
        quantity: number | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
