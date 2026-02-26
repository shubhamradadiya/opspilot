import { Expose, Transform, Type } from 'class-transformer';
import { dateToTimestampWithoutUTC } from 'src/helpers/date-format.helper';
import { castToStorage } from 'src/helpers/file-upload.helper';
import { isUrlValid } from 'src/helpers/utils.helper';
import { Attendance } from './user-wise-attendance-payouts.resource';

export class UserWiseAttendanceTimestamp {
  @Expose()
  userId: string;

  @Expose()
  fullName: string;

  @Expose()
  countryCode: string;

  @Expose()
  phone: string;

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
}

export class DailyAttendance {
  @Expose()
  @Transform(({ value }) => (value ? dateToTimestampWithoutUTC(value) : null))
  date: Date;

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

export class WeeklyAttendance {
  @Expose()
  weekRange: string;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestampWithoutUTC(value) : null))
  weekStartDate: Date;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestampWithoutUTC(value) : null))
  weekEndDate: Date;

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
