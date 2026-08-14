import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import * as bcrypt from 'bcrypt';

import { User } from '../../api/user/entities/user.entity';
import { Country } from '../../api/country/entity/country.entity';
import { WalkInCustomer } from '../../api/walk-in-customer/entity/walk-in-customer.entity';
import { RingCustomer } from '../../api/ring-customer/entity/ring-customer.entity';
import { Container } from '../../api/container/entity/container.entity';
import { ContainerDocument } from '../../api/container/entity/container-document.entity';
import { Inventory } from '../../api/inventory/entity/inventory.entity';
import { InventoryLog } from '../../api/inventory/entity/inventory-log.entity';
import { Expense } from '../../api/expense/entity/expense.entity';
import { Payout } from '../../api/payout/entity/payout.entity';
import { UserLog } from '../../api/attendance/entity/user-logs.entity';

import { 
  UserRoles, 
  PriceUnit, 
  AttendanceStatus, 
  ContainerStatus, 
  ActivityLogType, 
  RingCustomerStatus, 
  WalkInCustomerStatus 
} from '../../constants/user.constant';
import { Languages, ExpenseType, DocumentType } from '../../constants/app.constant';

const userNames = ['Michael Scott', 'Jim Halpert', 'Pam Beesly', 'Dwight Schrute', 'Angela Martin', 'Stanley Hudson', 'Kevin Malone', 'Oscar Martinez', 'Meredith Palmer', 'Phyllis Vance'];
const customerNames = ['Robert California', 'David Wallace', 'Jan Levinson', 'Holly Flax', 'Roy Anderson', 'Kelly Kapoor', 'Ryan Howard', 'Toby Flenderson', 'Creed Bratton', 'Darryl Philbin'];
const countryNames = ['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Japan', 'Italy', 'Spain', 'Netherlands'];
const vendors = ['Dunder Mifflin', 'Sabre', 'Vance Refrigeration', 'Weyerhamer Paper', 'Staples', 'Prince Family Paper', 'Schrute Farms', 'Serenity by Jan', 'Michael Scott Paper Company', 'Shoe La La'];

