import { UserRole } from "@prisma/client";
import type { StaffService } from "./staff.service";
import type { CreateStaffDto } from "./dto/create-staff.dto";
import type { UpdateStaffDto } from "./dto/update-staff.dto";
export declare class StaffController {
    private staffService;
    constructor(staffService: StaffService);
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
    create(dto: CreateStaffDto, user: any): Promise<{
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
