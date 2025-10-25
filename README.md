# 🍺 SOIF MyBarFinder

**Application web mobile pour découvrir les meilleurs bars de Montpellier**

Une PWA (Progressive Web App) pour gérer et rechercher parmi 100 bars authentiques de Montpellier avec un système de filtres avancé.

---

## 🎯 Fonctionnalités

### 📋 Gestion des Bars
- ✅ Base de données de 100 bars authentiques de Montpellier
- ✅ Ajout/Modification/Suppression de bars
- ✅ Tri alphabétique automatique (sans les articles)
- ✅ Sauvegarde automatique dans le navigateur (localStorage)
- ✅ Export/Import JSON (compatible mobile & desktop)
- ✅ Réinitialisation vers la base originale

### 🔍 Recherche Avancée
- ✅ Recherche par nom, type ou adresse
- ✅ Filtres multiples (quartiers, ambiances, musiques, etc.)
- ✅ Mode "Surprends-moi !" pour découvrir un bar au hasard
- ✅ Compteur de résultats en temps réel
- ✅ Filtres personnalisés (créer vos propres tags)

### 🎨 Interface
- ✅ Design mobile-first responsive
- ✅ Thème sombre élégant (violet/rose)
- ✅ Animations fluides
- ✅ Navigation par onglets (Gestion / Recherche)
- ✅ Compatible iOS & Android

### 📊 Analytics
- ✅ Google Analytics 4 intégré
- ✅ Suivi des actions utilisateurs
- ✅ Statistiques d'utilisation

---

## 📁 Structure du Projet

```
soif-mybarfinder/
├── index.html          # Structure HTML de l'application
├── style.css           # Styles CSS (mobile-first)
├── app.js              # Logique JavaScript principale
├── bars.json           # Base de données des 100 bars
├── filters.json        # Configuration des filtres
└── README.md           # Documentation (ce fichier)
```

---

## 🚀 Installation & Déploiement

### Option 1 : GitHub Pages (Recommandé)

1. **Créer un repository GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SOIF MyBarFinder"
   git branch -M main
   git remote add origin https://github.com/VOTRE_USERNAME/soif-mybarfinder.git
   git push -u origin main
   ```

2. **Activer GitHub Pages**
   - Aller dans `Settings` > `Pages`
   - Source : `Deploy from a branch`
   - Branch : `main` / `root`
   - Sauvegarder

3. **Accéder à l'app**
   - URL : `https://VOTRE_USERNAME.github.io/soif-mybarfinder/`

### Option 2 : Netlify

1. Connecter votre repository GitHub à Netlify
2. Build settings : aucun build nécessaire
3. Publish directory : `/` (racine)
4. Déployer !

### Option 3 : Local (Développement)

```bash
# Cloner le projet
git clone https://github.com/VOTRE_USERNAME/soif-mybarfinder.git
cd soif-mybarfinder

# Lancer un serveur local (Python 3)
python -m http.server 8000

# Ou avec Node.js
npx http-server

# Ouvrir dans le navigateur
open http://localhost:8000
```

---

## 📝 Configuration

### Google Analytics (Optionnel)

Dans `index.html`, ligne 9-17, remplacer votre ID :
```javascript
gtag('config', 'G-VOTRE_ID_ICI');
```

Pour désactiver Analytics, supprimer tout le bloc `<script>` Google Analytics.

---

## 🗂️ Format des Données

### `bars.json`
```json
[
  {
    "id": 1,
    "name": "Le Rockstore",
    "type": "Bar Rock / Concert",
    "address": "20 Rue de Verdun, 34000 Montpellier",
    "distance": 0.8,
    "features": ["concerts", "rock", "underground", "ecusson", "festif"]
  }
]
```

### `filters.json`
```json
{
  "quartiers": [
    {"id": "ecusson", "label": "🛡️ Écusson"},
    {"id": "antigone", "label": "🏛️ Antigone"}
  ],
  "ambiances": [
    {"id": "cosy", "label": "🛋️ Cosy"},
    {"id": "festif", "label": "🎉 Festif"}
  ]
}
```

---

## 🎨 Personnalisation

### Modifier les Couleurs

Dans `style.css`, modifier les variables :
```css
background: linear-gradient(135deg, #1a0f24 0%, #2d1b3d 100%);
/* Changer les codes couleurs hex */
```

### Ajouter des Catégories de Filtres

Dans `filters.json`, ajouter une nouvelle catégorie :
```json
{
  "nouvelle_categorie": [
    {"id": "mon_filtre", "label": "🎯 Mon Filtre"}
  ]
}
```

---

## 📱 Utilisation

### 🍺 Onglet "Fiche Bar"
1. **Ajouter un bar** : Cliquer sur "+ Ajouter un nouveau bar"
2. **Modifier** : Cliquer sur "✏️ Modifier" sur une fiche
3. **Supprimer** : Cliquer sur "🗑️ Supprimer" (confirmation requise)
4. **Exporter** : Télécharger vos données en JSON
5. **Importer** : Restaurer depuis un fichier JSON
6. **Réinitialiser** : Retour aux 100 bars d'origine

### 🔍 Onglet "Recherche"
1. **Recherche texte** : Taper dans la barre de recherche
2. **Filtres** : Cliquer sur les filtres désirés (cumul possible)
3. **Voir résultats** : Bouton avec compteur en temps réel
4. **Surprends-moi** : Découvrir un bar au hasard
5. **Ajouter filtre** : Créer vos propres tags personnalisés

---

## 🛠️ Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Animations, gradients, flexbox, grid
- **JavaScript (Vanilla)** : Aucune dépendance externe
- **LocalStorage** : Persistance des données
- **JSON** : Format de données
- **Google Analytics 4** : Suivi statistiques (optionnel)

---

## 📊 Statistiques Projet

- **100 bars** authentiques de Montpellier
- **200+ filtres** disponibles (13 catégories)
- **0 dépendance** externe (Vanilla JS)
- **100% responsive** mobile & desktop
- **PWA-ready** (peut être installé sur mobile)

---

## 🐛 Débogage

### L'app ne charge pas ?
- Vérifier que `bars.json` et `filters.json` sont dans le même dossier
- Ouvrir la console (F12) pour voir les erreurs
- Vérifier que vous utilisez un serveur HTTP (pas `file://`)

### Les données ne se sauvegardent pas ?
- Vérifier que localStorage est activé dans votre navigateur
- En navigation privée, localStorage ne persiste pas

### Problème d'encodage des accents ?
- Vérifier que tous les fichiers sont en **UTF-8**
- Dans `index.html` : `<meta charset="UTF-8">`

---

## 📄 Licence

**MIT License** - Libre d'utilisation, modification et distribution.

© 2025 SOIF MyBarFinder
Contact : soif.mybarfinder@gmail.com

---

## 🚀 Roadmap Future

- [ ] PWA complète avec Service Worker
- [ ] Mode hors-ligne
- [ ] Géolocalisation & carte interactive
- [ ] Notes & avis utilisateurs
- [ ] Partage sur réseaux sociaux
- [ ] Favoris & listes personnalisées
- [ ] Dark/Light mode toggle
- [ ] Multi-langues (EN/FR/ES)

---

## 🤝 Contribution

Les contributions sont bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📞 Support

**Bugs & Suggestions** : Ouvrir une issue sur GitHub

**Email** : soif.mybarfinder@gmail.com

---

**Made with 🍺 in Montpellier**
