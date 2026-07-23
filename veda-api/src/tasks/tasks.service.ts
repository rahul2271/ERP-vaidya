import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

  async create(text: string, doctorId: string) {
    return this.taskModel.create({ text, doctorId });
  }

  async findAllForDoctor(doctorId: string) {
    return this.taskModel.find({ doctorId }).sort({ createdAt: -1 }).exec();
  }

  async toggleStatus(taskId: string) {
    const task = await this.taskModel.findById(taskId);
    if (!task) return null;
    task.done = !task.done;
    return task.save();
  }

  async remove(taskId: string) {
    return this.taskModel.findByIdAndDelete(taskId);
  }
}