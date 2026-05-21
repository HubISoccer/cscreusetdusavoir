// ═══════════════════════════════════════════════════
// CP VIHOUTOU — Supabase Client
// Remplace SUPABASE_URL et SUPABASE_ANON_KEY par tes vraies valeurs
// ═══════════════════════════════════════════════════

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const SUPABASE_URL = 'https://jkgthtberijvdpawjdzb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImprZ3RodGJlcmlqdmRwYXdqZHpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzNjQyOTksImV4cCI6MjA5NDk0MDI5OX0.Deok1mQmJNvtzHCYDoMbnRqe5mdIgEac_DqIdTVzkyU'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Helper : récupère la session courante
export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// Helper : récupère l'utilisateur connecté
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Helper : récupère le profil utilisateur depuis la table profiles
export async function getUserProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, roles(name, slug)')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

// Helper : écrire un log d'activité
export async function writeAuditLog(action, targetTable, targetId, details = {}) {
  const user = await getCurrentUser()
  if (!user) return
  await supabase.from('audit_logs').insert({
    user_id: user.id,
    action,
    target_table: targetTable,
    target_id: targetId,
    details
  })
}

window.supabaseClient = { supabase, getSession, getCurrentUser, getUserProfile }
