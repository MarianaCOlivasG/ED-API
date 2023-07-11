import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Notices } from './entities/new.entity';
import { Model } from 'mongoose';

@Injectable()
export class NoticesService {


  constructor( @InjectModel(Notices.name)
  private readonly noticeModel: Model<Notices> ){}



 async register(createNoticeDto: CreateNoticeDto) {
   
    try {

      const data = {
        ...createNoticeDto
      }

      // console.log(data)

      // console.log("-----------");
      
      const createdNotice = await this.noticeModel.create(data);

      // console.log(createdNew)

      return {
        status: true,
        createdNotice
      };
      
    } catch (error) {
      this.handleException(error)
    }


  }


  async update(id: string, updateNoticeDto: UpdateNoticeDto) {
    
    const Notice = await this.noticeModel.findById( id );
   
    if ( !Notice ) {
      return new NotFoundException({ message: `No existe un aviso con el ID ${id}` })
    }


    try {

          const noticeUpdate = await this.noticeModel.findByIdAndUpdate( id, updateNoticeDto, {new: true});



      return {
        status: true,
        message: 'Aviso actualizada con éxito.',
        noticeUpdate
      };
      
    } catch (error) {
      this.handleException(error)
    }


  }

async findSlug(id:string){

  console.log(id);
  
  const Notice = await this.noticeModel.find( {slug: id} );
  if ( !Notice ) {
    return new NotFoundException({ message: `intenta con otro diferente a ${id}` })
  }


  return {
    status: true,
    Notice
  }
  
}


async findAll(){


  
  const Notices = await this.noticeModel.find( {isVisible:true} );
  if ( !Notices ) {
    return new NotFoundException({ message: `No hay noticias disponibles` })
  }


  return {
    status: true,
    Notices
  }
  
}

  private handleException( error: any ) {
    if ( error.code === 11000 ) {
      throw new BadRequestException({
        status: false,
        message: `User exist in database ${ JSON.stringify( error.keyValue ) }`
      });
    }
    console.log(error);
    throw new InternalServerErrorException(`Can´t create user - Check server logs`)
  }
}
