import crypto from "crypto";

const hash = (text: string): string => {
    return crypto.createHash('sha256').update(text).digest('base64');
}

export default hash