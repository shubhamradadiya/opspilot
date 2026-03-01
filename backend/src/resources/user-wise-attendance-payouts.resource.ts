import { Expose, Transform, Type } from 'class-transformer';
import moment from 'moment';
import { castToStorage } from 'src/helpers/file-upload.helper';
import { isUrlValid } from 'src/helpers/utils.helper';

export class UserWiseAttendancePayoutsResource {
  @Expose()
  userId: string;

  @Expose()
  fullName: string;

  @Expose()
  @Transform(({ value }) => (isUrlValid(value) ? value : castToStorage(value)))
  profilePicture: string | null;

  @Expose()
  @Type(() => Attendance)
  attendance: Attendance[];

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalDurationInHours: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalDurationInMinutes: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalDurationInSeconds: number;

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
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalPaidAmount: number;

  @Expose()
  isPaid: boolean;
}

export class Attendance {
  @Expose()
  startDate: number;

  @Expose()
  endDate: number;

  @Expose()
  @Transform(
    ({ obj }) => `${moment.unix(obj.startDate).toDate()} - ${moment.unix(obj.endDate).toDate()}`,
  )
  dateTest: Date;

  @Expose()
  @Transform(({ value }) =>
    value || typeof value === 'number' ? Number(Number(value).toFixed(2)) : null,
  )
  durationInHours: number | null;

  @Expose()
  @Transform(({ value }) =>
    value || typeof value === 'number' ? Number(Number(value).toFixed(2)) : null,
  )
  durationInMinutes: number | null;

  @Expose()
  @Transform(({ value }) =>
    value || typeof value === 'number' ? Number(Number(value).toFixed(2)) : null,
  )
  durationInSeconds: number | null;
}
