import { Expose, Type } from 'class-transformer';
import { UserLog } from 'src/api/attendance/entity/user-logs.entity';
import { User } from 'src/api/user/entities/user.entity';

export class AttendanceStatusResource {
  @Expose()
  @Type(() => UserLog)
  activeLog: UserLog[];

  @Expose()
  @Type(() => User)
  user: User;
}
