const btoa = require("btoa")
const mailConfig = require("../config/mail")
const mailGun = mailConfig.provider.mailGun
const provider = mailGun.name
const request = require("request-promise-native")
const statusMessage = require("http-status-code")

exports.sendMailGunMail = async ({ to, cc, bcc, subject, body = "" }) => {

    const buildPayload = (from, to, cc, bcc, subject, body) => {
        // Format addresses into 'Name'<email>, ...
        const formatAddress = ({ name, email }) => (name) ? `"${name}" <${email}>` : email;
        const toRecipents = (emails) => emails.map((emailAddr) => formatAddress(emailAddr)).join(", ")

        const payload = {
            from,
            to: toRecipents(to),
            subject,
            text: body
        }
        if (cc) {
            payload.cc = toRecipents(cc);
        }
        if (bcc) {
            payload.cc = toRecipents(bcc);
        }

        // Convert JSON into URLEncoded as Mail Gun does not accept JSON
        const payloadUrlEncoded = Object.keys(payload).map((key) => {
            return encodeURIComponent(key) + "=" + encodeURIComponent(payload[key]);
        }).join("&");
        return payloadUrlEncoded;

    }

    const options = {
        method: "POST",
        uri: `${mailGun.endPoint}${mailGun.sendPath}`,
        headers: {
            "Authorization": "Basic " + btoa("api:" + mailGun.apiKey),
            "Content-Type": "application/x-www-form-urlencoded",
            "User-agent": "Siteminder/sendMail/v1"
        },
        body: buildPayload(mailConfig.from, to, cc, bcc, subject, body),
        json: true
    }
    let response;
    try {
        response = await request(options)
        if (response.id) {
            return {
                provider: provider,
                message: response.message,
                status: 200,
                messageId: response.id
            }
        }
        return {
            provider: provider,
            message: statusMessage.getMessage(400, "HTTP/1.1"),
            status: response.statusCode
        }
    } catch (error) {
        const status = (error && error.statusCode)? error.statusCode : 500;
        const message = (error && error.error && error.error.message)?
            error.error.message : statusMessage.getMessage(status, "HTTP/1.1")
        console.error(message)
        return { provider, message, status }
    }
}
