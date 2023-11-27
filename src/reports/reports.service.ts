import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly ReportRepo: Repository<Report>,
  ) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.ReportRepo.create(reportDto);
    report.user = user;
    return this.ReportRepo.save(report);
  }

  async changeApproval(id: string, approved: boolean) {
    const report = await this.ReportRepo.findOne({
      where: { id: parseInt(id) },
    });
    if (!report) {
      throw new NotFoundException('Report Not Found');
    }
    report.approved = approved;
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
