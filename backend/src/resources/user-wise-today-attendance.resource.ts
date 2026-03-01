import { Expose, Transform, Type } from 'class-transformer';
import { UserLog } from 'src/api/attendance/entity/user-logs.entity';
import { AttendanceStatus } from 'src/constants/user.constant';
import { castToStorage } from 'src/helpers/file-upload.helper';
import { isUrlValid } from 'src/helpers/utils.helper';

export class UserWiseTodayAttendanceResource {
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
  attendanceStatus: AttendanceStatus | null;

  @Expose()
  @Type(() => UserLog)
  userLogs: UserLog[];

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalHours: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalMinutes: number;

  @Expose()
  @Transform(({ value }) => (value ? Number(Number(value).toFixed(2)) : 0))
  totalSeconds: number;
}
