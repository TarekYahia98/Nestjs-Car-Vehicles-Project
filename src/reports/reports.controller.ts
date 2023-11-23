import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dtos/create-report.dto';
import { UpdateReportDto } from './dtos/update-report.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('reports')
export class ReportsController {
    constructor( private readonly reportService: ReportsService ) {}

// @UseGuards(AuthGuard)
    // @Post()
    // createReport(@Body()body: CreatReportDto){
    //     return this.reportService.create(body);
      
    // }
    
    // @Get()
    // estimateValue(@Query()){
    
    // }
    
    // @Patch()
    // approveReport(@Param('id') id:string, @Body() body: UpdateReportDto){
    
    // }


    // @Delete()
    // removeReportById(@Param('id') id:string){

    // }


}


