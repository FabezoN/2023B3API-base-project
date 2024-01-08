import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constant';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../auth/jwtStrat';
import { ProjectUser } from '../project-user/entities/project-user.entity';
import Project from '../projects/entities/project.entity';
import { EventsService } from '../events/events.service';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Project, ProjectUser, Event]),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => EventsModule),
  ],
  controllers: [UserController],
  providers: [UsersService, JwtStrategy, EventsService],
  exports: [JwtModule, PassportModule],
})
export class UsersModule {}
