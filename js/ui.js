// ═══════════════════════════════════════════════════
// CP VIHOUTOU — UI Helpers
// ═══════════════════════════════════════════════════

// ── Toast notification ──
export function toast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container') || createToastContainer()
  const t = document.createElement('div')
  t.className = `toast toast-${type}`
  const icons = { success: 'check-circle', danger: 'exclamation-circle', warning: 'exclamation-triangle', info: 'info-circle' }
  t.innerHTML = `<i class="fas fa-${icons[type]}"></i><span>${message}</span>`
  container.appendChild(t)
  setTimeout(() => t.classList.add('show'), 10)
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 300) }, duration)
}

function createToastContainer() {
  const div = document.createElement('div')
  div.id = 'toast-container'
  document.body.appendChild(div)
  return div
}

// ── Confirm dialog ──
export function confirm(message) {
  return new Promise(resolve => {
    const overlay = document.createElement('div')
    overlay.className = 'modal-overlay active'
    overlay.innerHTML = `
      <div class="modal" style="max-width:400px">
        <div class="modal-header"><h3 class="modal-title">Confirmation</h3></div>
        <p style="margin-bottom:1.5rem">${message}</p>
        <div style="display:flex;gap:.75rem;justify-content:flex-end">
          <button class="btn btn-ghost" id="confirm-no">Annuler</button>
          <button class="btn btn-danger" id="confirm-yes">Confirmer</button>
        </div>
      </div>`
    document.body.appendChild(overlay)
    overlay.querySelector('#confirm-yes').onclick = () => { overlay.remove(); resolve(true) }
    overlay.querySelector('#confirm-no').onclick = () => { overlay.remove(); resolve(false) }
  })
}

// ── Format date FR ──
export function formatDate(isoDate, options = {}) {
  return new Date(isoDate).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric', ...options
  })
}

// ── Truncate text ──
export function truncate(text, maxLength = 120) {
  return text.length > maxLength ? text.slice(0, maxLength) + '…' : text
}

// ── Slugify ──
export function slugify(text) {
  return text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}
