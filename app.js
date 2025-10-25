// SOIF MyBarFinder - Application JavaScript
// Version refonte : Interface simplifiée avec un seul onglet

// Variables globales
let bars = [];
let FILTERS = {};
let editingBarId = null;
let selectedSearchFilters = [];
let customFilters = {};
let isResetMode = false;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', async () => {
    await loadExternalData();
    loadCustomFilters();
    init();
    setupEventListeners();
});

// Chargement des données externes (bars.json et filters.json)
async function loadExternalData() {
    try {
        // Charger les bars depuis localStorage d'abord
        const savedBars = localStorage.getItem('soif_bars');
        
        if (savedBars) {
            // Si on a des données en localStorage, les utiliser
            bars = JSON.parse(savedBars);
            console.log('✅ Données chargées depuis localStorage');
        } else {
            // Sinon, essayer de charger depuis les fichiers JSON
            try {
                const barsResponse = await fetch('bars.json');
                if (!barsResponse.ok) throw new Error('Fichier bars.json introuvable');
                bars = await barsResponse.json();
                console.log('✅ Données chargées depuis bars.json');
            } catch (fetchError) {
                console.warn('⚠️ Impossible de charger bars.json:', fetchError.message);
                // Fallback : données vides
                bars = [];
                showNotification('⚠️ Aucune donnée disponible. Importez un fichier JSON.', 'error');
            }
        }
        
        // Charger filters.json
        try {
            const filtersResponse = await fetch('filters.json');
            if (filtersResponse.ok) {
                FILTERS = await filtersResponse.json();
                console.log('✅ Filtres chargés depuis filters.json');
            } else {
                throw new Error('Fichier filters.json introuvable');
            }
        } catch (fetchError) {
            console.warn('⚠️ Impossible de charger filters.json:', fetchError.message);
            // Fallback : structure vide
            FILTERS = {
                quartiers: [],
                types: [],
                ambiances: []
            };
        }
        
        bars = sortBarsByName(bars);
        
    } catch (error) {
        console.error('❌ Erreur critique:', error);
        showNotification('❌ Erreur de chargement. Vérifiez la console.', 'error');
    }
}

// Initialisation de l'application
function init() {
    generateFormFilters();
    generateSearchFilters();
    updateCounts();
    performSearch();
}

// Configuration des écouteurs d'événements
function setupEventListeners() {
    // Boutons principaux
    document.getElementById('newBarBtn').addEventListener('click', showNewBarForm);
    document.getElementById('resetBtn').addEventListener('click', toggleResetMode);
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('importBtn').addEventListener('click', () => document.getElementById('fileInput').click());
    document.getElementById('fileInput').addEventListener('change', importData);
    document.getElementById('saveBtn').addEventListener('click', saveBar);
    document.getElementById('cancelBtn').addEventListener('click', cancelEdit);
    
    // Recherche
    document.getElementById('showResultsBtn').addEventListener('click', showResults);
    document.getElementById('backToFiltersBtn').addEventListener('click', backToFilters);
    document.getElementById('addFilterBtn').addEventListener('click', showAddFilterModal);
    document.getElementById('surpriseMeBtn').addEventListener('click', surpriseMe);
    
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', performSearch);
}

// Fonctions de tri et gestion des articles
function removeArticle(name) {
    const articles = ['Le ', 'La ', 'Les ', "L'", 'The ', 'Chez ', 'Un '];
    for (let article of articles) {
        if (name.startsWith(article)) {
            return name.substring(article.length);
        }
    }
    return name;
}

function sortBarsByName(barsArray) {
    return barsArray.sort((a, b) => {
        const nameA = removeArticle(a.name).toLowerCase();
        const nameB = removeArticle(b.name).toLowerCase();
        return nameA.localeCompare(nameB);
    });
}

// Sauvegarde et chargement
function saveBars() {
    try {
        localStorage.setItem('soif_bars', JSON.stringify(bars));
    } catch (error) {
        console.error('Erreur de sauvegarde:', error);
    }
}

