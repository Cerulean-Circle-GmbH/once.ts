import { ExpressKernel } from './ExpressKernel.js'
import forge from 'node-forge'
import fs from 'fs'
import https from 'https'
import path from 'path'

// @ts-ignore
// import * as selfsigned from 'selfsigned'

export class DevelopmentExpressKernel extends ExpressKernel {
  async start (port = 8443) {
    await super.start(port)
    console.log('running in node')

    return this
  }

  private getDevCertificate ():{key:string, cert:string} {
    // const attrs = [{ name: 'commonName', value: 'localhost' }]
    // const pems = selfsigned.generate(attrs, {
    //   keySize: 2048, // the size for the private key in bits (default: 1024)
    //   days: 30, // how long till expiry of the signed certificate (default: 365)
    //   algorithm: 'sha256', // sign the certificate with specified algorithm (default: 'sha1')
    //   extensions: [{ name: 'basicConstraints', cA: true }], // certificate extensions array
    //   pkcs7: true, // include PKCS#7 as part of the output (default: false)
    //   clientCertificate: true, // generate client cert signed by the original key (default: false)
    //   clientCertificateCN: 'jdoe' // client certificate's common name (default: 'John Doe jdoe123')
    // })
    // console.log('PEMS', pems)
    // return { key: pems.private, cert: pems.cert }
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
    server.listen(port, 'localhost', () => {
      console.log(`localhost:   https://localhost${port}`)
      console.log(`repository:  https://localhost${port}/EAMD.ucp`)
    })
  }
}
