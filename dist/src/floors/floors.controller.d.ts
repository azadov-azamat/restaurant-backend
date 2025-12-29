import { FloorsService } from "./floors.service";
import { CreateFloorDto } from "./dto/create-floor.dto";
import { UpdateFloorDto } from "./dto/update-floor.dto";
export declare class FloorsController {
    private floorsService;
    constructor(floorsService: FloorsService);
    findAll(): import(".prisma/client").Prisma.PrismaPromise<({
        rooms: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            floorId: string;
            width: number;
            height: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        level: number;
    })[]>;
    findOne(id: string): Promise<{
        rooms: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            floorId: string;
            width: number;
            height: number;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        level: number;
    }>;
    create(dto: CreateFloorDto): import(".prisma/client").Prisma.Prisma__FloorClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        level: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, dto: UpdateFloorDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        level: number;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
