import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class TasksService {

  constructor(
    @InjectQueue('jobs.queue') private jobsQueue: Queue,
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new this.taskModel(createTaskDto);
    return this.jobsQueue.add(createTaskDto)
      .then(() => task.save())
  }

  findAll(): Promise<Task[]|null>  {
    return this.taskModel.find({}).exec();
  }

  findOne(id: string): Promise<Task|null> {
    return this.taskModel.findById(id).exec();
  }
}
