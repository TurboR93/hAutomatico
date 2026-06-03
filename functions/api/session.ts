import { isAuthenticated } from '../_shared/auth'
import { json } from '../_shared/db'
import { Env } from '../_shared/types'

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  return json({ authenticated: await isAuthenticated(request, env.AUTH_SECRET) })
}
