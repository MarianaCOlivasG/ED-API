import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs'; 
import { User } from './entities/user.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload, ValidRoles } from './interfaces';
import { UsersFilterDto } from './dto/usersFilterDto';
import { LoginUserDto } from './dto';


@Injectable()
export class AuthService {

  constructor( @InjectModel(User.name)
                private readonly userModel: Model<User>,
                private readonly jwtService: JwtService,
                // private readonly mailService: MailService
                ){
  }

  private getJwtToken( payload: JwtPayload ){
    const accessToken = this.jwtService.sign( payload );
    return accessToken;
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


  async register(createUserDto: CreateUserDto) {
    
    try {

      const { password, ...userData } = createUserDto;
 
      const salt = bcrypt.genSaltSync();

      const user = await this.userModel.create({
        ...userData,
        password: bcrypt.hashSync( password, salt )
      });

      delete user.password;

      return {
        status: true,
        user,
        accessToken: this.getJwtToken({id: user.id, role: user.role})
      };

    } catch (error) {
      this.handleException(error)
    }


  }

  async updateUser( userId: string, updateUserDto: UpdateUserDto ) {

    const user = await this.userModel.findById( userId );

    if ( !user ) {
      return new NotFoundException({ message: `No existe un usuario con el ID ${userId}` })
    }

    try {
      const userUpdate = await this.userModel.findByIdAndUpdate( userId, updateUserDto, {new: true});

      return {
        status: true,
        message: 'Usuario actualizado con éxito.',
        user: userUpdate
      }
      
    } catch (error) {
      this.handleException(error);
    }



  }

  async changeIsActive( userId: string ) {

    const user = await this.userModel.findById( userId );

    if ( !user ) {
      return new NotFoundException({ message: `No existe un usuario con el ID ${userId}` })
    }

    try {


      user.isActive = !user.isActive;
 
      await user.save();

      return {
        status: true,
        message: `Cuenta ${ user.isActive ? 'habilitada' : 'deshabilitada' } con éxito.`,
        user
      }
      
    } catch (error) {
      this.handleException(error);
    }

  }

  async renewToken( user: User, role: 'sudo' | 'admin' | 'user' ) {

    if ( !user ) throw new UnauthorizedException(`Unauthorized`)

    if ( !user.isActive ) throw new UnauthorizedException(`Unauthorized`)

    if ( user.role != role ) throw new UnauthorizedException(`Unauthorized`)

    return {
      status: true,
      user,
      accessToken: this.getJwtToken( {id: user.id, role: user.role }  )
    };

  }

  async getAllUsersByRole( usersFilterDto: UsersFilterDto ) {

    const { role, limit = 20, page = 1 } = usersFilterDto;

    const [ users, totalResults ] = await Promise.all([
      await this.userModel.find({ role })
        .limit( limit )
        .skip( (page - 1) * limit ),
      await this.userModel.countDocuments({ role })
    ])

    return {
      users,
      totalResults,
      status: true
    };


  }

  async getUserById( id: string) {

    try {
      const user = await this.userModel.findById(id, '-password');

      if ( !user ) {
        return {
          status: false,
          message: 'No existe un usuario con el ID ' + id
        }
      }

      return {
        status: true,
        user,
      };

    } catch (error) { 
      console.log(error)
      this.handleException(error)
    }
   
  }

  async login( loginUserDto: LoginUserDto) {

    const { password, userName } = loginUserDto;

    const user = await this.userModel.findOne({ userName});

    if ( !user ) {
      throw new UnauthorizedException({
        status: false,
        message: ['Usuario y/o contraseña incorrecto/s.']
      })
    }
    
    if ( !user.isActive ) {
      throw new UnauthorizedException({
        status: false,
        message:`Su cuenta ha sido deshabilitada por el administrador.`
      })
    }    

    if ( !bcrypt.compareSync(password, user.password) ) {
      throw new UnauthorizedException({
        status: false,
        message: ['Usuario y/o contraseña incorrecto/s.']
      })
    }

    delete user.password;

    return {
      status: true,
      user,
      accessToken: this.getJwtToken( {id: user.id, role: user.role } )
    };
    
  }


}
