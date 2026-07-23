import { Model } from 'mongoose';
import { Room } from './schemas/room.schema';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
export declare class RoomsService {
    private roomModel;
    constructor(roomModel: Model<Room>);
    create(createRoomDto: CreateRoomDto): Promise<import("mongoose").Document<unknown, {}, Room, {}, import("mongoose").DefaultSchemaOptions> & Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(): Promise<(import("mongoose").Document<unknown, {}, Room, {}, import("mongoose").DefaultSchemaOptions> & Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOne(id: string): Promise<import("mongoose").Document<unknown, {}, Room, {}, import("mongoose").DefaultSchemaOptions> & Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, updateRoomDto: UpdateRoomDto): Promise<(import("mongoose").Document<unknown, {}, Room, {}, import("mongoose").DefaultSchemaOptions> & Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, Room, {}, import("mongoose").DefaultSchemaOptions> & Room & {
        _id: import("mongoose").Types.ObjectId;
    } & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
