import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsController {
    private readonly roomsService;
    constructor(roomsService: RoomsService);
    create(createRoomDto: CreateRoomDto, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/room.schema").Room, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/room.schema").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/room.schema").Room, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/room.schema").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/room.schema").Room, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/room.schema").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/room.schema").Room, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/room.schema").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/room.schema").Room, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/room.schema").Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
