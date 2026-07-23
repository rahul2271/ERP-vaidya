import { NoticesService } from './notices.service';
export declare class NoticesController {
    private readonly noticesService;
    constructor(noticesService: NoticesService);
    create(createNoticeDto: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/notice.schema").NoticeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/notice.schema").Notice & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/notice.schema").NoticeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/notice.schema").Notice & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    updateStatus(id: string, status: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/notice.schema").NoticeDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/notice.schema").Notice & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    remove(id: string, req: any): Promise<{
        success: boolean;
        message: string;
    }>;
}
