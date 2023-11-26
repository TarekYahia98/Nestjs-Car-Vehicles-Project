import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { NotFoundException } from '@nestjs/common';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
    constructor(@InjectRepository(Report) private readonly ReportRepo: Repository<Report>){}



 create(reportDto: CreateReportDto, user: User){
    const report = this.ReportRepo.create(reportDto);
    report.user = user;
    return this.ReportRepo.save(report);
}


async remove(id: number) {
    const report = await this.ReportRepo.findOneBy({ id });
    if (!report) {
      throw new NotFoundException('Report Not Found');
    }
    return this.ReportRepo.remove(report);
  }
    
}

