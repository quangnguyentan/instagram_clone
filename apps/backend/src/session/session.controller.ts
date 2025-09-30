import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { SessionsService } from './session.service';

@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionsService) { }


}
