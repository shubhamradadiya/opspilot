import { Expose, Transform, Type } from 'class-transformer';
import { User } from 'src/api/user/entities/user.entity';
import { dateToTimestamp } from 'src/helpers/date-format.helper';

export class InventoryActivityLog {
  @Expose()
  ilId: string;

  @Expose()
  @Type(() => User)
  user: User;

  @Expose()
  text: string;

  @Expose()
  isRead: boolean;

  @Expose()
  @Transform(({ value }) => (value ? dateToTimestamp(value) : null))
  createdAt: Date;
}
