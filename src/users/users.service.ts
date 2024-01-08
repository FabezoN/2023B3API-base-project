import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { FindOneOptions, Repository } from 'typeorm';
import { CreateUserDto, isUUID } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { loginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  // Fonction pour créer un nouvel utilisateur
  async create(createUser: CreateUserDto) {
    const saltOrRounds = 10;
    const user = this.userRepository.create({
      ...createUser,
      password: await bcrypt.hash(createUser.password, saltOrRounds),
    });
    const insertedUser = await this.userRepository.save(user);
    delete insertedUser.password; // Ne renvoie pas le mot de passe
    return insertedUser;
  }

  // Fonction pour se connecter avec un token JWT
  async signIn(loginUserDto: loginUserDto) {
    const options: FindOneOptions<User> = {
      where: { email: loginUserDto.email },
    };
    const user = await this.userRepository.findOne(options);

    // Comparaison du mot de passe stocké avec celui fourni par l'utilisateur
    const match = await bcrypt.compare(loginUserDto.password, user.password);
    if (!match) {
      throw new UnauthorizedException(); // Lance une exception si les mots de passe ne correspondent pas
    }

    // Génération du token
    const tokenPayload = { sub: user.id, email: user.email, role: user.role };
    return {
      access_token: await this.jwtService.signAsync(tokenPayload),
    };
  }

  // Fonction pour retourner la liste des utilisateurs sans le mot de passe
  async findAll(): Promise<User[]> {
    const allUsers = await this.userRepository.find();
    for (const user of allUsers) {
      delete user.password;
    }
    return allUsers;
  }

  // Recherche un utilisateur par son ID, retourne une erreur s'il n'existe pas
  async returnUser(id: string) {
    if (!isUUID(id)) {
      throw new BadRequestException('ID UUID invalid');
    }

    const user = await this.userRepository.findOne({
      where: { id: id },
    });

    // Lance une exception si l'utilisateur n'est pas trouvé
    if (user === null) {
      throw new NotFoundException(`The user with ID ${id} is unknown`);
    }

    delete user.password;
    return user;
  }
}
