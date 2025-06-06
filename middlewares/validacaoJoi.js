import Joi from 'joi'

export function validarBody(schema) {
    return (req, res, next) => {
        const { error } = schema.validate(req.body)
        if (error) {
            return res.status(400).json({ error: error.details[0].message })
        }
        next()
    }
}

export const produtoSchema = Joi.object({
    nome: Joi.string().min(2).max(100).required(),
    unidade: Joi.string().min(1).max(20).required(),
    preco: Joi.number().positive().required()
})