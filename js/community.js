// ═══════════════════════════════════════════════════
// CP VIHOUTOU — Community JS
// ═══════════════════════════════════════════════════

import { supabase, getCurrentUser } from './supabase-client.js'

// ── Charger le fil d'actualité ──
export async function loadFeed(limit = 20, offset = 0) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles(full_name, avatar_url), reactions(count), comments(count)')
    .eq('published', true)
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)
  if (error) throw error
  return data
}

// ── Créer un post ──
export async function createPost({ content, imageUrl = null }) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Non connecté')
  const { data, error } = await supabase.from('posts').insert({
    author_id: user.id,
    content,
    image_url: imageUrl,
    published: true
  }).select().single()
  if (error) throw error
  return data
}

// ── Réagir à un post ──
export async function toggleReaction(postId, type = 'like') {
  const user = await getCurrentUser()
  if (!user) throw new Error('Non connecté')
  const { data: existing } = await supabase
    .from('reactions')
    .select('id')
    .eq('post_id', postId)
    .eq('user_id', user.id)
    .eq('type', type)
    .single()
  if (existing) {
    await supabase.from('reactions').delete().eq('id', existing.id)
    return false // unliked
  } else {
    await supabase.from('reactions').insert({ post_id: postId, user_id: user.id, type })
    return true // liked
  }
}

// ── Commenter ──
export async function addComment(postId, content) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Non connecté')
  const { data, error } = await supabase.from('comments').insert({
    post_id: postId,
    author_id: user.id,
    content
  }).select().single()
  if (error) throw error
  return data
}

// ── Signaler un post ──
export async function reportPost(postId, reason) {
  const user = await getCurrentUser()
  if (!user) throw new Error('Non connecté')
  await supabase.from('reports').insert({ post_id: postId, reported_by: user.id, reason })
}
