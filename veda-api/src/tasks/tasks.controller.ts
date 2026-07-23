import { Controller, Get, Post, Body, Patch, Param, Delete, Request, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body('text') text: string, @Request() req) {
    // req.user comes from your JWT token automatically
    return this.tasksService.create(text, req.user.userId);
  }

  @Get()
  findAll(@Request() req) {
    return this.tasksService.findAllForDoctor(req.user.userId);
  }

  @Patch(':id/toggle')
  toggleStatus(@Param('id') id: string) {
    return this.tasksService.toggleStatus(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }
}