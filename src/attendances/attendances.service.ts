import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Attendance } from './entities/attendance.entity';
import { Repository } from 'typeorm';
import { Enrollment } from 'src/enrollments/entities/enrollment.entity';
import { handleDBError } from 'src/common/errors/handleDBError.errors';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Injectable()
export class AttendancesService {

  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>, 
    @InjectRepository(Enrollment)
    private enrollmentRepository: Repository<Enrollment>
    
  ){}

  async create(createAttendanceDtos: CreateAttendanceDto[], userId: string) {
    const attendances = [];

    for (const createAttendanceDto of createAttendanceDtos) {
        const enrollment = await this.enrollmentRepository.findOne({
            where: { id: createAttendanceDto.enrollmentId }
        });

        if (!enrollment) {
            throw new NotFoundException(`Enrollment not found for id ${createAttendanceDto.enrollmentId}`);
        }

        const attendance = this.attendanceRepository.create({
            ...createAttendanceDto,
            enrollmentId: enrollment, 
            createdBy: { id: userId } 
        });
        try {
          await this.attendanceRepository.save(attendance);
          attendances.push(attendance);
        } catch (error) {
          handleDBError(error);
        }
    }

    return attendances;
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;

    const attendances = await this.attendanceRepository.find({
        take: limit,
        skip: offset
    });

    return attendances.map(attendance => ({
        id: attendance.id,
        attendance: attendance.attendance,
        createdAt: attendance.createdAt,
        creationTime: attendance.creationTime,
        student: {
            id: attendance.enrollmentId.student.id,
            fullName: attendance.enrollmentId.student.fullName,
            matricula: attendance.enrollmentId.student.matricula,
        },
    }));
  }

  async findManyByEnrollment(enrollmentId: string) {
    
    const attendances = await this.attendanceRepository.find({
      where: { enrollmentId: { id: enrollmentId } },
    });

    if (attendances.length === 0) 
      throw new NotFoundException(`Attendances not found for enrollmentId ${enrollmentId}`);
    
    try {

      return attendances.map(attendance => ({
        id: attendance.id,
        attendance: attendance.attendance,
        createdAt: attendance.createdAt,
        creationTime: attendance.creationTime,
      }));

    } catch (error) {
      handleDBError(error);
    }
}

  async findOne(id: string) {
    try{
      const attendance = await this.attendanceRepository.findOneOrFail({ where: { id } });
      return {
        id: attendance.id,
        attendance: attendance.attendance,
        createdAt: attendance.createdAt,
        creationTime: attendance.creationTime,
        student: {
          id: attendance.enrollmentId.student.id,
          fullName: attendance.enrollmentId.student.fullName,
          matricula: attendance.enrollmentId.student.matricula,
        },
      }
    }catch(error){
      handleDBError(error);
    }
  }

  async update (updateAttendanceDtos: UpdateAttendanceDto[]) {
    const attendances = [];

    for (const updateAttendanceDto of updateAttendanceDtos) {
        try {
          await this.attendanceRepository.save(updateAttendanceDto);
          attendances.push(updateAttendanceDto);
        } catch (error) {
          handleDBError(error);
        }
    }
    return attendances;
  }

  remove(id: number) {
    return `This action removes a #${id} attendance`;
  }

}
