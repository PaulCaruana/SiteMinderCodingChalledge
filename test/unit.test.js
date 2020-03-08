"use strict"

const Fastify = require("fastify")
const path = require("path")
const AutoLoad = require("fastify-autoload")

const {
    beforeEach,
    afterEach,
    test
} = require("tap")
const service = require("../")

let app
beforeEach((done) => {
    app = Fastify()
    app.register(AutoLoad, {
        dir: path.join(__dirname, "../routes"),
        options: Object.assign({ prefix: "/api" }, {})
    })
    app.ready(done)
})

afterEach((done) => {
    app.close(done)
})

test("Given when testing for simple request then I expect a successful result", function (t) {
    app.inject({
        method: "GET",
        url: "/api"
    }, function (response) {
        console.log(response.payload)
        t.equal(response.statusCode, 200)
        t.deepEqual(JSON.parse(response.payload), { hello: "world" })
        t.end()
    })
})

test("Given sending an email when no 'to' field is provided then I expected an error", function (t) {
    app.inject({
        method: "POST",
        url: "/api/send/email",
        payload: {
            "subject" : "subject"
        }
    }, function (response) {
        console.log(response)
        t.equal(response.statusCode, 400)
        t.equal(response.payload.indexOf("should have required property 'to'") > -1, true)
        t.end()
    })
})
