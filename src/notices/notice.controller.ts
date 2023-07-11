import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { NoticesService } from './notice.service';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';

@Controller('notices')
export class NoticesController {
  constructor(private readonly noticeService: NoticesService) {}

  @Post('register')
  register(@Body() createNoticeDto: CreateNoticeDto) {
    return this.noticeService.register(createNoticeDto);
  }

  @Put('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateNoticeDto:UpdateNoticeDto) {
    return this.noticeService.update( id, updateNoticeDto );
  }

  @Get('/all')
  all() {
    return this.noticeService.findAll();
  }



  @Get('/findBySlug/:id')
  findSlug(
    @Param('id') id: string,) {
    return this.noticeService.findSlug( id);
  }

}
