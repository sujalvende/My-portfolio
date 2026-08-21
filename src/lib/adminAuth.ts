import { supabase } from './supabase'

export async function getAdminSession() {
  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError || !session || !session.user) {
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
  } catch {
    return { session: null, isAdmin: false }
  }
}
