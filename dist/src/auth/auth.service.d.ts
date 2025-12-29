import type { JwtService } from "@nestjs/jwt";
import type { PrismaService } from "../prisma/prisma.service";
import type { LoginDto } from "./dto/login.dto";
export declare class AuthService {
    private prisma;
    private jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            username: string;
            name: string;
            role: import(".prisma/client").$Enums.UserRole;
            photo: string | null;
        };
    }>;
    validateUser(userId: string): Promise<{
        id: string;
        username: string;
        name: string;
        role: import(".prisma/client").$Enums.UserRole;
        photo: string | null;
    } | null>;
}
