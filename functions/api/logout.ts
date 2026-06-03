import { clearSessionCookie, isSecureRequest } from '../_shared/auth'
import { json } from '../_shared/db'
import { Env } from '../_shared/types'

export const onRequestPost: PagesFunction<Env> = async ({ request }) => {
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie(isSecureRequest(request)) })
}
