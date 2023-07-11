import * as Joi from 'joi';

// Validar nuestras variables de entorno
export const JoiValidatorSchema = Joi.object({

    MONGODB: Joi.required(),
    PORT: Joi.number().default(3000)

});