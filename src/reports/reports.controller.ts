import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { AuthGuard } from '../guards/auth.guard';
import { CurrentUser } from '../users/decorators/current-user.decorator';
import { User } from '../users/user.entity';
import { ReportDto } from './dtos/report.dto';
import { serialize } from '../interceptors/serialize.interceptor';


@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService) {}

  @Post('/newReport')
  @UseGuards(AuthGuard)
  @serialize(ReportDto)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: User) {
    return this.reportService.create(body, user);
  }

  // @Get()
  // estimateValue(@Query()){

  // }

  // @Patch()
  // approveReport(@Param('id') id:string, @Body() body: UpdateReportDto){

  // }

  @Delete('/:id')
  removeReportById(@Param('id') id:string){
    return this.reportService.remove(parseInt(id));
  }
}
