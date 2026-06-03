// Genera l'hash PBKDF2-SHA256 della password admin da salvare come secret
// Cloudflare `ADMIN_PASSWORD_HASH`. La password in chiaro NON viene mai salvata.
//
// Uso:
//   npm run hash-password                 (chiede la password senza mostrarla)
//   npm run hash-password -- "miaPass"    (sconsigliato: resta nella history)
//
// Genera anche un AUTH_SECRET casuale pronto da copiare.
//
// Formato hash:  pbkdf2-sha256$<iterazioni>$<saltBase64>$<hashBase64>
// Deve restare allineato a functions/_shared/auth.ts (verifyPassword).

import { pbkdf2Sync, randomBytes } from 'node:crypto'
import { createInterface } from 'node:readline'

const ITERATIONS = 100000 // massimo consentito da Cloudflare Workers per PBKDF2
const KEYLEN = 32
const DIGEST = 'sha256'
const MIN_LENGTH = 12

function hashPassword(password) {
  const salt = randomBytes(16)
  const hash = pbkdf2Sync(password, salt, ITERATIONS, KEYLEN, DIGEST)
  return `pbkdf2-sha256$${ITERATIONS}$${salt.toString('base64')}$${hash.toString('base64')}`
}

function askHidden(question) {
  return new Promise((resolve) => {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    const stdout = process.stdout
    rl._writeToOutput = (str) => {
      // Mostra il prompt ma maschera i caratteri digitati
      if (str.includes(question)) stdout.write(str)
      else stdout.write('*')
    }
    rl.question(question, (answer) => {
      rl.close()
      stdout.write('\n')
      resolve(answer)
    })
  })
}

async function main() {
  let password = process.argv[2]
  if (!password) {
    password = await askHidden('Password admin: ')
  }
  if (!password || password.length < MIN_LENGTH) {
    console.error(`\nErrore: scegli una password di almeno ${MIN_LENGTH} caratteri.`)
    process.exit(1)
  }

  const hash = hashPassword(password)
  const authSecret = randomBytes(32).toString('base64')

  console.log('\nCopia questi due valori nei Secret di Cloudflare Pages')
  console.log('(Settings -> Environment variables, tipo "Secret", Production + Preview):\n')
  console.log('ADMIN_PASSWORD_HASH=' + hash)
  console.log('AUTH_SECRET=' + authSecret)
  console.log('\nPer lo sviluppo locale incollali in .dev.vars (già in .gitignore).')
}

main()
