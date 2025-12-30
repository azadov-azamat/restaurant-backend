import { PrismaService } from "../prisma/prisma.service";
import { CreateFloorDto } from "./dto/create-floor.dto";
import { UpdateFloorDto } from "./dto/update-floor.dto";
export declare class FloorsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        rooms: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            floorId: string;
            width: number;
            height: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
    })[]>;
    findOne(id: string): Promise<{
        rooms: {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            floorId: string;
            width: number;
            height: number;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
    }>;
    create(dto: CreateFloorDto): import(".prisma/client").Prisma.Prisma__FloorClient<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateFloorDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        level: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
