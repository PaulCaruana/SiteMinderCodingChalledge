const email = {
    email: {
        type: "string",
        format: "email",
        example: "john.smith@gmail.com",
    },
    name: {
        type: "string",
        example: "John smith",
    },
}

const emails = {
    type: "array",
    minItems: 1,
    items: {
        type: "object",
        required: ["email"],
        properties: email
    },
}

module.exports = {
    send: {
        summary: "Send an email message",
        description: "Send an email payload message to an email service",
        body: {
            type: "object",
            required: ["to", "subject"],
            properties: {
                to: emails,
                cc: emails,
                bcc: emails,
                subject: {
                    type: "string",
                    maxLength: 4096,
                    example: "Daily report figures"
                },
                body: {
                    type: "string",
                    example: "This is the body"
                }
            }
        }
    }
}
