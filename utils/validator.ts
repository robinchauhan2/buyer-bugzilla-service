import { ICreateBug } from "../interfaces/Bugs";
import Joi from "joi";

export function CreateBugSchemaValidator(bugObject: ICreateBug) {


    const schema = Joi.object({
        product: Joi.string().required(),
        component: Joi.string().required(),
        version: Joi.string().required(),
        summary: Joi.string().required(),
        alias: Joi.string().required(),
        op_sys: Joi.string().required(),
        rep_platform: Joi.string().required()
    })


    const { error } = schema.validate(bugObject)



    return error
}