function loadCustomFilters() {
    try {
        const savedFilters = localStorage.getItem('soif_custom_filters');
        if (savedFilters) {
            customFilters = JSON.parse(savedFilters);
            // Fusionner avec les filtres par défaut
            Object.keys(customFilters).forEach(category => {
                if (!FILTERS[category]) {
                    FILTERS[category] = [];
                }
                customFilters[category].forEach(filter => {
                    if (!FILTERS[category].find(f => f.id === filter.id)) {
                        FILTERS[category].push({...filter, custom: true});
                    }
                });
            });
        }
    } catch (error) {
        console.error('Erreur chargement filtres personnalisés:', error);
    }
}

function saveCustomFilters() {
    try {
        localStorage.setItem('soif_custom_filters', JSON.stringify(customFilters));
    } catch (error) {
        console.error('Erreur sauvegarde filtres:', error);
    }
}

// Toggle Reset Mode
function toggleResetMode() {
    const btn = document.getElementById('resetBtn');
    const btnText = document.getElementById('resetBtnText');
    
    if (!isResetMode) {
        // Passer en mode "confirmer la réinitialisation"
        isResetMode = true;
        btn.classList.add('reset-active');
        btnText.textContent = 'Non réinitialisé';
        
        // Timer pour revenir automatiquement
        setTimeout(() => {
            if (isResetMode) {
                isResetMode = false;
                btn.classList.remove('reset-active');
                btnText.textContent = 'Réinitialiser';
            }
        }, 5000);
    } else {
        // Confirmer la réinitialisation
        performReset();
    }
}

// Réinitialisation effective
async function performReset() {
    try {
        const response = await fetch('bars.json');
        if (!response.ok) {
            throw new Error('Fichier bars.json introuvable');
        }
        const originalBars = await response.json();
        
        localStorage.clear();
        bars = originalBars;
        bars = sortBarsByName(bars);
        saveBars();
        
        // Réinitialiser l'état du bouton
        isResetMode = false;
        const btn = document.getElementById('resetBtn');
        const btnText = document.getElementById('resetBtnText');
        btn.classList.remove('reset-active');
        btnText.textContent = 'Réinitialiser';
        
        // Réinitialiser la recherche
        selectedSearchFilters = [];
        document.getElementById('searchInput').value = '';
        updateSearchFilterUI();
        updateSelectedFilters();
        
        updateCounts();
        performSearch();
        showNotification(`✅ ${bars.length} bars chargés depuis bars.json !`);
    } catch (error) {
        console.error('Erreur réinitialisation:', error);
        showNotification('❌ Impossible de charger bars.json. Vérifiez que le fichier existe.', 'error');
    }
}

// Export / Import
function exportData() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        // Sur mobile, on ouvre les fichiers dans des onglets
        exportMobileVersion();
    } else {
        // Sur desktop, on télécharge 2 fichiers séparés
        exportDesktopVersion();
    }
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'export_data', {
            'event_category': 'Données',
            'event_label': 'Export JSON',
            'bars_count': bars.length,
            'custom_filters_count': Object.keys(customFilters).length,
            'device': isMobile ? 'mobile' : 'desktop'
        });
    }
}

function exportDesktopVersion() {
    // Export bars.json
    const barsStr = JSON.stringify(bars, null, 2);
    downloadJSONFile(barsStr, 'bars.json');
    
    // Export filters.json (fusion des filtres par défaut et personnalisés)
    setTimeout(() => {
        const filtersStr = JSON.stringify(FILTERS, null, 2);
        downloadJSONFile(filtersStr, 'filters.json');
        showNotification('✅ 2 fichiers téléchargés : bars.json + filters.json');
    }, 100);
}

