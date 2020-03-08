const Fastify = require("fastify")
const minimist = require("minimist")
const service = require("./lib/service")
const path = require("path")
const AutoLoad = require("fastify-autoload")

function start(opts) {
    opts = opts || {}

    if (opts.verbose) {
        opts.logger = {
            level: "info"
        }
    }

    const app = Fastify(opts)
    app.register(service, opts)
    app.register(AutoLoad, {
        dir: path.join(__dirname, "routes"),
        options: Object.assign({prefix: "/api"}, opts)
    })

    app.listen(opts.port, (err) => {
        if (err) {
            throw err
        }

        app.log.info("server listening on port %d", app.server.address().port)
    })
}

module.exports = service

if (require.main === module) {
    start(minimist(process.argv.slice(2), {
        integer: "port",
        boolean: "verbose",
        alias: {
            "port": "p",
            "verbose": "v"
        },
        default: {
            port: 3000
        }
    }))
}
