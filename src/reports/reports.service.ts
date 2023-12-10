import { NotFoundException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './report.entity';
import { Repository } from 'typeorm';
import { CreateReportDto } from './dtos/create-report.dto';
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report) private readonly ReportRepo: Repository<Report>,
  ) {}

  createEstimate({make, model, long, lat, year, mileage}: GetEstimateDto){
return this.ReportRepo.createQueryBuilder()
.select('AVG(price)', 'price')                 // 9. return Average Price For Top 3 filtering Reports
.where('make = :make', {make})      //  1. filter with same make and remove others
.andWhere('model = :model', {model}) // 2. filter with same model and remove others
.andWhere('long - :long BETWEEN -5 AND 5' , {long}) // 3. filter with +/- 5 degrees
.andWhere('lat - :lat BETWEEN -5 AND 5' , {lat}) // 4. filter with +/- 5 degrees
.andWhere('year - :year BETWEEN -3 AND 3' , {year}) // 5. filter with +/- 3 years
.andWhere('approved IS TRUE')                     // 6. report must be approved before
.orderBy('ABS(mileage - :mileage)', 'DESC')     // 7. orderBy closest mileage and sorting DESC
.setParameters({ mileage })
.limit(3)                       // 8. return Top 3 filtering Reports 
.getRawOne()                // 10. return one Report with Average Price


  }

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