function exportMobileVersion() {
    // Sur mobile, créer un export combiné dans un nouvel onglet
    const exportData = {
        bars: bars,
        filters: FILTERS,
        customFilters: customFilters,
        exportDate: new Date().toISOString(),
        version: "1.0",
        note: "Pour GitHub : Copiez 'bars' dans bars.json et 'filters' dans filters.json"
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const newWindow = window.open(url, '_blank');
    
    if (newWindow) {
        showNotification('✅ Données ouvertes ! Copiez le contenu pour bars.json et filters.json');
    } else {
        downloadJSONFile(dataStr, 'soif-export.json');
    }
    
    setTimeout(() => URL.revokeObjectURL(url), 60000);
}

function downloadJSONFile(dataStr, filename) {
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.setAttribute('target', '_blank');
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            
            let importedBars = [];
            let importedFilters = {};
            
            if (importedData.bars && Array.isArray(importedData.bars)) {
                importedBars = importedData.bars;
                importedFilters = importedData.customFilters || {};
            } else if (Array.isArray(importedData)) {
                importedBars = importedData;
            } else {
                showNotification('❌ Format de fichier invalide', 'error');
                return;
            }
            
            if (importedBars.length === 0) {
                showNotification('❌ Aucun bar trouvé dans le fichier', 'error');
                return;
            }
            
            const filtersCount = Object.values(importedFilters).reduce((acc, arr) => acc + arr.length, 0);
            
            let message = `📥 Importer ${importedBars.length} bars`;
            if (filtersCount > 0) {
                message += ` et ${filtersCount} filtre${filtersCount > 1 ? 's' : ''} personnalisé${filtersCount > 1 ? 's' : ''}`;
            }
            message += ' ?\n\nCela remplacera votre base actuelle.';
            
            if (confirm(message)) {
                bars = importedBars;
                bars = sortBarsByName(bars);
                saveBars();
                
                if (filtersCount > 0) {
                    customFilters = importedFilters;
                    saveCustomFilters();
                    
                    Object.keys(customFilters).forEach(category => {
                        if (!FILTERS[category]) {
                            FILTERS[category] = [];
                        }
                        customFilters[category].forEach(filter => {
                            if (!FILTERS[category].find(f => f.id === filter.id)) {
                                FILTERS[category].push({...filter, custom: true});
                            }
                        });
                    });
                    
                    generateFormFilters();
                    generateSearchFilters();
                }
                
                updateCounts();
                performSearch();
                
                let successMsg = `✅ ${importedBars.length} bars importés !`;
                if (filtersCount > 0) {
                    successMsg += ` + ${filtersCount} filtre${filtersCount > 1 ? 's' : ''}`;
                }
                showNotification(successMsg);
                
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'import_data', {
                        'event_category': 'Données',
                        'event_label': 'Import JSON',
                        'bars_count': importedBars.length,
                        'filters_count': filtersCount
                    });
                }
            }
        } catch (error) {
            console.error('Erreur import:', error);
            showNotification('❌ Erreur de lecture du fichier', 'error');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

// Génération des filtres
function findFilterLabel(filterId) {
    for (const category in FILTERS) {
        const filter = FILTERS[category].find(f => f.id === filterId);
        if (filter) return filter.label;
    }
    return filterId;
}

function generateFormFilters() {
    const container = document.getElementById('formFiltersContainer');
    container.innerHTML = '';
    
    Object.keys(FILTERS).forEach(categoryKey => {
        const div = document.createElement('div');
        div.className = 'category';
        
        const title = document.createElement('div');
        title.className = 'category-title';
        title.textContent = categoryKey.replace(/_/g, ' ').toUpperCase();
        div.appendChild(title);
        
        const grid = document.createElement('div');
        grid.className = 'filter-grid';
        
        FILTERS[categoryKey].forEach(filter => {
            const item = document.createElement('div');
            item.className = 'filter-item';
            if (filter.custom) {
                item.classList.add('custom');
            }
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `form_${filter.id}`;
            checkbox.value = filter.id;
            
            const label = document.createElement('label');
            label.htmlFor = `form_${filter.id}`;
            label.textContent = filter.label;
            
            checkbox.addEventListener('change', function() {
                item.classList.toggle('active', this.checked);
            });
            
            item.addEventListener('click', function(e) {
                if (e.target !== checkbox && e.target !== label && !e.target.classList.contains('delete-filter-btn')) {
                    checkbox.checked = !checkbox.checked;
                    item.classList.toggle('active', checkbox.checked);
                }
            });
            
            item.appendChild(checkbox);
            item.appendChild(label);
            
            if (filter.custom) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-filter-btn';
                deleteBtn.innerHTML = '×';
                deleteBtn.title = 'Supprimer ce filtre';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteCustomFilter(categoryKey, filter.id);
                });
                item.appendChild(deleteBtn);
            }
            
            grid.appendChild(item);
        });
        
        div.appendChild(grid);
        container.appendChild(div);
    });
}

