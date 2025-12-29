import { Controller, Post, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import type { AuthService } from "./auth.service";
import type { LoginDto } from "./dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  login(dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get("me")
  @UseGuards(AuthGuard("jwt"))
  me(user: any) {
    return user;
  }
}
