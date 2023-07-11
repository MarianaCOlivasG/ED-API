import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateNewDto } from './dto/create-new.dto';
import { UpdateNewDto } from './dto/update-new.dto';
import { InjectModel } from '@nestjs/mongoose';
import { News } from './entities/new.entity';
import { Model } from 'mongoose';

@Injectable()
export class NewService {


  constructor( @InjectModel(News.name)
  private readonly newModel: Model<News> ){}



 async register(createNewDto: CreateNewDto) {
   
    try {

      const data = {
        ...createNewDto
      }

      // console.log(data)

      // console.log("-----------");
      
      const createdNew = await this.newModel.create(data);

      // console.log(createdNew)

      return {
        status: true,
        createdNew
      };
      
    } catch (error) {
      this.handleException(error)
    }


  }


  async update(id: string, updateNewDto: UpdateNewDto) {
    
    const New = await this.newModel.findById( id );
   
    if ( !New ) {
      return new NotFoundException({ message: `No existe una noticia con el ID ${id}` })
    }


    try {

          const newUpdate = await this.newModel.findByIdAndUpdate( id, updateNewDto, {new: true});



      return {
        status: true,
        message: 'Noticia actualizada con éxito.',
        newUpdate
      };
      
    } catch (error) {
      this.handleException(error)
    }


  }

async findSlug(id:string){

  console.log(id);
  
  const New = await this.newModel.find( {slug: id} );
  if ( !New ) {
    return new NotFoundException({ message: `intenta con otro diferente a ${id}` })
  }


  return {
    status: true,
    New
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
