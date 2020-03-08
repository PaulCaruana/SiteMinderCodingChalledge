module.exports = {
    from: "'Paul Borg'<paul.q.borg@gmail.com>",
    primary: "mailGun",
    secondary: "sendGrid",
    provider: {
        mailGun: {
            name: "Mail Gun",
            endPoint: "https://api.mailgun.net/v3/sandboxcf31ef7cad4848c7a13fa17c3deb9667.mailgun.org/",
            sendPath: "messages",
            apiKey: process.env["MAILGUN_API_KEY"]
        },
        sendGrid: {
            name: "Send Grid",
            endPoint: "https://api.sendgrid.com/v3/",
            sendPath: "mail/send",
            apiKey: process.env["SENDGRID_API_KEY"]
        }
    }
}