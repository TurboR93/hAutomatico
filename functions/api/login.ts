import { buildSessionCookie, isSecureRequest, verifyPassword } from '../_shared/auth'
import {
  clearLoginFailures,
  errorJson,
  isLoginLocked,
  json,
  registerLoginFailure,
} from '../_shared/db'
import { Env } from '../_shared/types'

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  if (!env.ADMIN_PASSWORD_HASH || !env.AUTH_SECRET) {
    return errorJson('Configurazione mancante: secret non impostati su Cloudflare', 500)
  }

  const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
  if (await isLoginLocked(env.DB, ip)) {
    return errorJson('Troppi tentativi falliti. Riprova tra qualche minuto.', 429)
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return errorJson('JSON non valido', 400)
  }
  const password = (body as { password?: unknown } | null)?.password
  if (typeof password !== 'string' || password.length === 0) {
    return errorJson('Password mancante', 400)
  }

  if (!(await verifyPassword(password, env.ADMIN_PASSWORD_HASH))) {
    await registerLoginFailure(env.DB, ip)
    return errorJson('Password errata', 401)
  }

  await clearLoginFailures(env.DB, ip)
  const cookie = await buildSessionCookie(env.AUTH_SECRET, isSecureRequest(request))
  return json({ ok: true }, 200, { 'Set-Cookie': cookie })
}
