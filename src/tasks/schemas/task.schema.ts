import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
export class Task {
    
    @Prop({ required: true })
    webhook: string;

    @Prop({ required: true })
    ttl: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
