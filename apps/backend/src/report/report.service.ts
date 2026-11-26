import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { Report } from './entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectModel(Report.name) private readonly reportModel: Model<Report>,
  ) {}

  create(reportedBy: string, dto: CreateReportDto) {
    return this.reportModel.create({
      ...dto,
      reportedBy: new Types.ObjectId(reportedBy),
      targetId: new Types.ObjectId(dto.targetId),
    });
  }

  findAll(status?: string) {
    const filter = status ? { status } : {};
    return this.reportModel
      .find(filter)
      .populate('reportedBy', 'username fullname avatarUrl')
      .populate('reviewedBy', 'username fullname')
      .sort({ createdAt: -1 })
      .limit(200);
  }

  async update(id: string, reviewedBy: string, dto: UpdateReportDto) {
    const report = await this.reportModel
      .findByIdAndUpdate(
        id,
        {
          status: dto.status,
          adminNote: dto.adminNote,
          reviewedBy: new Types.ObjectId(reviewedBy),
        },
        { new: true, runValidators: true },
      )
      .populate('reportedBy', 'username fullname avatarUrl')
      .populate('reviewedBy', 'username fullname');
    if (!report) throw new NotFoundException('Không tìm thấy báo cáo');
    return report;
  }
}
