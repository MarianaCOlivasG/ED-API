
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

@Schema()
export class User extends Document {

    @Prop({
        unique: true,
        index: true
    })
    userName: string

    @Prop({ type: () => String })
    password: string

    @Prop({ type: () => String })
    name: string

    @Prop({ type: () => String })
    picture?: string

    @Prop({ type: () => Boolean, default: true })
    isActive?: boolean

    @Prop({ type: () => Boolean, default: false })
    isOnline?: boolean

    @Prop({ type: String })
    token?: string // renovar contraseña

    @Prop({ type: String })
    role?: string;
}


export const UserSchema = SchemaFactory.createForClass( User );


UserSchema.method('toJSON', function() {
    const { __v, ...object } = this.toObject();
    return object
})
