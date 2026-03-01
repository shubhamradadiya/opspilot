import { Expose, Transform } from 'class-transformer';
import { dateToTimestampWithoutUTC } from 'src/helpers/date-format.helper';
import moment from 'moment';

export class SelfPayoutListResource {
  // @Expose()
  // @Type(() => Payout)
  // payout: Payout;

  @Expose()
  @Transform(({ obj }) => (obj?.perHourRate ? Number(Number(obj?.perHourRate).toFixed(2)) : 0))
  perHourRate: number;

  @Expose()
  @Transform(({ obj }) => (obj?.loanAmount ? Number(Number(obj?.loanAmount).toFixed(2)) : 0))
  loanAmount: number;

  @Expose()
  @Transform(({ obj }) => (obj?.totalAmount ? Number(Number(obj?.totalAmount).toFixed(2)) : 0))
  totalAmount: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  durationInHours: number;

  @Expose()
  @Transform(({ value }) => (value ? Math.floor(Number(value)) : 0))
  durationInMinutes: number;

  @Expose()
  @Transform(({ value }) => (value ? Math.floor(Number(value)) : 0))
  durationInSeconds: number;

  @Expose()
  @Transform(({ value }) => {
    if (!value) return null;
    if (typeof value === 'string') {
      return dateToTimestampWithoutUTC(moment(value).startOf('day').toDate());
    }
    return dateToTimestampWithoutUTC(value);
  })
  weekStartDate: Date;

  @Expose()
  @Transform(({ value }) => {
    if (!value) return null;
    if (typeof value === 'string') {
      return dateToTimestampWithoutUTC(moment(value).endOf('day').toDate());
    }
    return dateToTimestampWithoutUTC(value);
  })
  weekEndDate: Date;

  @Expose()
  weekRange: string;
}
