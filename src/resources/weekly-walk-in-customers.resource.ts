import { Expose, Transform } from 'class-transformer';
import moment from 'moment';
import { WalkInCustomerStatus } from 'src/constants/user.constant';
import { dateToTimestampWithoutUTC } from 'src/helpers/date-format.helper';

export class WeeklyWalkInCustomersResource {
  @Expose()
  @Transform(({ obj }) => `${moment(obj.startDate).toDate()} - ${moment(obj.endDate).toDate()}`)
  dateTest: Date;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestampWithoutUTC(value) : null))
  startDate: Date;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestampWithoutUTC(value) : null))
  endDate: Date;

  @Expose()
  customerName: string;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalAmount: number;

  @Expose()
  status: WalkInCustomerStatus;
}
