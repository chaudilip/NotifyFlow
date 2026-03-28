import crypto from "crypto"

export const hashApiKey = (rawKey:string):string => {
    return crypto.createHash('sha256').update(rawKey).digest('hex')

}