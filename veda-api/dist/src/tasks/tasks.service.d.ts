import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
export declare class TasksService {
    private taskModel;
    constructor(taskModel: Model<Task>);
    create(text: string, doctorId: string): Promise<import("mongoose").Document<unknown, {}, Task, {}, import("mongoose").DefaultSchemaOptions> & Task & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }>;
    findAllForDoctor(doctorId: string): Promise<(import("mongoose").Document<unknown, {}, Task, {}, import("mongoose").DefaultSchemaOptions> & Task & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    })[]>;
    toggleStatus(taskId: string): Promise<(import("mongoose").Document<unknown, {}, Task, {}, import("mongoose").DefaultSchemaOptions> & Task & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
    remove(taskId: string): Promise<(import("mongoose").Document<unknown, {}, Task, {}, import("mongoose").DefaultSchemaOptions> & Task & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    } & {
        id: string;
    }) | null>;
}
