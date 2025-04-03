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
            { id: 'productCode', label: 'Code produit (12 chiffres)', type: 'text', placeholder: 'Entrez le code produit (le 13e chiffre sera calculé automatiquement)', pattern: '[0-9]{12}' },
            { id: 'productName', label: 'Nom du produit', type: 'text', placeholder: 'Entrez le nom du produit (optionnel)' }
        ],
        code128: [
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
        fieldContainer.className = 'mb-4';

        const label = document.createElement('label');
        label.setAttribute('for', field.id);
        label.className = 'block text-sm font-medium text-gray-700 mb-1';
        label.textContent = field.label;
        fieldContainer.appendChild(label);

        if (field.type === 'select') {
            const select = document.createElement('select');
            select.id = field.id;
            select.className = 'w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary';

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
            textarea.className = 'w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary';
            textarea.placeholder = field.placeholder || '';
            textarea.rows = 3;
            fieldContainer.appendChild(textarea);
        } else {
            const input = document.createElement('input');
            input.type = field.type;
            input.id = field.id;
            input.className = 'w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-primary';
            input.placeholder = field.placeholder || '';

            if (field.pattern) {
                input.pattern = field.pattern;
            }

            fieldContainer.appendChild(input);
        }

        return fieldContainer;
    }

    // API publique du module
    return {
        initialize: function() {
            this.switchTab('qrCode');
        },

        switchTab: function(tab) {
            activeTab = tab;

            // Mise à jour des onglets
            document.getElementById('qrCodeTab').className = tab === 'qrCode'
                ? 'py-3 px-6 font-medium text-lg rounded-t-lg bg-primary text-white'
                : 'py-3 px-6 font-medium text-lg rounded-t-lg bg-gray-200 text-gray-700 ml-2';

            document.getElementById('barcodeTab').className = tab === 'barcode'
                ? 'py-3 px-6 font-medium text-lg rounded-t-lg bg-primary text-white ml-2'
                : 'py-3 px-6 font-medium text-lg rounded-t-lg bg-gray-200 text-gray-700 ml-2';

            // Affichage de la section appropriée
            document.getElementById('qrCodeSection').style.display = tab === 'qrCode' ? 'block' : 'none';
            document.getElementById('barcodeSection').style.display = tab === 'barcode' ? 'block' : 'none';

            // Réinitialiser la section d'aperçu
            document.getElementById('codePreview').innerHTML = '<p class="text-gray-500">L\'aperçu apparaîtra ici</p>';
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
            const container = document.getElementById(containerId);
            const formData = {};

            // Collecter les données de tous les inputs dans le conteneur
            container.querySelectorAll('input, select, textarea').forEach(input => {
                formData[input.id] = input.value;
            });

            return formData;
        }
    };
})();