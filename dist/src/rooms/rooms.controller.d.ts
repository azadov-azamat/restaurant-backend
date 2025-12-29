import { RoomsService } from "./rooms.service";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { UpdateElementsDto } from "./dto/update-elements.dto";
export declare class RoomsController {
    private roomsService;
    constructor(roomsService: RoomsService);
    findAll(floorId?: string): import(".prisma/client").Prisma.PrismaPromise<({
        floor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            level: number;
        };
        elements: {
            id: string;
            roomId: string;
            createdAt: Date;
            updatedAt: Date;
            width: number;
            height: number;
            type: import(".prisma/client").$Enums.ElementType;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        floorId: string;
        width: number;
        height: number;
    })[]>;
    findOne(id: string): Promise<{
        floor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            level: number;
        };
        elements: {
            id: string;
            roomId: string;
            createdAt: Date;
            updatedAt: Date;
            width: number;
            height: number;
            type: import(".prisma/client").$Enums.ElementType;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        floorId: string;
        width: number;
        height: number;
    }>;
    create(dto: CreateRoomDto): import(".prisma/client").Prisma.Prisma__RoomClient<{
        floor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            level: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        floorId: string;
        width: number;
        height: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateRoomDto): Promise<{
        floor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            level: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        floorId: string;
        width: number;
        height: number;
    }>;
    updateElements(id: string, dto: UpdateElementsDto): Promise<{
        floor: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            level: number;
        };
        elements: {
            id: string;
            roomId: string;
            createdAt: Date;
            updatedAt: Date;
            width: number;
            height: number;
            type: import(".prisma/client").$Enums.ElementType;
            x: number;
            y: number;
            rotation: number;
            tableCode: string | null;
            seats: number | null;
            isRound: boolean;
            swingDirection: string | null;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        floorId: string;
        width: number;
        height: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
