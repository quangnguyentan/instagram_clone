import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Note } from './entities/note.entity';
import { Model } from 'mongoose';

@Injectable()
export class NoteService {
  constructor(
    @InjectModel(Note.name) private readonly noteModel: Model<Note>,
  ) {}

  create(dto: CreateNoteDto) {
    const expireAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return this.noteModel.create({ ...dto, expireAt });
  }

  findByUser(userId: string) {
    return this.noteModel.find({ user: userId });
  }
}
