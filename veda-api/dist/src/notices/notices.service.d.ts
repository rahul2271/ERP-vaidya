import { Model } from 'mongoose';
import { Notice, NoticeDocument } from './schemas/notice.schema';
export declare class NoticesService {
    private noticeModel;
    constructor(noticeModel: Model<NoticeDocument>);
    create(createDto: any, user: any): Promise<import("mongoose").Document<unknown, {}, NoticeDocument, {}, import("mongoose").DefaultSchemaOptions> & Notice & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(user: any): Promise<(import("mongoose").Document<unknown, {}, NoticeDocument, {}, import("mongoose").DefaultSchemaOptions> & Notice & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateStatus(id: string, status: string, hospitalId: string): Promise<import("mongoose").Document<unknown, {}, NoticeDocument, {}, import("mongoose").DefaultSchemaOptions> & Notice & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string, hospitalId: string): Promise<{
        success: boolean;
        message: string;
    }>;
}
