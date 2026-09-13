import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from './common/cache/cache.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PartiesModule } from './modules/parties/parties.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { ManufacturingModule } from './modules/manufacturing/manufacturing.module';
import { ExpensesModule } from './modules/expenses/expenses.module';
import { DiscountsModule } from './modules/discounts/discounts.module';
import { ShiftsModule } from './modules/shifts/shifts.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { ReportsModule } from './modules/reports/reports.module';
import { AuditModule } from './modules/audit/audit.module';
import { SettingsModule } from './modules/settings/settings.module';

@Module({
  imports: [
    PrismaModule,
    CacheModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    InventoryModule,
    OrdersModule,
    PartiesModule,
    PurchasesModule,
    ManufacturingModule,
    ExpensesModule,
    DiscountsModule,
    ShiftsModule,
    EmployeesModule,
    ReportsModule,
    AuditModule,
    SettingsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
