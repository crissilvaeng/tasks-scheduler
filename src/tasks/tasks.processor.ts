import { Job } from 'bull';
import { Processor, Process } from '@nestjs/bull';
import { Task } from './interfaces/task.interface';
import { Logger, HttpService } from '@nestjs/common';

@Processor('jobs.queue')
export class TasksProcessor {

  private readonly logger = new Logger(TasksProcessor.name);

  constructor(private httpService: HttpService) {}

  @Process()
  invokeWebhook(job: Job<Task>): Promise<void> {
    this.logger.debug(
      `Processing job #${job.id} with payload ${JSON.stringify(job.data)}.`,
    );
    return this.httpService
      .get(job.data.webhook)
      .toPromise()
      .then(() =>
        this.logger.log(
          `Webhook invoked with success! Webhook: ${job.data.webhook}`,
        ),
      )
      .catch((error: Error) =>
        this.logger.error(
          `Failed during webhook invocation. Error: ${error.message}`,
          error.stack,
        ),
      );
  }
}
