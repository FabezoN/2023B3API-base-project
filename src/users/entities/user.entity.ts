import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { IsEmail, IsOptional } from 'class-validator';
import { Exclude } from 'class-transformer';
import { ProjectUser } from '../../project-user/entities/project-user.entity';

// Création de la base de données

export enum UserRole {
  Employee = 'Employee',
  Admin = 'Admin',
  ProjectManager = 'ProjectManager',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  @IsEmail({}, { message: "L'adresse e-mail n'est pas valide" })
  email: string;

  @Exclude()
  @Column()
  password: string;

  @Column({ default: UserRole.Employee })
  @IsOptional()
  role: UserRole;

  @OneToMany(() => ProjectUser, (projectUser) => projectUser.userId)
  projectUsers: ProjectUser[];
}

export default User;
