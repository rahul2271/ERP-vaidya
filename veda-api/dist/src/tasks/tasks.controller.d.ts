import { TasksService } from './tasks.service';
export declare class TasksController {
    private readonly tasksService;
    constructor(tasksService: TasksService);
    create(text: string, req: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/task.schema").Task, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/task.schema").Task & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAll(req: any): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/task.schema").Task, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/task.schema").Task & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    toggleStatus(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/task.schema").Task, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/task.schema").Task & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(id: string): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/task.schema").Task, {}, import("mongoose").DefaultSchemaOptions> & import("./schemas/task.schema").Task & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
