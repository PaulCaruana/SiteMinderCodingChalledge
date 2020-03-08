const schemas = require("../schemas/email")
const { sendMail } = require("../services/mailService")

module.exports = async function (fastify, opts) {
    fastify.post(
        "/send/email",
        { schema: schemas.send },
        async function (request, reply) {
            return sendMail(request.body)
        }
    )
}