export default class MainTestDataSeeder implements Seeder {
  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager
  ): Promise<void> {
    const userRepository = dataSource.getRepository(User);
    const countryRepository = dataSource.getRepository(Country);
    const wcRepository = dataSource.getRepository(WalkInCustomer);
    const rcRepository = dataSource.getRepository(RingCustomer);
    const containerRepository = dataSource.getRepository(Container);
    const containerDocRepository = dataSource.getRepository(ContainerDocument);
    const inventoryRepository = dataSource.getRepository(Inventory);
    const inventoryLogRepository = dataSource.getRepository(InventoryLog);
    const expenseRepository = dataSource.getRepository(Expense);
    const payoutRepository = dataSource.getRepository(Payout);
    const userLogRepository = dataSource.getRepository(UserLog);

    const timestamp = Date.now();
    const hashPassword = await bcrypt.hash('Password@123', 10);

    // 1. Seed 10 Countries
    const countries: Country[] = [];
    for (let i = 0; i < 10; i++) {
      const country = countryRepository.create({
        name: countryNames[i],
        officialName: `${countryNames[i]} Republic`,
        isoCode: countryNames[i].substring(0, 2).toUpperCase(),
        isoCode3: countryNames[i].substring(0, 3).toUpperCase(),
        phoneCode: `+${i + 1}0`,
      });
      countries.push(country);
    }
    await countryRepository.save(countries);
    console.log('✅ Seeded 10 Countries');

    // 2. Seed 10 Users
    const users: User[] = [];
    for (let i = 0; i < 10; i++) {
      const user = userRepository.create({
        uid: `UID-${timestamp}-${i}`,
        email: `${userNames[i].toLowerCase().replace(' ', '.')}@example.com`,
        password: hashPassword,
        fullName: userNames[i],
        role: i === 0 ? UserRoles.ADMIN : UserRoles.USER,
        language: Languages.EN,
        priceUnit: PriceUnit.USD,
        perHourRate: 15.0 + i,
        loanAmount: 0,
        isActive: true,
        isClockInClockOutEnabled: true,
        isInventoryEnabled: true,
        isPayoutEnabled: true,
        isContainerEnabled: true,
        isExpenseEnabled: true,
        isWalkInCustomerEnabled: true,
        isRingCustomerEnabled: true,
        isNotificationOn: true,
      });
      users.push(user);
    }
    await userRepository.save(users);
    console.log('✅ Seeded 10 Users');

    // 3. Seed 10 WalkInCustomers
    const walkInCustomers: WalkInCustomer[] = [];
    for (let i = 0; i < 10; i++) {
      const wc = wcRepository.create({
        wcId: `WC-${timestamp}-${i}`,
        walkInCustomerDate: new Date(),
        customerName: customerNames[i],
        carTiresCount: 4,
        carTiresPrice: 50.0,
        truckTiresCount: 2,
        truckTiresPrice: 150.0,
        rimsCount: 4,
        rimsPrice: 25.0,
        totalAmount: 600.0,
        status: WalkInCustomerStatus.PAID,
        user: users[i],
      });
      walkInCustomers.push(wc);
    }
    await wcRepository.save(walkInCustomers);
    console.log('✅ Seeded 10 Walk-in Customers');

    // 4. Seed 10 RingCustomers
    const ringCustomers: RingCustomer[] = [];
    for (let i = 0; i < 10; i++) {
      const rc = rcRepository.create({
        rcId: `RC-${timestamp}-${i}`,
        ringCustomerDate: new Date(),
        customerName: customerNames[9 - i],
        orderedRingCount: 10,
        price: 20.0,
        deliveryFee: 15.0,
        totalAmount: 215.0,
        status: RingCustomerStatus.PENDING,
        user: users[i],
      });
      ringCustomers.push(rc);
    }
    await rcRepository.save(ringCustomers);
    console.log('✅ Seeded 10 Ring Customers');

    // 5. Seed 10 Containers & Documents
    const containers: Container[] = [];
    for (let i = 0; i < 10; i++) {
      const c = containerRepository.create({
        cId: `C-${timestamp}-${i}`,
        bookingNumber: `BKN-${timestamp}-${i}`,
        containerCount: 1,
        avgWeightInKgs: 5000.0,
        loadingDate: new Date(),
        etdDate: new Date(),
        etaDate: new Date(),
        status: ContainerStatus.LOADING,
        user: users[i],
      });
      containers.push(c);
    }
    await containerRepository.save(containers);

    const containerDocs: ContainerDocument[] = [];
    for (let i = 0; i < 10; i++) {
      const cd = containerDocRepository.create({
        cdId: `CD-${timestamp}-${i}`,
        container: containers[i],
        documentName: `shipping_manifest_${i}.pdf`,
        documentType: DocumentType.PDF,
        documentSize: '1024',
      });
      containerDocs.push(cd);
    }
    await containerDocRepository.save(containerDocs);
    console.log('✅ Seeded 10 Containers & Container Documents');

    // 6. Seed 10 Inventories & Logs
    const inventories: Inventory[] = [];
    for (let i = 0; i < 10; i++) {
      const inv = inventoryRepository.create({
        iId: `INV-${timestamp}-${i}`,
        inventoryDate: new Date(),
        carTiresCount: 100,
        truckTiresCount: 50,
        mixedTiresCount: 20,
        bales: 10,
        user: users[i],
      });
      inventories.push(inv);
    }
    await inventoryRepository.save(inventories);

    const inventoryLogs: InventoryLog[] = [];
    for (let i = 0; i < 10; i++) {
      const il = inventoryLogRepository.create({
        ilId: `IL-${timestamp}-${i}`,
        activityLogType: ActivityLogType.CREATED,
        user: users[i],
        inventory: inventories[i],
        inventoryDate: new Date(),
        carTiresCount: 100,
        truckTiresCount: 50,
        mixedTiresCount: 20,
        bales: 10,
        isRead: false,
      });
      inventoryLogs.push(il);
    }
    await inventoryLogRepository.save(inventoryLogs);
    console.log('✅ Seeded 10 Inventories & Logs');

    // 7. Seed 10 Expenses
    const expenses: Expense[] = [];
    for (let i = 0; i < 10; i++) {
      const exp = expenseRepository.create({
        eId: `EXP-${timestamp}-${i}`,
        expenseDate: new Date(),
        vendorName: vendors[i],
        description: `Purchased supplies from ${vendors[i]}`,
        totalExpense: 100.0 * (i + 1),
        expenseType: ExpenseType.MANUAL,
        user: users[i],
        vendor: users[(i + 1) % 10],
      });
      expenses.push(exp);
    }
    await expenseRepository.save(expenses);
    console.log('✅ Seeded 10 Expenses');

    // 8. Seed 10 Payouts
    const payouts: Payout[] = [];
    for (let i = 0; i < 10; i++) {
      const pay = payoutRepository.create({
        pId: `PAY-${timestamp}-${i}`,
        amount: 500.0,
        loanAmount: 50.0,
        paidAmount: 450.0,
        isPaid: true,
        user: users[i],
      });
      payouts.push(pay);
    }
    await payoutRepository.save(payouts);
    console.log('✅ Seeded 10 Payouts');

    // 9. Seed 10 User Logs (Attendance)
    const userLogs: UserLog[] = [];
    for (let i = 0; i < 10; i++) {
      const ul = userLogRepository.create({
        ulId: `UL-${timestamp}-${i}`,
        status: AttendanceStatus.CLOCKED_OUT,
        checkedInAt: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
        checkedOutAt: new Date(),
        user: users[i],
        payout: payouts[i],
      });
      userLogs.push(ul);
    }
    await userLogRepository.save(userLogs);
    console.log('✅ Seeded 10 User Logs (Attendance)');

    console.log('🚀 Successfully seeded data end-to-end!');
  }
}
