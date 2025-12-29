import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { StaffModule } from "./staff/staff.module";
import { FloorsModule } from "./floors/floors.module";
import { RoomsModule } from "./rooms/rooms.module";
import { CategoriesModule } from "./categories/categories.module";
import { MenuModule } from "./menu/menu.module";
import { OrdersModule } from "./orders/orders.module";
import { WebsocketModule } from "./websocket/websocket.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    StaffModule,
    FloorsModule,
    RoomsModule,
    CategoriesModule,
    MenuModule,
    OrdersModule,
    WebsocketModule,
  ],
})
export class AppModule {}
