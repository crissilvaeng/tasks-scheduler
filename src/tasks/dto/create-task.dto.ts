import { IsUrl, Min } from 'class-validator';
import * as moment from 'moment';

export class CreateTaskDto {
  @IsUrl({ require_tld: false })
  readonly webhook: string;

  @Min(moment().valueOf())
  readonly ttl: number;
}
