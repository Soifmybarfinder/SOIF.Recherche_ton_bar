# 🍺 SOIF MyBarFinder

**Application web mobile pour découvrir les meilleurs bars de Montpellier**

Une PWA (Progressive Web App) pour gérer et rechercher parmi 118 bars authentiques de Montpellier avec un système de filtres avancé, bandeau de résultats en temps réel et intégration Google Maps.

---

## 🎯 Fonctionnalités

### 📋 Gestion des Bars
- ✅ Base de données de 118 bars authentiques de Montpellier
- ✅ Ajout/Modification/Suppression de bars
- ✅ Tri alphabétique automatique (sans les articles)
- ✅ Sauvegarde automatique dans le navigateur (localStorage)
- ✅ Export/Import JSON (compatible mobile & desktop)
- ✅ Réinitialisation vers la base originale
- ✅ **Bouton "📍 Voir sur Maps"** sur chaque fiche bar pour ouvrir Google Maps

### 🔍 Recherche Avancée
- ✅ Recherche par nom, type ou adresse
- ✅ Filtres multiples (quartiers, ambiances, musiques, etc.)
- ✅ Mode "Surprends-moi !" pour découvrir un bar au hasard
- ✅ **Bandeau sticky en haut** affichant le nombre de résultats en temps réel
- ✅ Compteur de résultats qui se met à jour automatiquement
- ✅ Filtres personnalisés (créer vos propres tags)
- ✅ Expansion des fiches bars au clic pour voir tous les filtres

### 🎨 Interface
- ✅ Design mobile-first responsive
- ✅ Thème sombre élégant (violet/rose)
- ✅ Animations fluides
- ✅ **Bandeau de résultats fixe** qui reste visible pendant le scroll
- ✅ Interface à onglet unique (Recherche + Gestion)
- ✅ Compatible iOS & Android

### 📊 Analytics
- ✅ Google Analytics 4 intégré (ID: `G-Q86SEH0EQJ`)
- ✅ Suivi des actions utilisateurs
- ✅ Statistiques d'utilisation
- ✅ Tracking des ouvertures Google Maps

### 🗺️ Intégration Google Maps
- ✅ Bouton sur chaque fiche bar
- ✅ Ouverture automatique dans Google Maps (web ou app mobile)
- ✅ Recherche avec nom + adresse du bar
- ✅ Analytics tracking des clics Maps

---

## 📁 Structure du Projet

```
soif-mybarfinder/
├── index.html          # Structure HTML + CSS inline
├── app.js              # Logique JavaScript principale
├── bars.json           # Base de données des 100 bars
├── filters.json        # Configuration des filtres
└── README.md           # Documentation (ce fichier)
```

**Note:** Le CSS est intégré directement dans `index.html` entre les balises `<style>` pour simplifier le déploiement.

---

## 🚀 Installation & Déploiement

### Option 1 : GitHub Pages (Recommandé)

1. **Créer un repository GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - SOIF MyBarFinder v2"
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

### Google Analytics

L'application utilise déjà Google Analytics 4 avec l'ID `G-Q86SEH0EQJ`.

Si vous souhaitez utiliser votre propre ID Analytics, dans `index.html`, ligne 14, remplacer :
```javascript
gtag('config', 'G-Q86SEH0EQJ', {
    'page_title': 'SOIF MyBarFinder',
    'page_location': window.location.href
});
```

Pour désactiver Analytics, supprimer tout le bloc `<script>` Google Analytics (lignes 8-18).

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

Les filtres avec `"custom": true` sont des filtres créés par l'utilisateur via l'interface.

---

## 🎨 Personnalisation

### Modifier les Couleurs

Dans `index.html`, section `<style>`, modifier les gradients :

**Header :**
```css
.header {
    background: linear-gradient(135deg, #4a0e4e 0%, #81236e 40%, #ab2567 70%, #ff006e 100%);
}
```

**Bandeau sticky :**
```css
.sticky-results-banner {
    background: linear-gradient(135deg, #6b46c1 0%, #9333ea 100%);
}
```

