import { Module, forwardRef } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { ProjectsUsersService } from '../project-user/project-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUsersController } from '../project-user/project-users.controller';
import { UsersService } from '../users/users.service';
import { UserController } from '../users/users.controller';
import { UsersModule } from '../users/users.module';
import User from '../users/entities/user.entity';
import { ProjectUser } from '../project-user/entities/project-user.entity';
import Project from '../projects/entities/project.entity';
import { ProjectController } from '../projects/projects.controller';
import { Event } from './entities/events.entity';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, ProjectUser, Event]),
    forwardRef(() => UsersModule),
  ],
  controllers: [
    ProjectUsersController,
    UserController,
    ProjectController,
    EventsController,
  ],
  providers: [
    ProjectsUsersService,
    UsersService,
    ProjectsService,
    EventsService,
  ], // Add UserRepository to providers
  exports: [ProjectsUsersService, ProjectsService, EventsService],
})
export class EventsModule {}
