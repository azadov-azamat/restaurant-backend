import { UserRole } from "@prisma/client";
export declare class CreateStaffDto {
    username: string;
    password: string;
    name: string;
    role: UserRole;
    photo?: string;
    phone?: string;
}
