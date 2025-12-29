"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const jwt_1 = require("@nestjs/jwt");
let WebsocketGateway = class WebsocketGateway {
    constructor(jwtService) {
        this.jwtService = jwtService;
        this.connectedUsers = new Map();
    }
    async handleConnection(client) {
        try {
            const token = client.handshake.auth.token;
            if (!token) {
                client.disconnect();
                return;
            }
            const payload = this.jwtService.verify(token);
            this.connectedUsers.set(client.id, {
                socket: client,
                role: payload.role,
            });
            client.join(`role:${payload.role}`);
            console.log(`Client connected: ${client.id} (${payload.role})`);
        }
        catch (error) {
            client.disconnect();
        }
    }
    handleDisconnect(client) {
        this.connectedUsers.delete(client.id);
        console.log(`Client disconnected: ${client.id}`);
    }
    handleJoinRoom(client, roomId) {
        client.join(`room:${roomId}`);
    }
    handleLeaveRoom(client, roomId) {
        client.leave(`room:${roomId}`);
    }
    emitOrderCreated(order) {
        this.server.emit("order:new", order);
    }
    emitOrderUpdated(order) {
        this.server.emit("order:updated", order);
        this.server.to(`room:${order.roomId}`).emit("order:room:updated", order);
    }
    emitItemStatusChanged(order, itemId, status) {
        this.server.emit("order:item:status", { order, itemId, status });
    }
    emitKitchenNew(order, item) {
        this.server.to("role:CHEF").emit("kitchen:new", { order, item });
    }
    emitKitchenReady(order, item) {
        this.server.to("role:WAITER").emit("kitchen:ready", { order, item });
    }
};
exports.WebsocketGateway = WebsocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], WebsocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)("join:room"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)("leave:room"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], WebsocketGateway.prototype, "handleLeaveRoom", null);
exports.WebsocketGateway = WebsocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: process.env.FRONTEND_URL || "http://localhost:3000",
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], WebsocketGateway);
//# sourceMappingURL=websocket.gateway.js.map