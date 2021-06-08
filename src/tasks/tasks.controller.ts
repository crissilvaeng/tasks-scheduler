import {
  Controller,
  Post,
  Body,
  Headers,
  Logger,
  HttpCode,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { AuthService } from './auth.service';

@Controller()
export class TasksController {
  private readonly logger = new Logger(TasksController.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  @HttpCode(202)
  create(
    @Headers('X-API-Key') apiKey,
    @Headers('X-API-Secret') apiSecret,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<void> {
    return this.authService
      .validate(apiKey, apiSecret)
      .then(() => this.tasksService.create(createTaskDto))
      .then(() =>
        this.logger.log(`New task scheduled: ${JSON.stringify(createTaskDto)}`),
      );
  }
}