function generateSearchFilters() {
    const container = document.getElementById('searchFiltersContainer');
    container.innerHTML = '';
    
    Object.keys(FILTERS).forEach(categoryKey => {
        const div = document.createElement('div');
        div.className = 'category';
        
        const title = document.createElement('div');
        title.className = 'category-title';
        title.textContent = categoryKey.replace(/_/g, ' ').toUpperCase();
        div.appendChild(title);
        
        const filtersDiv = document.createElement('div');
        
        FILTERS[categoryKey].forEach(filter => {
            const item = document.createElement('div');
            item.className = 'search-filter-item';
            item.dataset.filterId = filter.id;
            item.textContent = filter.label;
            
            if (filter.custom) {
                item.classList.add('custom');
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-filter-btn';
                deleteBtn.innerHTML = '×';
                deleteBtn.title = 'Supprimer ce filtre';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteCustomFilter(categoryKey, filter.id);
                });
                item.appendChild(deleteBtn);
            }
            
            item.addEventListener('click', function(e) {
                if (!e.target.classList.contains('delete-filter-btn')) {
                    toggleSearchFilter(filter.id);
                }
            });
            
            filtersDiv.appendChild(item);
        });
        
        div.appendChild(filtersDiv);
        container.appendChild(div);
    });
}

// Gestion des filtres de recherche
function toggleSearchFilter(filterId) {
    const index = selectedSearchFilters.indexOf(filterId);
    if (index > -1) {
        selectedSearchFilters.splice(index, 1);
    } else {
        selectedSearchFilters.push(filterId);
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'filter_used', {
                'event_category': 'Filtres',
                'event_label': filterId,
                'value': 1
            });
        }
    }
    updateSearchFilterUI();
    updateSelectedFilters();
    performSearch();
}

function updateSearchFilterUI() {
    document.querySelectorAll('.search-filter-item').forEach(item => {
        const isActive = selectedSearchFilters.includes(item.dataset.filterId);
        item.classList.toggle('active', isActive);
    });
}

function updateSelectedFilters() {
    const container = document.getElementById('selectedFilters');
    container.innerHTML = '';
    
    if (selectedSearchFilters.length === 0) {
        container.innerHTML = '<span style="color: rgba(255,255,255,0.4); font-size: 13px;">Aucun filtre sélectionné</span>';
        return;
    }
    
    selectedSearchFilters.forEach(filterId => {
        const tag = document.createElement('div');
        tag.className = 'selected-filter-tag';
        
        const label = document.createElement('span');
        label.textContent = findFilterLabel(filterId);
        
        const removeBtn = document.createElement('button');
        removeBtn.className = 'filter-remove';
        removeBtn.textContent = '×';
        removeBtn.addEventListener('click', () => toggleSearchFilter(filterId));
        
        tag.appendChild(label);
        tag.appendChild(removeBtn);
        container.appendChild(tag);
    });
}

