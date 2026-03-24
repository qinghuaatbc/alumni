import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AlumniService } from './alumni.service';
import { CreateAlumniDto } from './dto/create-alumni.dto';
import { QueryAlumniDto } from './dto/query-alumni.dto';

@Controller('alumni')
export class AlumniController {
  constructor(private alumniService: AlumniService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('stats')
  async getStats() {
    return this.alumniService.getStats();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query() query: QueryAlumniDto) {
    return this.alumniService.findAll(query);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.alumniService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async createOrUpdate(@Request() req, @Body() dto: CreateAlumniDto) {
    return this.alumniService.createOrUpdate(req.user.id, dto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Request() req,
    @Body() dto: CreateAlumniDto,
  ) {
    return this.alumniService.update(id, req.user.id, dto, req.user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.alumniService.remove(id, req.user);
  }
}
