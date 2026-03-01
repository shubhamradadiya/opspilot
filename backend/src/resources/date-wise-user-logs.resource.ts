import { Expose, Transform, Type } from 'class-transformer';
import { UserLog } from 'src/api/attendance/entity/user-logs.entity';
import { dateToTimestampWithoutUTC } from 'src/helpers/date-format.helper';

export class DateWiseUserLogs {
  @Expose()
  @Transform(({ value }) => (value ? dateToTimestampWithoutUTC(value) : null))
  date: Date;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalSeconds: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalMinutes: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalHours: number;

  @Expose()
  @Type(() => UserLog)
  logs: UserLog[];
}
