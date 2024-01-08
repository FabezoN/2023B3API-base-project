import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import User from '../../users/entities/user.entity';

@Entity('events')
export class Event {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'date' })
  date!: Date;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Accepted', 'Declined'],
    default: 'Pending',
  })
  eventStatus?: 'Pending' | 'Accepted' | 'Declined';

  @Column({ type: 'enum', enum: ['RemoteWork', 'PaidLeave'] })
  eventType!: 'RemoteWork' | 'PaidLeave';

  @Column({ type: 'text', nullable: true })
  eventDescription?: string;

  @Column()
  userId!: string;

  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'userId' })
  user: User;
}
