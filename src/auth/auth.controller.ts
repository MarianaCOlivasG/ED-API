import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators';
import { User } from './entities/user.entity';
import { UsersFilterDto } from './dto/usersFilterDto';
import { LoginUserDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('/login') // admin, contra
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login( loginUserDto );
  }
  
  @Put('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto) {
    return this.authService.updateUser( id, updateUserDto );
  }
 
  @Get('/active/:id')
  changeIsActive( @Param('id') id: string ) {
    return this.authService.changeIsActive( id );
  }

  @Get('/renew')
  @UseGuards( AuthGuard() )
  renew( 
    @GetUser() user: User,
    @Param('role') role: 'user' | 'admin' | 'sudo' ) {
    return this.authService.renewToken( user, role );
  }


  @Get('all')
  getUsersByRol( @Query() usersFilterDto: UsersFilterDto ) {
    return this.authService.getAllUsersByRole( usersFilterDto );
  }

  @Get(':id')
  getUserById( @Param('id') id: string ) {
    return this.authService.getUserById( id );
  }


}