// Recherche
function performSearch() {
    const searchQuery = document.getElementById('searchInput').value.trim().toLowerCase();
    let filtered = bars;
    
    if (searchQuery) {
        filtered = filtered.filter(bar => 
            bar.name.toLowerCase().includes(searchQuery) ||
            bar.type.toLowerCase().includes(searchQuery) ||
            bar.address.toLowerCase().includes(searchQuery)
        );
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'search', {
                'event_category': 'Recherche',
                'search_term': searchQuery,
                'results_count': filtered.length
            });
        }
    }
    
    if (selectedSearchFilters.length > 0) {
        filtered = filtered.filter(bar =>
            selectedSearchFilters.every(filterId => bar.features.includes(filterId))
        );
    }
    
    renderSearchResults(filtered);
    
    const countBtn = document.getElementById('resultCountBtn');
    if (countBtn) {
        countBtn.textContent = filtered.length;
    }
}

function showResults() {
    document.getElementById('filtersSection').style.display = 'none';
    document.getElementById('resultsSection').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'view_results', {
            'event_category': 'Recherche',
            'filters_count': selectedSearchFilters.length,
            'results_count': document.getElementById('resultCount').textContent
        });
    }
}

function backToFilters() {
    document.getElementById('filtersSection').style.display = 'block';
    document.getElementById('resultsSection').style.display = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function surpriseMe() {
    if (bars.length === 0) {
        showNotification('⚠️ Aucun bar disponible', 'error');
        return;
    }
    
    const randomBar = bars[Math.floor(Math.random() * bars.length)];
    
    selectedSearchFilters = [];
    document.getElementById('searchInput').value = '';
    updateSearchFilterUI();
    updateSelectedFilters();
    
    renderSearchResults([randomBar]);
    showResults();
    
    showNotification(`🎲 Découvre : ${randomBar.name} !`);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'surprise_me', {
            'event_category': 'Recherche',
            'event_label': randomBar.name,
            'value': 1
        });
    }
}

