import { User } from 'src/api/user/entities/user.entity';
import { type DataSource, In } from 'typeorm';
import type { Seeder } from 'typeorm-extension';
import { encodePassword } from 'src/helpers/bcrypt.helper';
import { UserRoles } from 'src/constants/user.constant';
import { generateUniqueId } from 'src/helpers/utils.helper';
import moment from 'moment';
import { AppModule } from 'src/app.module';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';

export default class CreateAdminSeed implements Seeder {
  /**
   * Track seeder execution.
   *
   * Default: false
   */
  track = false;

  public async run(dataSource: DataSource) {
    const appContext = await NestFactory.createApplicationContext(AppModule);
    const configService = appContext.get(ConfigService);

    const repository = dataSource.getRepository(User);
    const adminPassword = configService.get('ADMIN_PASSWORD');
    const superAdminPassword = configService.get('SUPER_ADMIN_PASSWORD');

    const admin = {
      email: 'admin@opspilot.com',
      password: adminPassword,
    };
    const superAdmin = {
      email: 'superadmin@opspilot.com',
      password: superAdminPassword,
    };

    // Get existing admins
    const existingAdmins = await repository.find({
      where: { email: In([admin.email, superAdmin.email]) },
    });

    // Admin data
    const adminData = {
      [superAdmin.email]: {
        role: UserRoles.SUPER_ADMIN,
        password: encodePassword(superAdmin.password as string),
      },
      [admin.email]: {
        role: UserRoles.ADMIN,
        password: encodePassword(admin.password as string),
      },
    };

    // Update existing admins
    for (const admin of existingAdmins) {
      await repository.update(
        { email: admin.email },
        { ...adminData[admin.email], verifiedAt: moment().toDate() },
      );
      delete adminData[admin.email]; // Remove updated admin from the insert list
    }

    // Insert new admins
    const inserts = Object.entries(adminData).map(([email, data]) => ({
      uid: generateUniqueId('U'),
      ...data,
      email,
      verifiedAt: moment().toDate(),
    }));

    if (inserts.length) {
      await repository.insert(inserts);
    }
    await appContext.close();
    console.log('Seeding completed for: admins');
  }
}
