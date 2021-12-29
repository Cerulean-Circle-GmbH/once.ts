import { ExpressKernel } from './ExpressKernel.js'
import forge from 'node-forge'
import fs from 'fs'
import https from 'https'
import path from 'path'

export class DevelopmentExpressKernel extends ExpressKernel {
  async start (port = 8443) {
    await super.start(port)
    console.log('running in node')

    return this
  }

  private getDevCertificate ():{key:string, cert:string} {
    const folder = '.ssl'
    const certPath = path.join(folder, 'cert.pem')
    const keyPath = path.join(folder, 'key.pem')
    if (!fs.existsSync(folder)) fs.mkdirSync(folder)

    if (fs.existsSync(certPath) && fs.existsSync(keyPath)) {
      return { key: fs.readFileSync(keyPath, 'utf-8'), cert: fs.readFileSync(certPath, 'utf-8') }
    }
    return this.createDevCertificate(certPath, keyPath)
  }

  createDevCertificate (certPath: string, keyPath: string): { key: string; cert: string } {
    const keypair = forge.pki.rsa.generateKeyPair(2048)
    const key = forge.pki.privateKeyToPem(keypair.privateKey)
    fs.writeFileSync(keyPath, key, 'utf-8')
    const certificate = forge.pki.createCertificate()
    certificate.publicKey = keypair.publicKey
    certificate.serialNumber = '2407198903062020'
    certificate.validity.notBefore = new Date()
    certificate.validity.notAfter = new Date()
    certificate.validity.notAfter.setFullYear(certificate.validity.notBefore.getFullYear() + 1)

    const attrs = [
      { name: 'organizationName', value: '2cu' },
      { shortName: 'OU', value: '2cu' }
    ]

    certificate.setSubject(attrs)
    certificate.setIssuer(attrs)
    certificate.setExtensions([
      {
        name: 'basicConstraints',
        cA: true
      },
      {
        name: 'keyUsage',
        keyCertSign: true,
        digitalSignature: true,
        nonRepudiation: true,
        keyEncipherment: true,
        dataEncipherment: true
      },
      {
        name: 'extKeyUsage',
        serverAuth: true,
        clientAuth: true,
        codeSigning: true,
        emailProtection: true,
        timeStamping: true
      },
      {
        name: 'nsCertType',
        client: true,
        server: true,
        email: true,
        objsign: true,
        sslCA: true,
        emailCA: true,
        objCA: true
      },
      {
        name: 'subjectAltName',
        altNames: [{
          type: 2, // URI
          value: 'localhost'
        },
        {
          type: 7, // IP
          ip: '127.0.0.1'
        }
        ]
      }
      // {
      //   name: 'subjectKeyIdentifier'
      // }
    ])

    certificate.sign(keypair.privateKey, forge.md.sha256.create())

    const cert = forge.pki.certificateToPem(certificate)
    fs.writeFileSync(certPath, cert, 'utf-8')
    return { key, cert }
  }

  async startServer (port: number) {
    const server = https.createServer(this.getDevCertificate(), this.express)
    server.listen(port, () =>  this.logUrls(`https://localhost:${port}`))
  }
}
