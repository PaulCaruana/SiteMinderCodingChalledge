const { sendMailGunMail } = require("../services/mailGunService")
const { sendGridMail } = require("../services/sendGridService")
const statusMessage = require("http-status-code");
const primary = require("../config/mail").primary;
const secondary = require("../config/mail").secondary;
const providers = {
    mailGun: sendMailGunMail,
    sendGrid: sendGridMail
}
const sendPrimary = providers[primary];
const sendSecondary = providers[secondary];

exports.sendMail = async (msg) => {
    try {
        const primaryResponse = await sendPrimary(msg);
        if (primaryResponse.status > 200 && primaryResponse.status < 299) {
            return primaryResponse;
        }
        const secondaryResponse = await sendSecondary(msg);
        secondaryResponse.primaryError = primaryResponse;
        return secondaryResponse;
    } catch (error) {
        // Should never get here as services have try/catch but just in case I'm wrong
        console.error(error)
        return {
            message: statusMessage.getMessage(500, "HTTP/1.1"),
            status: 500
        }
    }
}