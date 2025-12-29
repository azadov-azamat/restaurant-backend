import { type OnGatewayConnection, type OnGatewayDisconnect } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { OrderItemStatus } from "@prisma/client";
export declare class WebsocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private jwtService;
    server: Server;
    private connectedUsers;
    constructor(jwtService: JwtService);
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleJoinRoom(client: Socket, roomId: string): void;
    handleLeaveRoom(client: Socket, roomId: string): void;
    emitOrderCreated(order: any): void;
    emitOrderUpdated(order: any): void;
    emitItemStatusChanged(order: any, itemId: string, status: OrderItemStatus): void;
    emitKitchenNew(order: any, item: any): void;
    emitKitchenReady(order: any, item: any): void;
}
