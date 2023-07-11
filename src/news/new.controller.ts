import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { NewService } from './new.service';
import { CreateNewDto } from './dto/create-new.dto';
import { UpdateNewDto } from './dto/update-new.dto';

@Controller('news')
export class NewsController {
  constructor(private readonly newService: NewService) {}

  @Post('register')
  register(@Body() createNewDto: CreateNewDto) {
    return this.newService.register(createNewDto);
  }

  @Put('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateNewDto:UpdateNewDto) {
    return this.newService.update( id, updateNewDto );
  }

  @Get('/all')
  all() {
    return this.newService.findAll();
  }



  @Get('/findBySlug/:id')
  findSlug(
    @Param('id') id: string,) {
    return this.newService.findSlug( id);
  }

}
