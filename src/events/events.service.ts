import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Between, FindManyOptions, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Event } from './entities/events.entity';
import { CreateEventDto } from './dto/create-event.dto';
import * as dayjs from 'dayjs';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(Event)
    private eventRepository: Repository<Event>,
  ) {}

  async eventCreate(userId: string, createEventDto: CreateEventDto): Promise<Event | null> {
    const options: FindManyOptions<Event> = {
      where: {
        userId: userId,
        date: createEventDto.date,
      },
      relations: ['user'],
    };
    const onEventByDay = await this.eventRepository.findOne(options);

    if (onEventByDay !== null) {
      throw new UnauthorizedException('An event has already been created for this date');
    }

    if (createEventDto.eventType === 'RemoteWork') {
      const date = dayjs(createEventDto.date);
      const dayMonday = date.startOf('week').subtract(1, 'day');
      const monday = dayMonday.toDate();
      const dayFriday = dayMonday.add(6, 'day');
      const friday = dayFriday.toDate();

      const options: FindManyOptions<Event> = {
        where: {
          userId: userId,
          eventType: 'RemoteWork',
          date: Between(monday, friday),
        },
      };

      const nbrTTWeeks = await this.eventRepository.count(options);

      if (nbrTTWeeks >= 2) {
        throw new UnauthorizedException('You already have 2 days of Remote Work this week');
      }
    }

    if (createEventDto.eventType === 'RemoteWork') {
      createEventDto.eventStatus = 'Accepted';
    }

    if (createEventDto.eventType === 'PaidLeave') {
      createEventDto.eventStatus = 'Pending';
    }

    const newEvent = this.eventRepository.create({
      ...createEventDto,
      userId: userId,
    });

    const event = await this.eventRepository.save(newEvent);
    return event;
  }

  async getEvent(id: string) {
    const options: FindManyOptions<Event> = {
      where: { id: id },
    };
    const event = await this.eventRepository.findOne(options);

    if (event == null) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async getAll() {
    const events = await this.eventRepository.find();

    if (events == null) {
      throw new NotFoundException('No events found');
    }

    return events;
  }

  async updateEvent(eventId: string) {
    const update = await this.eventRepository.update(eventId, { eventStatus: 'Accepted' });
    return update;
  }

  async declineEvent(eventId: string) {
    const update = await this.eventRepository.update(eventId, { eventStatus: 'Declined' });
    return update;
  }

  async getAbsencesEmployees(userId: string, month: number) {
    const firstDayMonth = dayjs().month(month - 1).startOf('month');
    const dayJsLastDayOfMonth = dayjs().month(month - 1).endOf('month');
    const lastDayMonth = dayJsLastDayOfMonth.toDate();
    const firstDayOfMonth = firstDayMonth.toDate();

    const options: FindManyOptions<Event> = {
      where: {
        userId: userId,
        date: Between(firstDayOfMonth, lastDayMonth),
        eventStatus: 'Accepted',
      },
    };

    try {
      const eventCount = await this.eventRepository.count(options);
      return eventCount;
    } catch {
      return 0;
    }
  }
}
