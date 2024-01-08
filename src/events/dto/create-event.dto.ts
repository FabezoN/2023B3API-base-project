import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class CreateEventDto {
  @IsDateString()
  date: Date;

  @IsEnum(['Pending', 'Accepted', 'Declined'])
  @IsOptional()
  eventStatus?: 'Pending' | 'Accepted' | 'Declined' = 'Pending';

  @IsEnum(['RemoteWork', 'PaidLeave'])
  eventType: 'RemoteWork' | 'PaidLeave';

  @IsString()
  @IsOptional()
  eventDescription?: string;

  userId: string;
}
