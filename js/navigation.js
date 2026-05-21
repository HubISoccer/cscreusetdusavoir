// ═══════════════════════════════════════════════════
// CP VIHOUTOU — Navigation & Mobile Menu
// ═══════════════════════════════════════════════════

document.addEventListener('DOMContentLoaded', () => {

  // ── Mobile Menu ──
  const toggle = document.getElementById('mobile-menu-toggle')
  const nav = document.getElementById('site-nav')
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('mobile-open')
      toggle.classList.toggle('active')
    })
  }

  // ── Sticky header ──
  const header = document.getElementById('site-header')
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 20)
    }, { passive: true })
  }

  // ── Highlight active nav link ──
  const currentPath = window.location.pathname
  document.querySelectorAll('.nav-list a').forEach(link => {
    if (link.getAttribute('href') && currentPath.includes(link.getAttribute('href').replace('../','').replace('./','').replace('index.html',''))) {
      link.classList.add('active')
    }
  })

  // ── Smooth scroll pour ancres ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'))
      if (target) {
        e.preventDefault()
        target.scrollIntoView({ behavior: 'smooth', block: 'start' })
        nav?.classList.remove('mobile-open')
      }
    })
  })

  // ── Accordion ──
  document.querySelectorAll('.accordion-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling
      const isOpen = body.classList.contains('active')
      document.querySelectorAll('.accordion-body.active').forEach(b => b.classList.remove('active'))
      document.querySelectorAll('.accordion-header.active').forEach(b => b.classList.remove('active'))
      if (!isOpen) { body.classList.add('active'); btn.classList.add('active') }
    })
  })

  // ── Tabs ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab
      const tabGroup = btn.closest('.tabs')
      if (!tabGroup) return
      tabGroup.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
      tabGroup.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'))
      btn.classList.add('active')
      document.getElementById(tabId)?.classList.add('active')
    })
  })

  // ── Modal ──
  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modal = document.getElementById(btn.dataset.modal)
      modal?.classList.add('active')
    })
  })
  document.querySelectorAll('.modal-close, .modal-overlay').forEach(el => {
    el.addEventListener('click', (e) => {
      if (e.target === el) el.closest('.modal-overlay')?.classList.remove('active')
    })
  })

  // ── Reveal on scroll ──
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible')
    })
  }, { threshold: 0.1 })
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el))

})
