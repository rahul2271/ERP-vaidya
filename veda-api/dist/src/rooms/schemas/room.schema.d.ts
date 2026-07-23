import { Document, Types } from 'mongoose';
export type RoomDocument = Room & Document;
export declare class Room {
    hospitalId: Types.ObjectId;
    name: string;
    type: string;
    capacity: number;
    equipment: string[];
    status: string;
}
export declare const RoomSchema: import("mongoose").Schema<Room, import("mongoose").Model<Room, any, any, any, any, any, Room>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Room, Document<unknown, {}, Room, {
    id: string;
}, import("mongoose").DefaultSchemaOptions> & Omit<Room & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, "id"> & import("mongoose").HydratedDocumentOverrides<{
    id: string;
}>, {
    hospitalId?: import("mongoose").SchemaDefinitionProperty<Types.ObjectId, Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    name?: import("mongoose").SchemaDefinitionProperty<string, Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    type?: import("mongoose").SchemaDefinitionProperty<string, Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    capacity?: import("mongoose").SchemaDefinitionProperty<number, Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    equipment?: import("mongoose").SchemaDefinitionProperty<string[], Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
    status?: import("mongoose").SchemaDefinitionProperty<string, Room, Document<unknown, {}, Room, {
        id: string;
    }, import("mongoose").DefaultSchemaOptions> & Omit<Room & {
        _id: Types.ObjectId;
    } & {
        __v: number;
    }, "id"> & import("mongoose").HydratedDocumentOverrides<{
        id: string;
    }>> | undefined;
}, Room>;