// Modal ajout de filtre
function showAddFilterModal() {
    const modal = document.createElement('div');
    modal.className = 'add-filter-modal';
    modal.id = 'addFilterModal';
    
    const content = document.createElement('div');
    content.className = 'add-filter-modal-content';
    
    let html = '<h2>➕ Ajouter un filtre personnalisé</h2>';
    
    html += '<div class="form-group">';
    html += '<label class="form-label">Catégorie *</label>';
    html += '<select class="form-input" id="filterCategory">';
    html += '<option value="">-- Choisir une catégorie --</option>';
    Object.keys(FILTERS).forEach(key => {
        const label = key.replace(/_/g, ' ').toUpperCase();
        html += `<option value="${key}">${label}</option>`;
    });
    html += '</select>';
    html += '</div>';
    
    html += '<div class="form-group">';
    html += '<label class="form-label">Emoji (optionnel)</label>';
    html += '<input type="text" class="form-input" id="filterEmoji" placeholder="🍺" maxlength="2">';
    html += '<div class="emoji-suggestions" id="emojiSuggestions">';
    // Emojis suggérés par thème
    const emojis = [
        '🍺', '🍻', '🍷', '🍸', '🍹', '🥂', '🍾', '🥃',
        '🎵', '🎶', '🎤', '🎸', '🎹', '🎧', '🎺', '🎷',
        '🌙', '☀️', '⭐', '✨', '🔥', '💫', '🌟', '⚡',
        '🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🎲', '🃏',
        '💃', '🕺', '🎉', '🎊', '🎈', '🎆', '🎇', '✌️',
        '🍕', '🍔', '🌮', '🍜', '🍱', '🍛', '🥘', '🍳',
        '🏖️', '🏝️', '🌴', '🌊', '🏔️', '⛰️', '🏞️', '🌅',
        '💚', '💙', '💜', '🧡', '❤️', '💛', '🤍', '🖤',
        '👥', '👫', '👬', '👭', '🤝', '👋', '🙌', '👏',
        '📚', '📖', '🎓', '🧠', '💡', '🔬', '🔭', '🎨'
    ];
    emojis.forEach(emoji => {
        html += `<span class="emoji-suggestion" data-emoji="${emoji}">${emoji}</span>`;
    });
    html += '</div>';
    html += '</div>';
    
    html += '<div class="form-group">';
    html += '<label class="form-label">Nom du filtre *</label>';
    html += '<input type="text" class="form-input" id="filterName" placeholder="Ex: Bar associatif">';
    html += '</div>';
    
    html += '<div class="form-group">';
    html += '<label class="form-label">Prévisualisation :</label>';
    html += '<div class="filter-preview" id="filterPreview">🔹 Votre filtre</div>';
    html += '</div>';
    
    html += '<button class="btn-primary" id="confirmAddFilterBtn">✅ Ajouter le filtre</button>';
    html += '<button class="btn-secondary" id="cancelAddFilterBtn">❌ Annuler</button>';
    
    content.innerHTML = html;
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    const emojiInput = document.getElementById('filterEmoji');
    const nameInput = document.getElementById('filterName');
    const preview = document.getElementById('filterPreview');
    
    function updatePreview() {
        const emoji = emojiInput.value.trim() || '🔹';
        const name = nameInput.value.trim() || 'Votre filtre';
        preview.textContent = `${emoji} ${name}`;
    }
    
    emojiInput.addEventListener('input', updatePreview);
    nameInput.addEventListener('input', updatePreview);
    
    // Gestion des clics sur les emojis suggérés
    document.querySelectorAll('.emoji-suggestion').forEach(span => {
        span.addEventListener('click', () => {
            emojiInput.value = span.dataset.emoji;
            updatePreview();
            
            // Highlight temporaire
            document.querySelectorAll('.emoji-suggestion').forEach(s => s.classList.remove('selected'));
            span.classList.add('selected');
        });
    });
    
    document.getElementById('confirmAddFilterBtn').addEventListener('click', () => {
        const category = document.getElementById('filterCategory').value;
        const emoji = emojiInput.value.trim();
        const name = nameInput.value.trim();
        
        if (!category) {
            showNotification('⚠️ Choisissez une catégorie', 'error');
            return;
        }
        
        if (!name || name.length < 2) {
            showNotification('⚠️ Le nom doit avoir au moins 2 caractères', 'error');
            return;
        }
        
        const filterId = name.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]/g, '_')
            .replace(/_+/g, '_')
            .replace(/^_|_$/g, '');
        
        if (FILTERS[category].find(f => f.id === filterId)) {
            showNotification('⚠️ Ce filtre existe déjà', 'error');
            return;
        }
        
        const newFilter = {
            id: filterId,
            label: emoji ? `${emoji} ${name}` : name,
            custom: true
        };
        
        FILTERS[category].push(newFilter);
        
        if (!customFilters[category]) {
            customFilters[category] = [];
        }
        customFilters[category].push(newFilter);
        saveCustomFilters();
        
        generateFormFilters();
        generateSearchFilters();
        
        showNotification(`✅ Filtre "${newFilter.label}" ajouté !`);
        closeAddFilterModal();
    });
    
    document.getElementById('cancelAddFilterBtn').addEventListener('click', closeAddFilterModal);
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeAddFilterModal();
    });
}

function closeAddFilterModal() {
    const modal = document.getElementById('addFilterModal');
    if (modal) modal.remove();
}

