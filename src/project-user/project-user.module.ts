import { Module } from '@nestjs/common';
import { ProjectsService } from '../projects/projects.service';
import { ProjectsUsersService } from './project-user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUsersController } from './project-users.controller';
import { UsersService } from '../users/users.service';
import { UserController } from '../users/users.controller';
import { UsersModule } from '../users/users.module';
import User from '../users/entities/user.entity';
import { ProjectUser } from './entities/project-user.entity';
import Project from '../projects/entities/project.entity';
import { ProjectController } from '../projects/projects.controller';
import { EventsController } from '../events/events.controller';
import { EventsService } from '../events/events.service';
import { Event } from '../events/entities/events.entity';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, User, ProjectUser, Event]),
    UsersModule,
    EventsModule,
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
export class ProjectsUsersModule {}
