import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
  Req,
  UseGuards,
  UnauthorizedException,
  Get,
  Param,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { AuthGuard } from '../auth/guard';
import { UsersService } from '../users/users.service';
import { ProjectsUsersService } from '../project-user/project-user.service';

@Controller('Projects')
export class ProjectController {
  constructor(
    private readonly projectService: ProjectsService,
    private readonly userService: UsersService,
    private readonly projectUserService: ProjectsUsersService,
  ) {}
  // fonction testée

  @Post()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe())
  async create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    if (req.user.role !== 'Admin') {
      throw new UnauthorizedException();
    }
    const user = await this.userService.returnUser(
      createProjectDto.referringEmployeeId,
    );
    if (user.role == 'Admin' || user.role == 'ProjectManager') {
      const project = await this.projectService.create(createProjectDto);
      if (project) {
        const getProject = await this.projectService.getProject(
          createProjectDto.name,
        );
        if (getProject !== null) {
          return {
            id: getProject.project.id,
            name: createProjectDto.name,
            referringEmployeeId: createProjectDto.referringEmployeeId,
            referringEmployee: {
              id: user.id,
              username: user.username,
              email: user.email,
              role: user.role,
            },
          };
        }
      } else {
        throw new UnauthorizedException();
      }
    } else {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(AuthGuard)
  @Get()
  async getProjects(@Req() req) {
    try {
      if (req.user.role === 'Admin' || req.user.role === 'ProjectManager') {
        return await this.projectService.findAll();
      } else if (req.user.role === 'Employee') {
        const employeeProjects =
          await this.projectUserService.getProjectsUser(req.user.sub);
        return employeeProjects;
      } else {
        throw new ForbiddenException('Access Forbidden');
      }
    } catch {
      throw new NotFoundException('Resource not found');
    }
  }
  @UseGuards(AuthGuard)
  @Get(':id')
  async getOneProject(@Param('id') projectId: string, @Req() req) {
    const oneProject = await this.projectService.findById(projectId);
    if (oneProject == undefined) {
      throw new NotFoundException('Resource not found');
    }

    if (req.user.role === 'Admin' || req.user.role === 'ProjectManager') {
      return oneProject;
    }
    if (req.user.role === 'Employee') {
      const result = await this.projectUserService.isUserInvolvedInProject(
        req.user.sub,
        projectId,
      );
      if (result === true) {
        return oneProject;
      } else {
        throw new ForbiddenException('Access Forbidden');
      }
    }
  }
}
