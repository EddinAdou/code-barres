// Contrôleur pour l'interface utilisateur
const UIController = (function() {
    let activeTab = 'qrCode';

    // Définition des champs de formulaire pour chaque type de code
    const qrCodeFormFields = {
        text: [
            { id: 'textContent', label: 'Texte', type: 'textarea', placeholder: 'Entrez le texte à encoder' }
        ],
        wifi: [
            { id: 'ssid', label: 'Nom du réseau (SSID)', type: 'text', placeholder: 'Entrez le nom du réseau Wi-Fi' },
            { id: 'password', label: 'Mot de passe', type: 'password', placeholder: 'Entrez le mot de passe Wi-Fi' },
            { id: 'encryption', label: 'Type de sécurité', type: 'select', options: [
                    { value: 'WPA', label: 'WPA/WPA2' },
                    { value: 'WEP', label: 'WEP' },
                    { value: 'nopass', label: 'Aucun chiffrement' }
                ]}
        ],
        vcard: [
            { id: 'firstName', label: 'Prénom', type: 'text', placeholder: 'Entrez le prénom' },
            { id: 'lastName', label: 'Nom', type: 'text', placeholder: 'Entrez le nom' },
            { id: 'email', label: 'Email', type: 'email', placeholder: 'Entrez l\'adresse email' },
            { id: 'phone', label: 'Téléphone', type: 'tel', placeholder: 'Entrez le numéro de téléphone' },
            { id: 'company', label: 'Entreprise', type: 'text', placeholder: 'Entrez le nom de l\'entreprise' },
            { id: 'position', label: 'Fonction', type: 'text', placeholder: 'Entrez la fonction/poste' },
            { id: 'address', label: 'Adresse', type: 'textarea', placeholder: 'Entrez l\'adresse complète' },
            { id: 'website', label: 'Site web', type: 'url', placeholder: 'Entrez l\'URL du site web' }
        ],
        url: [
            { id: 'url', label: 'URL', type: 'url', placeholder: 'Entrez l\'adresse web (https://...)' }
        ],
        email: [
            { id: 'emailAddress', label: 'Adresse email', type: 'email', placeholder: 'Entrez l\'adresse email' },
            { id: 'subject', label: 'Sujet', type: 'text', placeholder: 'Entrez le sujet de l\'email (optionnel)' },
            { id: 'body', label: 'Message', type: 'textarea', placeholder: 'Entrez le corps du message (optionnel)' }
        ]
    };

    const barcodeFormFields = {
        ean13: [
            { id: 'productCode', label: 'Code EAN / UPC (identifiant unique)', type: 'text', placeholder: 'Entrez le code produit (12 chiffres)', pattern: '[0-9]{12}', required: true },
            { id: 'productName', label: 'Nom du produit', type: 'text', placeholder: 'Entrez le nom du produit', required: true },
            { id: 'brand', label: 'Marque', type: 'text', placeholder: 'Entrez la marque du produit' },
            { id: 'category', label: 'Catégorie', type: 'select', options: [
                    { value: 'alimentaire', label: 'Alimentaire' },
                    { value: 'electronique', label: 'Électronique' },
                    { value: 'vetements', label: 'Vêtements' },
                    { value: 'hygiene', label: 'Hygiène et beauté' },
                    { value: 'menage', label: 'Produits ménagers' },
                    { value: 'autre', label: 'Autre' }
                ]},
            { id: 'price', label: 'Prix', type: 'number', placeholder: 'Prix du produit', step: '0.01', min: '0' },
            { id: 'weight', label: 'Poids / Volume', type: 'text', placeholder: 'Ex: 500g, 1L, etc.' },
            { id: 'description', label: 'Description courte', type: 'textarea', placeholder: 'Brève description du produit' },
            { id: 'expiryDate', label: 'Date d\'expiration', type: 'date', placeholder: 'Pour les produits périssables' },
            { id: 'sku', label: 'Référence interne (SKU)', type: 'text', placeholder: 'Référence interne du magasin' },
            { id: 'country', label: 'Pays d\'origine', type: 'text', placeholder: 'Pays de fabrication du produit' },
            { id: 'manufacturer', label: 'Fournisseur / Fabricant', type: 'text', placeholder: 'Nom du fabricant ou fournisseur' },
            { id: 'vatRate', label: 'Taux de TVA (%)', type: 'number', placeholder: 'Ex: 20, 5.5, etc.', step: '0.1', min: '0' }
        ],
        code128: [
            // Les autres types de codes-barres restent inchangés
            { id: 'codeData', label: 'Données', type: 'text', placeholder: 'Entrez les données à encoder' }
        ],
        code39: [
            { id: 'codeData', label: 'Données', type: 'text', placeholder: 'Entrez les données à encoder (lettres, chiffres et quelques caractères spéciaux)' }
        ],
        upc: [
            { id: 'productCode', label: 'Code produit (11 chiffres)', type: 'text', placeholder: 'Entrez le code produit (le 12e chiffre sera calculé automatiquement)', pattern: '[0-9]{11}' }
        ]
    };

    // Génère le HTML pour un champ de formulaire
    function createFormField(field) {
        const fieldContainer = document.createElement('div');
        fieldContainer.className = 'form-group';

        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.textContent = field.label;
        fieldContainer.appendChild(label);

        if (field.type === 'select') {
            const select = document.createElement('select');
            select.id = field.id;
            select.className = 'form-control';

            field.options.forEach(option => {
                const optElement = document.createElement('option');
                optElement.value = option.value;
                optElement.textContent = option.label;
                select.appendChild(optElement);
            });

            fieldContainer.appendChild(select);
        } else if (field.type === 'textarea') {
            const textarea = document.createElement('textarea');
            textarea.id = field.id;
            textarea.className = 'form-control';
            textarea.placeholder = field.placeholder || '';
            textarea.rows = 4;
            fieldContainer.appendChild(textarea);
        } else {
            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;
            input.className = 'form-control';
            input.placeholder = field.placeholder || '';

            if (field.pattern) {
                input.pattern = field.pattern;
            }

            fieldContainer.appendChild(input);
        }

        return fieldContainer;
    }

    // API publique
    return {
        initialize: function() {
            this.switchTab('qrCode');
        },

        // Dans UIController.js, méthode switchTab
        switchTab: function(tabName) {
            const qrCodeTab = document.getElementById('qrCodeTab');
            const barcodeTab = document.getElementById('barcodeTab');
            const qrCodeSection = document.getElementById('qrCodeSection');
            const barcodeSection = document.getElementById('barcodeSection');

            // Réinitialiser tous les onglets
            qrCodeTab.classList.remove('active-tab');
            barcodeTab.classList.remove('active-tab');
            qrCodeSection.style.display = 'none';
            barcodeSection.style.display = 'none';

            // Activer l'onglet sélectionné
            if (tabName === 'qrCode') {
                qrCodeTab.classList.add('active-tab');
                qrCodeSection.style.display = 'block';
            } else {
                barcodeTab.classList.add('active-tab');
                barcodeSection.style.display = 'block';
            }

            activeTab = tabName;

            // Réinitialiser l'aperçu
            document.getElementById('codePreview').innerHTML = '';
        },

        getActiveTab: function() {
            return activeTab;
        },

        changeQRCodeType: function(type) {
            const container = document.getElementById('qrCodeFormFields');
            container.innerHTML = '';

            if (qrCodeFormFields[type]) {
                qrCodeFormFields[type].forEach(field => {
                    container.appendChild(createFormField(field));
                });
            }
        },

        changeBarcodeType: function(type) {
            const container = document.getElementById('barcodeFormFields');
            container.innerHTML = '';

            if (barcodeFormFields[type]) {
                barcodeFormFields[type].forEach(field => {
                    container.appendChild(createFormField(field));
                });
            }
        },

        getFormData: function(containerId) {
            const formData = {};
            const container = document.getElementById(containerId);

            if (!container) return formData;

            // Collecter les valeurs de tous les champs
            const inputs = container.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                formData[input.id] = input.value;
            });

            return formData;
        }
    };
})();
