import { supabase } from './supabase'

export async function getAdminSession() {
  const {
    data: { session },
    error: sessionError,
  } = await supabase.auth.getSession()

  if (sessionError || !session) {
    return { session: null, isAdmin: false }
  }

  const { data: adminUser, error: adminError } = await supabase
    .from('admin_users')
    .select('user_id')
    .eq('user_id', session.user.id)
    .maybeSingle()

  return {
    session,
    isAdmin: !adminError && Boolean(adminUser),
  }
}
