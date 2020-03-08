const mailConfig = require("../config/mail");
const sendGrid = mailConfig.provider.sendGrid;
const provider = sendGrid.name
const request = require("request-promise-native");
const statusMessage = require("http-status-code");

exports.sendGridMail = async ({ to, cc, bcc, subject, body = "" }) => {
    const buildPayload = (from, to, cc, bcc, subject, body) => {
        const payload = {
            from: {
                email: from
            },
            "personalizations": [{
                "to": to,
                "subject": subject
            }],
            "content": [
                {
                    "type": "text/plain",
                    "value": body
                }
            ]
        }
        if (cc) {
            payload.personalizations[0].cc = cc
        }
        if (bcc) {
            payload.personalizations[0].bcc = bcc
        }
        return payload
    }

    const options = {
        method: "POST",
        uri: `${sendGrid.endPoint}${sendGrid.sendPath}`,
        headers: {
            "Authorization": `Bearer ${sendGrid.apiKey}`,
            "Content-Type": "application/json",
            "User-agent": "Siteminder/sendMail/v1"
        },
        body: buildPayload(mailConfig.from, to, cc, bcc, subject, body),
        json: true
    }
    try {
        const response = await request(options)
        return {
            provider,
            message: "Successfully queued",
            status: 200,
            messageId: Date.now()
        }
    } catch (error) {
        const status = (error && error.statusCode)? error.statusCode : 500;
        const message = (error && error.message)?
            error.message : statusMessage.getMessage(status, "HTTP/1.1")
        return { provider, message, status }
    }
}
