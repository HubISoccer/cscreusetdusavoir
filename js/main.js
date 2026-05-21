// ═══════════════════════════════════════════════════
// CP VIHOUTOU — Main JS
// ═══════════════════════════════════════════════════

import { supabase, getCurrentUser } from './supabase-client.js'

// ── Mise à jour UI selon authentification ──
async function updateAuthUI() {
  const user = await getCurrentUser()
  const loginBtn = document.querySelector('.header-actions .btn-outline')
  const registerBtn = document.querySelector('.header-actions .btn-primary[href*="inscription"]')
  if (user) {
    if (loginBtn) {
      loginBtn.href = '/pages/profile/index.html'
      loginBtn.textContent = 'Mon espace'
    }
  }
}

// ── Chargement des dernières actualités (page d'accueil) ──
async function loadLatestNews() {
  const container = document.getElementById('latest-news')
  if (!container) return
  const { data, error } = await supabase
    .from('news')
    .select('id, title, slug, excerpt, thumbnail_url, published_at, category')
    .eq('published', true)
    .order('published_at', { ascending: false })
    .limit(3)
  if (error || !data) return
  container.innerHTML = data.map(article => `
    <div class="news-card reveal">
      <img class="news-card-img" src="${article.thumbnail_url || 'assets/images/placeholder.jpg'}" alt="${article.title}" />
      <div class="news-card-body">
        <div class="news-card-meta">
          <span class="badge badge-primary">${article.category || 'Actualité'}</span>
          <span class="news-card-date">${new Date(article.published_at).toLocaleDateString('fr-FR', {day:'numeric',month:'long',year:'numeric'})}</span>
        </div>
        <h3 class="news-card-title">${article.title}</h3>
        <p class="news-card-excerpt">${article.excerpt || ''}</p>
      </div>
      <div class="news-card-footer">
        <a href="pages/news/school-news.html?slug=${article.slug}" class="btn btn-ghost btn-sm">Lire la suite <i class="fas fa-arrow-right"></i></a>
      </div>
    </div>
  `).join('')
  document.querySelectorAll('.reveal').forEach(el => {
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) entry.target.classList.add('visible')
    }).observe(el)
  })
}

// ── Compteur animé (stats) ──
function animateCounters() {
  document.querySelectorAll('[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count)
    let current = 0
    const step = Math.ceil(target / 60)
    const interval = setInterval(() => {
      current = Math.min(current + step, target)
      el.textContent = current.toLocaleString('fr-FR') + (el.dataset.suffix || '')
      if (current >= target) clearInterval(interval)
    }, 25)
  })
}

// ── Formulaire de contact ──
async function handleContactForm() {
  const form = document.getElementById('contact-form')
  if (!form) return
  form.addEventListener('submit', async (e) => {
    e.preventDefault()
    const btn = form.querySelector('button[type="submit"]')
    btn.disabled = true
    btn.innerHTML = '<span class="loader" style="width:20px;height:20px;margin:0"></span> Envoi...'
    const fd = new FormData(form)
    const payload = Object.fromEntries(fd.entries())
    const { error } = await supabase.from('messages').insert(payload)
    if (error) {
      showAlert(form, 'danger', 'Une erreur est survenue. Veuillez réessayer.')
    } else {
      showAlert(form, 'success', 'Message envoyé avec succès. Nous vous répondrons bientôt.')
      form.reset()
    }
    btn.disabled = false
    btn.innerHTML = 'Envoyer le message'
  })
}

// ── Helper : afficher une alerte ──
function showAlert(container, type, message) {
  const alert = document.createElement('div')
  alert.className = `alert alert-${type}`
  alert.innerHTML = `<i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i><span>${message}</span>`
  container.prepend(alert)
  setTimeout(() => alert.remove(), 5000)
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  updateAuthUI()
  loadLatestNews()
  handleContactForm()

  // Lancer les compteurs quand la section entre en vue
  const statsSection = document.querySelector('.stats-grid')
  if (statsSection) {
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { animateCounters(); obs.disconnect() }
    }, { threshold: 0.3 })
    obs.observe(statsSection)
  }
})
