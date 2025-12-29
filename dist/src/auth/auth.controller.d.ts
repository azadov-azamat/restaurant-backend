import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
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
    me(user: any): any;
}
