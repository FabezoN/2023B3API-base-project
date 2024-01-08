import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Req,
  UseGuards,
  Get,
  Param,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { AuthGuard } from '../auth/guard';
import { ProjectsUsersService } from '../project-user/project-user.service';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventService: EventsService,
    private readonly projectUserService: ProjectsUsersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  create(@Body() createEventDto: CreateEventDto, @Req() req) {
    const userId = req.user.sub;
    return this.eventService.eventCreate(userId, createEventDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  getEvent(@Param('id') event: string) {
    return this.eventService.getEvent(event);
  }

  @Get()
  @UseGuards(AuthGuard)
  getAll() {
    return this.eventService.getAll();
  }

  @UseGuards(AuthGuard)
  @Post('/:id/validate')
  async eventsValidate(@Param('id') eventId: string, @Req() req) {
    try {
      if (req.user.role === 'Employee') {
        throw new UnauthorizedException();
      }

      const event = await this.eventService.getEvent(eventId);
      if (
        event.eventStatus === 'Accepted' ||
        event.eventStatus === 'Declined'
      ) {
        throw new ForbiddenException(
          'Impossible to change the status of a validated or refused event',
        );
      }

      if (req.user.role === 'ProjectManager') {
        const authorized = await this.projectUserService.dateManage(
          req.user.sub,
          event.date,
        );

        if (authorized == null) {
          throw new UnauthorizedException();
        }

        const update = await this.eventService.updateEvent(eventId);
        return update;
      }

      if (req.user.role === 'Admin') {
        const update = await this.eventService.updateEvent(eventId);
        return update;
      }
    } catch (error) {
      throw new UnauthorizedException('Event not found');
    }
  }

  @UseGuards(AuthGuard)
  @Post('/:id/decline')
  async declineEvent(@Param('id') eventId: string, @Req() req) {
    try {
      if (req.user.role === 'Employee') {
        throw new UnauthorizedException();
      }

      const event = await this.eventService.getEvent(eventId);
      if (
        event.eventStatus === 'Accepted' ||
        event.eventStatus === 'Declined'
      ) {
        throw new ForbiddenException(
          'Impossible to change the status of a validated or refused event',
        );
      }

      if (req.user.role === 'ProjectManager') {
        const isAuthorized = await this.projectUserService.dateManage(
          req.user.sub,
          event.date,
        );

        if (isAuthorized == null) {
          throw new UnauthorizedException();
        }

        const update = await this.eventService.declineEvent(eventId);
        return update;
      }

      if (req.user.role === 'Admin') {
        const update = await this.eventService.declineEvent(eventId);
        return update;
      }
    } catch (error) {
      throw new UnauthorizedException('Event Unknown');
    }
  }
}
