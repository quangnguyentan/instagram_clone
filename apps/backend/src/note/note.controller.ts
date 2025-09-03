import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/entities/user.entity';
import { Model } from 'mongoose';
import { NoteGateway } from './note.gateway';

@Controller('note')
export class NoteController {
  constructor(
    private readonly service: NoteService,
    private readonly gateway: NoteGateway,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  @Get('user/:userId') findByUser(@Param('userId') userId: string) {
    return this.service.findByUser(userId);
  }

  @Post()
  async create(@Body() dto: CreateNoteDto) {
    const note = await this.service.create(dto);
    const author = await this.userModel.findById(dto.user);
    const followerIds = (author?.followers || []).map((x: any) => x.toString());
    this.gateway.pushToFollowers(followerIds, note);
    return note;
  }
}
