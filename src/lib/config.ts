/**
 * Public Supabase client configuration.
 *
 * The URL and publishable (anon) key are intentionally public — they are
 * designed to be embedded in client-side code. Database security is enforced
 * entirely by PostgreSQL Row Level Security (RLS) policies on the Supabase
 * side, not by keeping these values secret.
 *
 * NEVER put the service_role / secret key here.
 */
export const SUPABASE_URL = 'https://jsnphpypjonafintnblh.supabase.co'
export const SUPABASE_PUBLISHABLE_KEY =
  'sb_publishable_dN4EcfsNKg3axB5smEZisQ_EVPj6oZi'
