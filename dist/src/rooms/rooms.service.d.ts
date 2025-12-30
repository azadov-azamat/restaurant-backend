import { PrismaService } from "../prisma/prisma.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { UpdateElementsDto } from "./dto/update-elements.dto";
export declare class RoomsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(floorId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        floor: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            level: number;
        };
        elements: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.ElementType;
            width: number;
            height: number;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
            roomId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        floorId: string;
        width: number;
        height: number;
    })[]>;
    findOne(id: string): Promise<{
        floor: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            level: number;
        };
        elements: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.ElementType;
            width: number;
            height: number;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
            roomId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        floorId: string;
        width: number;
        height: number;
    }>;
    create(dto: CreateRoomDto): import(".prisma/client").Prisma.Prisma__RoomClient<{
        floor: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            level: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        floorId: string;
        width: number;
        height: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateRoomDto): Promise<{
        floor: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            level: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        floorId: string;
        width: number;
        height: number;
    }>;
    updateElements(id: string, dto: UpdateElementsDto): Promise<{
        floor: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            level: number;
        };
        elements: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            type: import(".prisma/client").$Enums.ElementType;
            width: number;
            height: number;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
            roomId: string;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        floorId: string;
        width: number;
        height: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
