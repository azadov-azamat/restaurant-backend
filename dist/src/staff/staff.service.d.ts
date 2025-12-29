import type { PrismaService } from "../prisma/prisma.service";
import type { CreateStaffDto } from "./dto/create-staff.dto";
import type { UpdateStaffDto } from "./dto/update-staff.dto";
import type { UserRole } from "@prisma/client";
export declare class StaffService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(role?: UserRole): Promise<{
        id: string;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        photo: string | null;
        phone: string | null;
        createdAt: Date;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        photo: string | null;
        phone: string | null;
        createdAt: Date;
    }>;
    create(dto: CreateStaffDto, allowedRoles?: UserRole[]): Promise<{
        id: string;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        photo: string | null;
        phone: string | null;
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateStaffDto): Promise<{
        id: string;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        photo: string | null;
        phone: string | null;
        createdAt: Date;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
