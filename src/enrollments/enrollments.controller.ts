import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { CreateEnrollmentDto, DeleteEnrollmentDto } from './dto';

@Controller('enrollments')
@Auth()
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Post(':subjectId')
  create(
    @Param('subjectId', ParseUUIDPipe ) subjectId: string,
    @Body() createEnrollmentDtos: CreateEnrollmentDto[],
    @GetUser() user: User
  ) {
    return this.enrollmentsService.create(subjectId, createEnrollmentDtos, user.id);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto,
  ) {
    return this.enrollmentsService.findAll(paginationDto);
  }

  @Get('subject/:subjectId')
  findStudentsEnrolled(
    @Query() paginationDto: PaginationDto,
    @Param('subjectId', ParseUUIDPipe ) subjectId: string
  ) {
    return this.enrollmentsService.findStudentsEnrolled(subjectId, paginationDto);
  }

  @Get('count-students-enrolled/:subjectId')
  countStudentsEnrolled(
    @Param('subjectId', ParseUUIDPipe ) subjectId: string
  ) {
    return this.enrollmentsService.countStudentsEnrolled(subjectId);
  }

  @Get('subject/:subjectId/not-enrolled')
  findStudentsNotEnrolled(
    @Query() paginationDto: PaginationDto,
    @Param('subjectId', ParseUUIDPipe ) subjectId: string
  ) {
    return this.enrollmentsService.findStudentsNotEnrolled(subjectId, paginationDto);
  }

  @Get('count-students-not-enrolled/:subjectId')
  countStudentsNotEnrolled(
    @Param('subjectId', ParseUUIDPipe ) subjectId: string
  ) {
    return this.enrollmentsService.countStudentsNotEnrolled(subjectId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.enrollmentsService.findOne(id);
  }

  @Delete('many-enrollments')
  remove(
    @Body() deleteEnrollmentDto: DeleteEnrollmentDto[]
  ) {
    return this.enrollmentsService.remove(deleteEnrollmentDto);
  }
}
