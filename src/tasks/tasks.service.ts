import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';

@Injectable()
export class TasksService {

  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) { }

  create(createTaskDto: CreateTaskDto): Promise<Task> {
    const task = new this.taskModel(createTaskDto); 
    return task.save();
  }

  findAll(): Promise<Task[]|null>  {
    return this.taskModel.find({}).exec();
  }

  findOne(id: string): Promise<Task|null> {
    return this.taskModel.findById(id).exec();
  }

  update(id: string, updateTaskDto: UpdateTaskDto) {
    return `This action updates a #${id} task`;
  }

  remove(id: string) {
    return `This action removes a #${id} task`;
  }
}
