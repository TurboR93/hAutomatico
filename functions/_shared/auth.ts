// Autenticazione: verifica password (PBKDF2) + cookie di sessione firmato (HMAC-SHA256).
// Usa la Web Crypto API disponibile nel runtime Cloudflare Workers.

const COOKIE_NAME = 'hauth'
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 giorni
const enc = new TextEncoder()

// ---------- helpers base64 ----------

function base64ToBytes(b64: string) {
  const bin = atob(b64)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
  return out
}

function bytesToBase64url(bytes: Uint8Array): string {
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64urlToBytes(s: string) {
  const b64 = s.replace(/-/g, '+').replace(/_/g, '/')
  return base64ToBytes(b64)
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i]
  return diff === 0
}

// ---------- verifica password (PBKDF2-SHA256) ----------
// Formato hash:  pbkdf2-sha256$<iterazioni>$<saltBase64>$<hashBase64>
// Generato da scripts/hash-password.mjs.

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    const parts = stored.split('$')
    if (parts.length !== 4 || parts[0] !== 'pbkdf2-sha256') return false
    const iterations = parseInt(parts[1], 10)
    const salt = base64ToBytes(parts[2])
    const expected = base64ToBytes(parts[3])

    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(password),
      'PBKDF2',
      false,
      ['deriveBits'],
    )
    const bits = await crypto.subtle.deriveBits(
      { name: 'PBKDF2', salt, iterations, hash: 'SHA-256' },
      key,
      expected.length * 8,
    )
    return timingSafeEqual(new Uint8Array(bits), expected)
  } catch {
    return false
  }
}

// ---------- cookie di sessione firmato (HMAC-SHA256) ----------

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

async function signSession(secret: string, expMs: number): Promise<string> {
  const payload = bytesToBase64url(enc.encode(JSON.stringify({ exp: expMs })))
  const key = await hmacKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(payload))
  return `${payload}.${bytesToBase64url(new Uint8Array(sig))}`
}

export async function verifySession(token: string, secret: string): Promise<boolean> {
  try {
    const dot = token.indexOf('.')
    if (dot < 0) return false
    const payload = token.slice(0, dot)
    const sig = base64urlToBytes(token.slice(dot + 1))
    const key = await hmacKey(secret)
    const ok = await crypto.subtle.verify('HMAC', key, sig, enc.encode(payload))
    if (!ok) return false
    const data = JSON.parse(new TextDecoder().decode(base64urlToBytes(payload)))
    return typeof data.exp === 'number' && data.exp > Date.now()
  } catch {
    return false
  }
}

export function readSessionCookie(request: Request): string | null {
  const header = request.headers.get('Cookie')
  if (!header) return null
  for (const part of header.split(';')) {
    const [name, ...rest] = part.trim().split('=')
    if (name === COOKIE_NAME) return rest.join('=')
  }
  return null
}

export async function isAuthenticated(request: Request, secret: string): Promise<boolean> {
  const token = readSessionCookie(request)
  if (!token) return false
  return verifySession(token, secret)
}

export async function buildSessionCookie(secret: string, secure: boolean): Promise<string> {
  const exp = Date.now() + SESSION_TTL_MS
  const token = await signSession(secret, exp)
  const attrs = [
    `${COOKIE_NAME}=${token}`,
    'HttpOnly',
    'SameSite=Strict',
    'Path=/',
    `Max-Age=${Math.floor(SESSION_TTL_MS / 1000)}`,
  ]
  if (secure) attrs.push('Secure')
  return attrs.join('; ')
}

export function clearSessionCookie(secure: boolean): string {
  const attrs = [`${COOKIE_NAME}=`, 'HttpOnly', 'SameSite=Strict', 'Path=/', 'Max-Age=0']
  if (secure) attrs.push('Secure')
  return attrs.join('; ')
}

export function isSecureRequest(request: Request): boolean {
  return new URL(request.url).protocol === 'https:'
}
