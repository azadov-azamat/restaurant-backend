import { UserRole } from "@prisma/client";
import { StaffService } from "./staff.service";
import { CreateStaffDto } from "./dto/create-staff.dto";
import { UpdateStaffDto } from "./dto/update-staff.dto";
export declare class StaffController {
    private staffService;
    constructor(staffService: StaffService);
    findAll(role?: UserRole): Promise<{
        id: string;
        createdAt: Date;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        photo: string | null;
        phone: string | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        createdAt: Date;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        photo: string | null;
        phone: string | null;
    }>;
    create(dto: CreateStaffDto, user: any): Promise<{
        id: string;
        createdAt: Date;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        photo: string | null;
        phone: string | null;
    }>;
    update(id: string, dto: UpdateStaffDto): Promise<{
        id: string;
        createdAt: Date;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        photo: string | null;
        phone: string | null;
    }>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
