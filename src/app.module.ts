import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from './modules/email/email.module';
import { ConfigModule } from '@nestjs/config';
import { QueueModule } from './modules/queues/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI),
    UsersModule,
    EmailModule,
    QueueModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