**Bouton Google Maps :**
```css
.btn-maps {
    background: linear-gradient(135deg, #4285f4, #34a853);
}
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

### 🔍 Recherche de Bars

1. **Barre de recherche** : Taper un nom, type ou adresse
2. **Filtres** : Cliquer sur les filtres désirés (cumul possible)
3. **Bandeau en haut** : Voir le nombre de résultats en temps réel
4. **Bouton "👁️ Voir les bars"** : Afficher la liste des résultats
5. **Surprends-moi !** : Découvrir un bar au hasard
6. **Ajouter un filtre** : Créer vos propres tags personnalisés

### 🗺️ Ouvrir dans Google Maps

1. Cliquer sur **"🔍 Voir les bars"** pour afficher les résultats
2. Cliquer sur une fiche bar pour l'expandre
3. Cliquer sur **"📍 Voir sur Maps"**
4. Google Maps s'ouvre automatiquement avec la recherche du bar

### 🍺 Gestion des Bars

1. **Ajouter un bar** : Cliquer sur "+ Ajouter un nouveau bar"
2. **Modifier** : Cliquer sur "✏️ Modifier" sur une fiche
3. **Supprimer** : Cliquer sur "🗑️ Supprimer" (confirmation requise)
4. **Exporter** : Télécharger vos données en JSON
5. **Importer** : Restaurer depuis un fichier JSON
6. **Réinitialiser** : Retour aux 118 bars d'origine

### 🏷️ Filtres Personnalisés

1. Cliquer sur **"+ Ajouter un filtre"**
2. Choisir une catégorie existante
3. Sélectionner un emoji (optionnel)
4. Nommer votre filtre
5. Valider : le filtre apparaît immédiatement
6. **Supprimer** : Survoler le filtre custom et cliquer sur "×"

---

## 🛠️ Technologies Utilisées

- **HTML5** : Structure sémantique
- **CSS3** : Animations, gradients, flexbox, grid, sticky positioning
- **JavaScript (Vanilla)** : Aucune dépendance externe
- **LocalStorage** : Persistance des données
- **JSON** : Format de données
- **Google Analytics 4** : Suivi statistiques
- **Google Maps API** : Intégration cartographique

---

## 📊 Statistiques Projet

- **118 bars** authentiques de Montpellier
- **200+ filtres** disponibles (17 catégories)
- **0 dépendance** externe (Vanilla JS pur)
- **100% responsive** mobile & desktop
- **PWA-ready** (peut être installé sur mobile)
- **Bandeau sticky** avec résultats en temps réel
- **Intégration Google Maps** sur toutes les fiches

---

## 🆕 Nouveautés v2.0

### ✨ Bandeau de Résultats Sticky
- Affichage permanent en haut de l'écran
- Compteur en temps réel qui se met à jour automatiquement
- Bouton "👁️ Voir les bars" toujours accessible
- Design avec dégradé violet/rose
- Animation au chargement

### 🗺️ Intégration Google Maps
- Nouveau bouton "📍 Voir sur Maps" sur chaque fiche
- Ouverture automatique de Google Maps (web ou app)
- Recherche intelligente : `Nom du bar, Adresse complète`
- Compatible mobile (ouvre l'app Google Maps si installée)
- Tracking Analytics des clics Maps

### 🎨 Améliorations Interface
- Fiches bars expandables au clic
- Aperçu de 8 filtres + badge "voir tout"
- Actions groupées (Modifier/Supprimer/Maps)
- Responsive amélioré pour mobile
- Padding-top automatique pour le bandeau sticky

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

### Le bandeau sticky ne s'affiche pas ?
- Vérifier que le CSS est bien dans `<style>` de index.html
- Vérifier que `createStickyResultsBanner()` est appelée dans `init()`
- Ouvrir la console pour voir les erreurs JavaScript

### Google Maps ne s'ouvre pas ?
- Vérifier que le navigateur autorise les popups
- Vérifier la fonction `openGoogleMaps(bar)` dans app.js
- Tester sur mobile : l'app Google Maps doit être installée

---

## 📄 Licence

**MIT License** - Libre d'utilisation, modification et distribution.

© 2025 SOIF MyBarFinder  
Contact : soif.mybarfinder@gmail.com

---

## 🚀 Roadmap Future

- [ ] PWA complète avec Service Worker
- [ ] Mode hors-ligne
- [x] ~~Géolocalisation & carte interactive~~ (Google Maps intégré)
- [ ] Notes & avis utilisateurs
- [ ] Partage sur réseaux sociaux
- [ ] Favoris & listes personnalisées
- [ ] Dark/Light mode toggle
- [ ] Multi-langues (EN/FR/ES)
- [ ] Itinéraire depuis position actuelle
- [ ] Calcul temps de trajet (à pied/vélo/voiture)
- [ ] Filtrage par distance
- [ ] Mode "Pub Crawl" (tournée des bars)

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

## 🏆 Crédits

**Développement** : SOIF Team  
**Design** : Mobile-first responsive  
**Données** : 118 bars authentiques de Montpellier  
**Cartographie** : Google Maps API  
**Analytics** : Google Analytics 4

---

**Made with 🍺 in Montpellier**

*Version 2.0 - Décembre 2024*
