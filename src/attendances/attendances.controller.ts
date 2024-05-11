import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { AttendancesService } from './attendances.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../auth/entities/user.entity';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('attendances')
@Auth()
export class AttendancesController {
  constructor(private readonly attendancesService: AttendancesService) {}

  @Post()
  create(
    @Body() createAttendanceDto: CreateAttendanceDto[],
    @GetUser() user: User
  ) {
    return this.attendancesService.create(createAttendanceDto, user.id);
  }

  @Get()
  findAll(
    @Query() paginationDto: PaginationDto
  ) {
    return this.attendancesService.findAll( paginationDto );
  }

  @Get('attendance-dates')
  findAttendanceDates() {
    return this.attendancesService.findAttendanceDates();
  }

  @Get('by-date')
  findManyByDateAndSubject(
  @Query('date') date: string,
  @Query('subjectId') subjectId: string
  ) {
  return this.attendancesService.findManyByDateAndSubject(date, subjectId);
  }

  @Get('by-subject/:subjectId')
  findManyBySubject(
    @Param('subjectId', ParseUUIDPipe) subjectId: string
  ) {
    return this.attendancesService.findManyBySubject(subjectId);
  }
  
  @Get('by-enrollment/:enrollmentId')
  findManyByEnrollment(
    @Param('enrollmentId', ParseUUIDPipe) enrollmentId: string
  ) {
    return this.attendancesService.findManyByEnrollment(enrollmentId);
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe ) id: string
  ) {
    return this.attendancesService.findOne(id);
  }

  @Patch()
  update(
    @Body() updateAttendanceDtos: UpdateAttendanceDto[]
  ) {
    return this.attendancesService.update(updateAttendanceDtos);
  }

}
