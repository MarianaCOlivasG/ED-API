import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { InjectModel } from "@nestjs/mongoose";
import { PassportStrategy } from "@nestjs/passport";
import { Model } from "mongoose";
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from "../entities/user.entity";
import { JwtPayload } from "../interfaces";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ) {


    constructor( @InjectModel(User.name)
                private readonly userModel: Model<User>,
                private readonly configService: ConfigService ){
        super({
            secretOrKey: configService.get('JWT_SEED'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate( payload: JwtPayload ) : Promise<User> {


        const { id } = payload;

        const user = await this.userModel.findById( id )

        if ( !user ) throw new UnauthorizedException(`Token not valid`);

        if ( !user.isActive ) throw new UnauthorizedException(`User is not active. Talk with an admin`);

        // Lo que colocamos se añade a la Request es como poner req.uuid = user.id; en express
        return user;
    }
 

}