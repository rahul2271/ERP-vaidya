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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const chat_service_1 = require("./chat.service");
let ChatGateway = class ChatGateway {
    chatService;
    server;
    constructor(chatService) {
        this.chatService = chatService;
    }
    handleConnection(client) { }
    handleDisconnect(client) { }
    async handleRegister(client, payload) {
        if (!payload.userId)
            return;
        client.join('GLOBAL');
        client.join(payload.role);
        client.join(payload.userId);
        const history = await this.chatService.getChatHistory(payload.userId, payload.role);
        client.emit('chatHistory', history);
    }
    async handleMessage(payload) {
        const savedMsg = await this.chatService.saveMessage(payload.senderId, payload.senderName, payload.senderRole, payload.text, payload.channelId);
        const messageToSend = {
            _id: savedMsg._id,
            senderId: savedMsg.senderId,
            senderName: savedMsg.senderName,
            senderRole: savedMsg.senderRole,
            text: savedMsg.text,
            channelId: savedMsg.channelId,
            createdAt: savedMsg.createdAt || new Date(),
        };
        this.server.to(payload.channelId).emit('newMessage', messageToSend);
        const isDM = !['GLOBAL', 'DOCTOR', 'RECEPTIONIST', 'SUPER_ADMIN', 'ADMIN'].includes(payload.channelId);
        if (isDM && payload.senderId !== payload.channelId) {
            this.server.to(payload.senderId).emit('newMessage', messageToSend);
        }
    }
};
exports.ChatGateway = ChatGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], ChatGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('register'),
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __param(1, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleRegister", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('sendMessage'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ChatGateway.prototype, "handleMessage", null);
exports.ChatGateway = ChatGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({ cors: { origin: '*' } }),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatGateway);
//# sourceMappingURL=chat.gateway.js.map