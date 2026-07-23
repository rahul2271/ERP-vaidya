import { Model } from 'mongoose';
import { BlogPost, BlogPostDocument } from './schemas/blog-post.schema';
export declare class BlogService {
    private blogModel;
    constructor(blogModel: Model<BlogPostDocument>);
    private slugify;
    findPublished(tag?: string): Promise<(import("mongoose").Document<unknown, {}, BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findBySlugPublic(slug: string): Promise<import("mongoose").Document<unknown, {}, BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllForAdmin(): Promise<(import("mongoose").Document<unknown, {}, BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOneForAdmin(id: string): Promise<import("mongoose").Document<unknown, {}, BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    create(dto: any, authorName: string, authorId: string): Promise<import("mongoose").Document<unknown, {}, BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: any): Promise<(import("mongoose").Document<unknown, {}, BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
