// Module pour la génération de codes-barres
const BarcodeGenerator = (function() {
    let lastGeneratedData = null;

    function calculateEAN13CheckDigit(code12) {
        let sum = 0;
        for (let i = 0; i < 12; i++) {
            sum += parseInt(code12.charAt(i)) * (i % 2 === 0 ? 1 : 3);
        }
        return (10 - (sum % 10)) % 10;
    }

    function calculateUPCCheckDigit(code11) {
        let sum = 0;
        for (let i = 0; i < 11; i++) {
            sum += parseInt(code11.charAt(i)) * (i % 2 === 0 ? 3 : 1);
        }
        return (10 - (sum % 10)) % 10;
    }

    // API publique
    return {
        generate: function(type, formData, container) {
            // Effacer le conteneur
            container.innerHTML = '';

            // Créer un canvas pour le code-barres
            const canvas = document.createElement('canvas');
            canvas.id = 'barcodeCanvas';
            container.appendChild(canvas);

            let barcodeData = '';
            let options = {
                displayValue: true,
                fontSize: 18,
                height: 100
            };

            // Formater les données selon le type
            switch (type) {
                case 'ean13':
                    if (formData.productCode && formData.productCode.length === 12) {
                        const checkDigit = calculateEAN13CheckDigit(formData.productCode);
                        barcodeData = formData.productCode + checkDigit;
                    } else {
                        container.innerHTML = '<p class="text-danger">Veuillez saisir un code produit de 12 chiffres</p>';
                        return;
                    }
                    break;
                // Autres cas inchangés
                case 'code128':
                    barcodeData = formData.codeData;
                    break;
                case 'code39':
                    barcodeData = formData.codeData;
                    options.format = 'code39';
                    break;
                case 'upc':
                    if (formData.productCode && formData.productCode.length === 11) {
                        const checkDigit = calculateUPCCheckDigit(formData.productCode);
                        barcodeData = formData.productCode + checkDigit;
                        options.format = 'upc';
                    } else {
                        container.innerHTML = '<p class="text-danger">Veuillez saisir un code produit de 11 chiffres</p>';
                        return;
                    }
                    break;
            }

            // Stocker les données pour une utilisation ultérieure
            lastGeneratedData = {
                type: type,
                data: barcodeData,
                formData: formData
            };

            // Générer le code-barres
            JsBarcode('#barcodeCanvas', barcodeData, options);

            // Ajouter les informations du produit si disponibles
            if (type === 'ean13' && formData.productName) {
                const productInfo = document.createElement('div');
                productInfo.className = 'product-info mt-4 p-3 bg-gray-50 rounded-md';

                let infoHTML = `<h3 class="font-bold text-lg">${formData.productName}</h3>`;

                if (formData.brand) infoHTML += `<p><strong>Marque:</strong> ${formData.brand}</p>`;
                if (formData.category) infoHTML += `<p><strong>Catégorie:</strong> ${formData.category}</p>`;
                if (formData.price) infoHTML += `<p><strong>Prix:</strong> ${formData.price} €</p>`;
                if (formData.weight) infoHTML += `<p><strong>Poids/Volume:</strong> ${formData.weight}</p>`;
                if (formData.description) infoHTML += `<p><strong>Description:</strong> ${formData.description}</p>`;
                if (formData.expiryDate) infoHTML += `<p><strong>Date d'expiration:</strong> ${formData.expiryDate}</p>`;
                if (formData.sku) infoHTML += `<p><strong>Réf. interne:</strong> ${formData.sku}</p>`;
                if (formData.country) infoHTML += `<p><strong>Origine:</strong> ${formData.country}</p>`;
                if (formData.manufacturer) infoHTML += `<p><strong>Fabricant:</strong> ${formData.manufacturer}</p>`;
                if (formData.vatRate) infoHTML += `<p><strong>TVA:</strong> ${formData.vatRate}%</p>`;

                productInfo.innerHTML = infoHTML;
                container.appendChild(productInfo);
            }
        },

        downloadAsPNG: function() {
            if (!lastGeneratedData) return;

            const canvas = document.querySelector('#barcodeCanvas');
            if (!canvas) return;

            // Créer un lien de téléchargement
            const link = document.createElement('a');
            link.download = `barcode-${lastGeneratedData.type}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        },

        getLastGeneratedData: function() {
            return lastGeneratedData;
        }
    };
})();
