import {
  Body,
  Controller,
  Get,
  Patch,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/guards.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportService } from './report.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Roles('user', 'admin')
  @Post()
  create(@Body() dto: CreateReportDto, @Req() req: any) {
    return this.reportService.create(req.user.userId, dto);
  }

  @Roles('admin')
  @Get()
  findAll(@Query('status') status?: string) {
    return this.reportService.findAll(status);
  }

  @Roles('admin')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReportDto,
    @Req() req: any,
  ) {
    return this.reportService.update(id, req.user.userId, dto);
  }
}
