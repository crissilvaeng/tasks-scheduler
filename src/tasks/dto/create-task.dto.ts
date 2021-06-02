import { IsUrl, Min } from 'class-validator';
import * as moment from 'moment';

export class CreateTaskDto {

    @IsUrl({ require_tld: false })
    webhook: string;

    @Min(moment().unix())
    ttl: number;
}
