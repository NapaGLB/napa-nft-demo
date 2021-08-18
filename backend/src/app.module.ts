import { Module } from '@nestjs/common';
import { ConnectionsModule } from './connections/connections.module';
import { ControllersModule } from './controllers/controllers.module';
import { SchedulesModule } from './schedules/schedules.module';
import { ServicesModule } from './services/services.module';
import { SocketGatewaysModule } from './socket-gateways/socket.gateways.module';
import { Web3Module } from './web3/web3.module';
import configuration from './config/configuration';
import { ConfigModule } from '@nestjs/config';


@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true
    }),
    ConnectionsModule,
    ServicesModule,
    SocketGatewaysModule,
    Web3Module,
    SchedulesModule,
    ControllersModule
  ],
  providers: [
    ConnectionsModule,
    ServicesModule,
    SchedulesModule
  ]
})
export class AppModule {}
