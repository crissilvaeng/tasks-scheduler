import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { Job } from 'bull';

@Injectable()
export class TasksService {

  constructor(@InjectQueue('jobs.queue') private jobsQueue: Queue) { }

  create(createTaskDto: CreateTaskDto): Promise<Job<CreateTaskDto>> {
    return this.jobsQueue.add(createTaskDto)
  }
}
