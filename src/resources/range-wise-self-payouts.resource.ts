import { Expose, Transform, Type } from 'class-transformer';
import { UserLog } from 'src/api/attendance/entity/user-logs.entity';
import { dateToTimestampWithoutUTC } from 'src/helpers/date-format.helper';

export class RangeWiseSelfPayoutsResource {
  @Expose()
  weekRange: string;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestampWithoutUTC(value) : null))
  weekStartDate: Date;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestampWithoutUTC(value) : null))
  weekEndDate: Date;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  durationInHours: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  durationInMinutes: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  durationInSeconds: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  perHourRate: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  loanAmount: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalAmount: number;

  @Expose()
  @Type(() => UserLog)
  logs: UserLog[];

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalPaidAmount: number;
}
