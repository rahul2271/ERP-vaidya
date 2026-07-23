import { BlogService } from './blog.service';
export declare class BlogController {
    private readonly blogService;
    constructor(blogService: BlogService);
    findPublished(tag?: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/blog-post.schema").BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blog-post.schema").BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findBySlug(slug: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/blog-post.schema").BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blog-post.schema").BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllForAdmin(): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/blog-post.schema").BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blog-post.schema").BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    findOneForAdmin(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/blog-post.schema").BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blog-post.schema").BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    create(dto: any, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/blog-post.schema").BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blog-post.schema").BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    update(id: string, dto: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/blog-post.schema").BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blog-post.schema").BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/blog-post.schema").BlogPostDocument, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/blog-post.schema").BlogPost & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
}
