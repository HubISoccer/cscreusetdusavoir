// ═══════════════════════════════════════════════════
// CP VIHOUTOU — Auth Manager
// ═══════════════════════════════════════════════════

import { supabase, getUserProfile } from './supabase-client.js'

// ── Inscriptions ──
export async function registerUser({ email, password, fullName, role = 'visiteur' }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  })
  if (error) throw error
  // Créer le profil
  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      email
    })
    if (profileError) console.warn('Profil non créé:', profileError)
  }
  return data
}

// ── Connexion ──
export async function loginUser({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw error
  return data
}

// ── Déconnexion ──
export async function logoutUser() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
  window.location.href = '/auth/login.html'
}

// ── Mot de passe oublié ──
export async function resetPassword(email) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/verify-email.html`
  })
  if (error) throw error
}

// ── Redirection selon rôle ──
export async function redirectToDashboard(userId) {
  try {
    const profile = await getUserProfile(userId)
    const roleSlug = profile?.roles?.slug || 'visiteur'
    const dashboards = {
      'super-admin': '/admin/dashboard.html',
      'admin-contenu': '/admin/content.html',
      'directeur': '/dashboards/director.html',
      'enseignant': '/dashboards/teacher.html',
      'parent': '/dashboards/parent.html',
      'eleve': '/dashboards/student.html',
      'comptable': '/dashboards/accountant.html',
      'secretaire': '/dashboards/staff.html',
      'moderateur': '/dashboards/staff.html',
    }
    window.location.href = dashboards[roleSlug] || '/pages/profile/index.html'
  } catch (e) {
    window.location.href = '/pages/profile/index.html'
  }
}

// ── Listener session ──
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    // Nettoyer l'état UI si besoin
    document.dispatchEvent(new CustomEvent('auth:signedOut'))
  }
  if (event === 'SIGNED_IN') {
    document.dispatchEvent(new CustomEvent('auth:signedIn', { detail: session }))
  }
})
