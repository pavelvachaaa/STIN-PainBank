import nodemailer, { TransportOptions, Transport } from "nodemailer";

/// TODO: Upravit do lepší podoby (špatně rozšířitelné pro ostatní účely, pošle to jen kod, enough for now) -> obecná service na odesílaní zpráv -> email bude jedna z mnoha 
const sendMail = ({ to, code }: { to: string, code: number }) => {

    var transporter = nodemailer.createTransport({
        host: process.env.SEND_IN_BLUE_HOST,
        port: process.env.SEND_IN_BLUE_PORT,
        secure: false,
        auth: {
            user: process.env.SEND_IN_BLUE_USER,
            pass: process.env.SEND_IN_BLUE_PASS
        },
    } as TransportOptions | Transport<any>);

    var mailOptions = {
        from: 'pavel.vacha@tul.cz',
        to: to,
        subject: 'PainBank - 2FA',
        text: `Zasíláme vám kod pro dvoufázové ověření: ${code}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            // Asi nechci throwovat chybu, protože by to zrušilo i tak úspěšný response
            // Tudíž uděláme tlačítko na opětovné odeslání kodu
            console.log('Email sent: ' + info.response);
        }
    });
}

export default sendMail