function deleteCustomFilter(categoryKey, filterId) {
    const filter = FILTERS[categoryKey].find(f => f.id === filterId);
    if (!filter) return;
    
    if (!confirm(`Supprimer le filtre "${filter.label}" ?\n\nCe filtre sera retiré de toutes les fiches bar.`)) {
        return;
    }
    
    if (customFilters[categoryKey]) {
        customFilters[categoryKey] = customFilters[categoryKey].filter(f => f.id !== filterId);
        if (customFilters[categoryKey].length === 0) {
            delete customFilters[categoryKey];
        }
        saveCustomFilters();
    }
    
    const index = FILTERS[categoryKey].findIndex(f => f.id === filterId);
    if (index !== -1) {
        FILTERS[categoryKey].splice(index, 1);
    }
    
    let modifiedCount = 0;
    bars.forEach(bar => {
        const originalLength = bar.features.length;
        bar.features = bar.features.filter(f => f !== filterId);
        if (bar.features.length < originalLength) {
            modifiedCount++;
        }
    });
    
    if (modifiedCount > 0) {
        saveBars();
        performSearch();
    }
    
    const wasSelected = selectedSearchFilters.includes(filterId);
    selectedSearchFilters = selectedSearchFilters.filter(f => f !== filterId);
    
    generateFormFilters();
    generateSearchFilters();
    
    if (wasSelected) {
        updateSelectedFilters();
        performSearch();
    }
    
    let message = `🗑️ Filtre "${filter.label}" supprimé`;
    if (modifiedCount > 0) {
        message += ` (retiré de ${modifiedCount} bar${modifiedCount > 1 ? 's' : ''})`;
    }
    showNotification(message);
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'filter_deleted', {
            'event_category': 'Filtres',
            'event_label': filterId,
            'value': 1
        });
    }
}

// Rendu des résultats avec cartes expandables
function renderSearchResults(filteredBars) {
    const container = document.getElementById('searchResults');
    const countEl = document.getElementById('resultCount');
    countEl.textContent = filteredBars.length;
    
    if (filteredBars.length === 0) {
        container.innerHTML = '<div class="empty-state">Aucun bar trouvé</div>';
        return;
    }
    
    container.innerHTML = '';
    filteredBars.forEach(bar => {
        const card = createBarCard(bar, true);
        container.appendChild(card);
    });
}

function createBarCard(bar, withModifyButton = false) {
    const card = document.createElement('div');
    card.className = 'bar-card';
    card.dataset.barId = bar.id;
    
    const name = document.createElement('div');
    name.className = 'bar-name';
    name.textContent = bar.name;
    
    const type = document.createElement('div');
    type.className = 'bar-type';
    type.textContent = bar.type;
    
    const address = document.createElement('div');
    address.className = 'bar-address';
    address.textContent = `${bar.address} • ${bar.distance} km`;
    
    // Aperçu (8 premiers badges + expand)
    const featuresPreview = document.createElement('div');
    featuresPreview.className = 'bar-features-preview';
    const previewCount = Math.min(8, bar.features.length);
    bar.features.slice(0, previewCount).forEach(f => {
        const badge = document.createElement('span');
        badge.className = 'feature-badge';
        badge.textContent = findFilterLabel(f);
        featuresPreview.appendChild(badge);
    });
    if (bar.features.length > 8) {
        const expandBadge = document.createElement('span');
        expandBadge.className = 'expand-badge';
        expandBadge.textContent = `+${bar.features.length - 8} voir tout`;
        featuresPreview.appendChild(expandBadge);
    }
    
    // Tous les filtres (caché par défaut)
    const featuresAll = document.createElement('div');
    featuresAll.className = 'bar-features-all';
    bar.features.forEach(f => {
        const badge = document.createElement('span');
        badge.className = 'feature-badge';
        badge.textContent = findFilterLabel(f);
        featuresAll.appendChild(badge);
    });
    
    card.appendChild(name);
    card.appendChild(type);
    card.appendChild(address);
    card.appendChild(featuresPreview);
    card.appendChild(featuresAll);
    
    // Toggle expand/collapse au clic sur la carte
    card.addEventListener('click', (e) => {
        // Ne pas toggle si on clique sur un bouton
        if (e.target.tagName === 'BUTTON') return;
        card.classList.toggle('expanded');
    });
    
    // Bouton modifier si demandé
    if (withModifyButton) {
        const actions = document.createElement('div');
        actions.className = 'btn-actions';
        
        const editBtn = document.createElement('button');
        editBtn.className = 'btn-edit';
        editBtn.textContent = '✏️ Modifier';
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            editBar(bar.id);
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-delete';
        deleteBtn.textContent = '🗑️ Supprimer';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteBar(bar.id);
        });
        
        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        card.appendChild(actions);
    }
    
    return card;
}

