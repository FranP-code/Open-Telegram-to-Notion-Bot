import crypto from 'crypto'
require('dotenv').config()

const algorithm = 'aes-256-ctr'
const secretKey = <string>process.env.ENCRYPT_KEY
const iv = crypto.randomBytes(16)

const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv)
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()])

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  }
}

const decrypt = (hash: {
  iv: string,
content: string,
}) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'))
  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()])

  return decrpyted.toString()
}

export {
  encrypt,
  decrypt
}
