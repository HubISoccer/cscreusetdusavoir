# COMPLEXE SCOLAIRE LE CREUSET DU SAVOIR— Excellence · Discipline · Avenir

Portail web institutionnel dynamique.

## Stack
- HTML5 + CSS3 + JavaScript ES6+ (modules)
- Supabase (base de données + auth)
- GitHub Pages (hébergement)
- Font Awesome 6 + Google Fonts (Poppins)

## Structure
```
cpvihoutou/
├─ index.html              ← Accueil
├─ css/                    ← Styles
├─ js/                     ← Scripts
├─ assets/                 ← Médias
├─ pages/                  ← Pages publiques
├─ auth/                   ← Authentification
├─ community/              ← Espace communauté
├─ dashboards/             ← Tableaux de bord
├─ admin/                  ← Back office
└─ README.md
```

## Configuration Supabase
Dans `js/supabase-client.js`, remplace :
- `SUPABASE_URL` → ton URL Supabase
- `SUPABASE_ANON_KEY` → ta clé publique Supabase

## Déploiement GitHub Pages
1. `git init && git add . && git commit -m "Initial commit"`
2. `git remote add origin https://github.com/TON_USER/cscreusetdusavoir.git`
3. `git push -u origin main`
4. Dans GitHub → Settings → Pages → Source : main, dossier : /root

Généré automatiquement par `generate_cscreusetdusavoir.py`
