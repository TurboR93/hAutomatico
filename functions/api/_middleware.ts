// Gate di autenticazione per tutte le richieste /api/*.
// Lascia passare senza cookie solo POST /api/login e GET /api/session.

import { isAuthenticated } from '../_shared/auth'
import { errorJson } from '../_shared/db'
import { Env } from '../_shared/types'

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env, next } = context
  const path = new URL(request.url).pathname
  const method = request.method.toUpperCase()

  const isLogin = path === '/api/login'
  const isSession = path === '/api/session'
  if ((isLogin && (method === 'POST' || method === 'OPTIONS')) || (isSession && method === 'GET')) {
    return next()
  }

  if (!(await isAuthenticated(request, env.AUTH_SECRET))) {
    return errorJson('unauthorized', 401)
  }
  return next()
}
