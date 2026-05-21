// ═══════════════════════════════════════════════════
// CP VIHOUTOU — Admin JS (back office)
// ═══════════════════════════════════════════════════

import { supabase, getCurrentUser, getUserProfile, writeAuditLog } from './supabase-client.js'

// ── Guard : vérifier que l'utilisateur est admin ──
export async function guardAdmin(allowedRoles = ['super-admin', 'admin-contenu']) {
  const user = await getCurrentUser()
  if (!user) {
    window.location.href = '/admin/login.html'
    return false
  }
  const profile = await getUserProfile(user.id)
  if (!profile || !allowedRoles.includes(profile.roles?.slug)) {
    window.location.href = '/admin/login.html'
    return false
  }
  return profile
}

// ── CRUD Générique ──
export async function fetchAll(table, options = {}) {
  let query = supabase.from(table).select(options.select || '*')
  if (options.eq) query = query.eq(options.eq[0], options.eq[1])
  if (options.order) query = query.order(options.order, { ascending: options.ascending ?? false })
  if (options.limit) query = query.limit(options.limit)
  const { data, error } = await query
  if (error) throw error
  return data
}

export async function insertRow(table, row) {
  const { data, error } = await supabase.from(table).insert(row).select().single()
  if (error) throw error
  await writeAuditLog('INSERT', table, data.id, row)
  return data
}

export async function updateRow(table, id, updates) {
  const { data, error } = await supabase.from(table).update(updates).eq('id', id).select().single()
  if (error) throw error
  await writeAuditLog('UPDATE', table, id, updates)
  return data
}

export async function deleteRow(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
  await writeAuditLog('DELETE', table, id, {})
}

export async function togglePublished(table, id, currentState) {
  return updateRow(table, id, { published: !currentState, published_at: !currentState ? new Date().toISOString() : null })
}
