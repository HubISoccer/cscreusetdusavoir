// ═══════════════════════════════════════════════════
// CP VIHOUTOU — Forms Handler
// ═══════════════════════════════════════════════════

import { supabase } from './supabase-client.js'

// ── Validation basique ──
export function validateForm(fields) {
  const errors = {}
  fields.forEach(({ name, value, rules }) => {
    if (rules.required && !value.trim()) errors[name] = 'Ce champ est obligatoire.'
    if (rules.email && value && !/^[^@]+@[^@]+\.[^@]+$/.test(value)) errors[name] = 'Email invalide.'
    if (rules.minLength && value.length < rules.minLength) errors[name] = `Minimum ${rules.minLength} caractères.`
  })
  return errors
}

// ── Pré-inscription ──
export async function submitPreRegistration(data) {
  const { error } = await supabase.from('requests').insert({
    type: 'pre-registration',
    data,
    status: 'pending'
  })
  if (error) throw error
}

// ── Demande d'information ──
export async function submitInfoRequest(data) {
  const { error } = await supabase.from('requests').insert({
    type: 'info-request',
    data,
    status: 'pending'
  })
  if (error) throw error
}

// ── Abonnement newsletter ──
export async function subscribeNewsletter(email) {
  const { error } = await supabase.from('subscriptions').insert({
    email,
    type: 'newsletter',
    active: true
  })
  if (error) throw error
}