// Gestion du formulaire
function showNewBarForm() {
    editingBarId = null;
    document.getElementById('barFormContainer').style.display = 'block';
    clearForm();
    window.scrollTo({ 
        top: document.getElementById('barFormContainer').offsetTop - 20, 
        behavior: 'smooth' 
    });
}

function cancelEdit() {
    document.getElementById('barFormContainer').style.display = 'none';
    clearForm();
}

function clearForm() {
    document.getElementById('barName').value = '';
    document.getElementById('barType').value = '';
    document.getElementById('barAddress').value = '';
    document.getElementById('barDistance').value = '';
    
    document.querySelectorAll('#formFiltersContainer input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    document.querySelectorAll('#formFiltersContainer .filter-item').forEach(item => {
        item.classList.remove('active');
    });
}

function editBar(id) {
    const bar = bars.find(b => b.id === id);
    if (!bar) return;
    
    editingBarId = id;
    document.getElementById('barFormContainer').style.display = 'block';
    
    document.getElementById('barName').value = bar.name;
    document.getElementById('barType').value = bar.type;
    document.getElementById('barAddress').value = bar.address;
    document.getElementById('barDistance').value = bar.distance;
    
    document.querySelectorAll('#formFiltersContainer input[type="checkbox"]').forEach(cb => {
        const isChecked = bar.features.includes(cb.value);
        cb.checked = isChecked;
        cb.closest('.filter-item').classList.toggle('active', isChecked);
    });
    
    window.scrollTo({ 
        top: document.getElementById('barFormContainer').offsetTop - 20, 
        behavior: 'smooth' 
    });
}

function saveBar() {
    const name = document.getElementById('barName').value.trim();
    const type = document.getElementById('barType').value.trim();
    const address = document.getElementById('barAddress').value.trim();
    const distance = parseFloat(document.getElementById('barDistance').value) || 0;
    
    if (!name || !type || !address) {
        showNotification('⚠️ Remplissez tous les champs obligatoires', 'error');
        return;
    }
    
    const features = [];
    document.querySelectorAll('#formFiltersContainer input[type="checkbox"]:checked').forEach(cb => {
        features.push(cb.value);
    });
    
    if (editingBarId) {
        const index = bars.findIndex(b => b.id === editingBarId);
        if (index !== -1) {
            bars[index] = { ...bars[index], name, type, address, distance, features };
            showNotification('✅ Bar modifié !');
            
            if (typeof gtag !== 'undefined') {
                gtag('event', 'bar_edited', {
                    'event_category': 'Gestion Bars',
                    'event_label': name,
                    'value': 1
                });
            }
        }
    } else {
        const id = bars.length > 0 ? Math.max(...bars.map(b => b.id)) + 1 : 1;
        bars.push({ id, name, type, address, distance, features });
        showNotification('✅ Bar créé !');
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'bar_created', {
                'event_category': 'Gestion Bars',
                'event_label': name,
                'value': 1
            });
        }
    }
    
    bars = sortBarsByName(bars);
    saveBars();
    cancelEdit();
    updateCounts();
    performSearch();
}

function deleteBar(id) {
    const bar = bars.find(b => b.id === id);
    if (!bar) return;
    
    if (!confirm(`Supprimer "${bar.name}" ?\n\nCette action est irréversible.`)) {
        return;
    }
    
    bars = bars.filter(b => b.id !== id);
    saveBars();
    showNotification(`🗑️ "${bar.name}" supprimé`);
    updateCounts();
    performSearch();
}

// Utilitaires
function updateCounts() {
    const count = bars.length;
    document.getElementById('totalBars').textContent = count;
}

function showNotification(message, type = 'success') {
    const notif = document.createElement('div');
    notif.className = 'notification';
    if (type === 'error') {
        notif.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
    }
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => {
        if (notif.parentNode) notif.remove();
    }, 3000);
}
