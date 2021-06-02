import { Processor, Process } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';

@Processor('jobs.queue')
export class TasksProcessor {

    private readonly logger = new Logger(TasksProcessor.name);
    
    @Process()
    onActive(job: Job<unknown>) {
        this.logger.debug(job.id)
        this.logger.debug(job.name)
        this.logger.debug(job.data)
    }
}
