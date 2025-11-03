// Instructions PWA adaptées selon le navigateur/appareil

function detectDevice() {
    const ua = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(ua);
    const isAndroid = /android/.test(ua);
    const isSafari = /safari/.test(ua) && !/chrome/.test(ua);
    const isChrome = /chrome/.test(ua) && !/edg/.test(ua);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;
    
    return {
        isIOS,
        isAndroid,
        isSafari,
        isChrome,
        isStandalone
    };
}

function showInstallInstructions() {
    const device = detectDevice();
    
    // Si déjà installé, ne rien montrer
    if (device.isStandalone) {
        console.log('✅ PWA déjà installée');
        return;
    }
    
    let title = '📲 Installer SOIF';
    let instructions = '';
    
    if (device.isIOS && device.isSafari) {
        // iPhone/iPad avec Safari
        instructions = `
            <div style="text-align: left; padding: 20px; line-height: 1.6;">
                <h3 style="margin-bottom: 15px; color: #ff8e8e;">📱 Installation sur iPhone/iPad</h3>
                <ol style="padding-left: 20px; margin: 0;">
                    <li style="margin-bottom: 10px;">Cliquez sur le bouton <strong>Partager</strong> (carré avec flèche ⬆️) en bas de Safari</li>
                    <li style="margin-bottom: 10px;">Faites défiler et sélectionnez <strong>"Sur l'écran d'accueil"</strong></li>
                    <li style="margin-bottom: 10px;">Cliquez sur <strong>"Ajouter"</strong></li>
                    <li>L'icône SOIF apparaîtra sur votre écran d'accueil ! 🎉</li>
                </ol>
            </div>
        `;
    } else if (device.isAndroid && device.isChrome) {
        // Android avec Chrome
        instructions = `
            <div style="text-align: left; padding: 20px; line-height: 1.6;">
                <h3 style="margin-bottom: 15px; color: #ff8e8e;">📱 Installation sur Android</h3>
                <ol style="padding-left: 20px; margin: 0;">
                    <li style="margin-bottom: 10px;">Cliquez sur les <strong>3 points</strong> ⋮ en haut à droite</li>
                    <li style="margin-bottom: 10px;">Sélectionnez <strong>"Installer l'application"</strong> ou <strong>"Ajouter à l'écran d'accueil"</strong></li>
                    <li style="margin-bottom: 10px;">Confirmez l'installation</li>
                    <li>L'icône SOIF apparaîtra sur votre écran d'accueil ! 🎉</li>
                </ol>
            </div>
        `;
    } else {
        // Autres navigateurs
        instructions = `
            <div style="text-align: left; padding: 20px; line-height: 1.6;">
                <h3 style="margin-bottom: 15px; color: #ff8e8e;">📱 Installation</h3>
                <p style="margin-bottom: 15px;">Pour installer SOIF sur votre écran d'accueil :</p>
                <ul style="padding-left: 20px; margin: 0;">
                    <li style="margin-bottom: 10px;"><strong>Sur iPhone/iPad :</strong> Utilisez Safari, puis bouton Partager → "Sur l'écran d'accueil"</li>
                    <li style="margin-bottom: 10px;"><strong>Sur Android :</strong> Utilisez Chrome, puis Menu (⋮) → "Installer l'application"</li>
                </ul>
            </div>
        `;
    }
    
    // Créer la modal d'instructions
    const modal = document.createElement('div');
    modal.className = 'install-modal';
    modal.innerHTML = `
        <div class="install-modal-content">
            ${instructions}
            <button class="btn-primary" onclick="closeInstallModal()" style="margin-top: 20px;">
                J'ai compris !
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Fermeture au clic en dehors
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeInstallModal();
        }
    });
}

function closeInstallModal() {
    const modal = document.querySelector('.install-modal');
    if (modal) {
        modal.remove();
    }
}

// Auto-affichage du bandeau si pas installé et pas déjà fermé
function initPWABanner() {
    const device = detectDevice();
    const bannerDismissed = localStorage.getItem('pwa_banner_dismissed');
    
    // Ne pas afficher si déjà installé ou si l'utilisateur a fermé le bandeau
    if (device.isStandalone || bannerDismissed === 'true') {
        return;
    }
    
    // Afficher le bandeau après 2 secondes
    setTimeout(() => {
        const banner = document.getElementById('installBanner');
        if (banner) {
            banner.classList.add('show');
            
            // Adapter le sous-titre selon l'appareil
            const subtitle = document.getElementById('installSubtitle');
            if (subtitle) {
                if (device.isIOS) {
                    subtitle.textContent = 'Installez sur votre iPhone/iPad';
                } else if (device.isAndroid) {
                    subtitle.textContent = 'Installez sur votre Android';
                } else {
                    subtitle.textContent = 'Accès rapide depuis votre écran d\'accueil';
                }
            }
        }
    }, 2000);
}

// Gestion du bouton "Comment faire ?"
document.addEventListener('DOMContentLoaded', () => {
    const installBtn = document.getElementById('installBtn');
    const closeBtn = document.getElementById('closeInstallBtn');
    
    if (installBtn) {
        installBtn.addEventListener('click', () => {
            showInstallInstructions();
            
            // Analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'pwa_instructions_opened', {
                    'event_category': 'PWA',
                    'event_label': 'User clicked instructions'
                });
            }
        });
    }
    
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const banner = document.getElementById('installBanner');
            if (banner) {
                banner.classList.remove('show');
                // Mémoriser que l'utilisateur a fermé le bandeau
                localStorage.setItem('pwa_banner_dismissed', 'true');
                
                // Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'pwa_banner_dismissed', {
                        'event_category': 'PWA',
                        'event_label': 'User closed banner'
                    });
                }
            }
        });
    }
    
    // Initialiser le bandeau
    initPWABanner();
});

// Fallback pour l'ancien système de prompt (Chrome Android)
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    const device = detectDevice();
    
    // Sur Chrome Android, on peut utiliser le prompt natif
    if (device.isAndroid && device.isChrome) {
        const installBtn = document.getElementById('installBtn');
        if (installBtn) {
            // Changer le texte du bouton
            installBtn.textContent = 'Installer maintenant';
            installBtn.onclick = async () => {
                if (deferredPrompt) {
                    deferredPrompt.prompt();
                    const { outcome } = await deferredPrompt.userChoice;
                    
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'pwa_install_prompt', {
                            'event_category': 'PWA',
                            'event_label': outcome
                        });
                    }
                    
                    deferredPrompt = null;
                    document.getElementById('installBanner').classList.remove('show');
                }
            };
        }
    }
});

// Détecter quand l'app est installée
window.addEventListener('appinstalled', () => {
    console.log('🎉 PWA installée avec succès !');
    const banner = document.getElementById('installBanner');
    if (banner) {
        banner.classList.remove('show');
    }
    
    if (typeof gtag !== 'undefined') {
        gtag('event', 'pwa_installed', {
            'event_category': 'PWA',
            'event_label': 'App successfully installed'
        });
    }
});
