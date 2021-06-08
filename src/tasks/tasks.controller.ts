import { Controller, Post, Logger, HttpCode, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(private readonly tasksService: TasksService) {}

  @Post()
  @HttpCode(202)
  @UseGuards(AuthGuard('local'))
  create(createTaskDto: CreateTaskDto): Promise<void> {
    return this.tasksService
      .create(createTaskDto)
      .then(() =>
        this.logger.log(`New task scheduled: ${JSON.stringify(createTaskDto)}`),
      );
  }
}
