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

            // Ajouter une légende si un nom de produit est fourni
            if (formData.productName) {
                const caption = document.createElement('p');
                caption.className = 'text-sm text-gray-600 mt-2 text-center';
                caption.textContent = formData.productName;
                container.appendChild(caption);
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