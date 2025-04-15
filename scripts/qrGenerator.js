// Module pour la génération de QR codes
const QRGenerator = (function() {
    let lastGeneratedData = null;

    function formatWifiData(data) {
        return `WIFI:S:${data.ssid};T:${data.encryption};P:${data.password};;`;
    }

    function formatVCardData(data) {
        return `BEGIN:VCARD
VERSION:3.0
N:${data.lastName};${data.firstName};;;
FN:${data.firstName} ${data.lastName}
ORG:${data.company}
TITLE:${data.position}
ADR:;;${data.address};;;
TEL:${data.phone}
EMAIL:${data.email}
URL:${data.website}
END:VCARD`;
    }

    function formatEmailData(data) {
        let emailString = `mailto:${data.emailAddress}`;

        if (data.subject || data.body) {
            emailString += '?';
            if (data.subject) emailString += `subject=${encodeURIComponent(data.subject)}`;
            if (data.subject && data.body) emailString += '&';
            if (data.body) emailString += `body=${encodeURIComponent(data.body)}`;
        }

        return emailString;
    }

    // API publique
    return {
        generate: function(type, formData, container) {
            let qrData = '';

            // Formater les données selon le type
            switch (type) {
                case 'text':
                    qrData = formData.textContent;
                    break;
                case 'wifi':
                    qrData = formatWifiData(formData);
                    break;
                case 'vcard':
                    qrData = formatVCardData(formData);
                    break;
                case 'url':
                    qrData = formData.url;
                    break;
                case 'email':
                    qrData = formatEmailData(formData);
                    break;
                case 'gcmConnexion':
                    const employeeId = formData.employeeId;
                    const employeePassword = formData.employeePassword;

                    if (!employeeId || !employeePassword) {
                        alert("Veuillez remplir les champs matricule et mot de passe.");
                        return;
                    }

                    qrData = `${employeeId};${employeePassword}`;
                    break;
            }

            // Stocker les données pour une utilisation ultérieure
            lastGeneratedData = {
                type: type,
                data: qrData,
                formData: formData
            };

            // Effacer le conteneur
            container.innerHTML = '';

            // Créer un div pour le QR code
            const qrElement = document.createElement('div');
            qrElement.id = 'qrcode';
            container.appendChild(qrElement);

            // Générer le QR code
            new QRCode(qrElement, {
                text: qrData,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
                correctLevel: QRCode.CorrectLevel.H
            });

            // Ajouter une légende
            const caption = document.createElement('p');
            caption.className = 'text-sm text-gray-600 mt-2';
            caption.textContent = this.getCaption(type, formData);
            container.appendChild(caption);
        },

        getCaption: function(type, formData) {
            switch (type) {
                case 'text':
                    return `Texte: ${formData.textContent.substring(0, 30)}${formData.textContent.length > 30 ? '...' : ''}`;
                case 'wifi':
                    return `Wi-Fi: ${formData.ssid} (${formData.encryption})`;
                case 'vcard':
                    return `Carte de visite: ${formData.firstName} ${formData.lastName}`;
                case 'url':
                    return `URL: ${formData.url}`;
                case 'email':
                    return `Email: ${formData.emailAddress}`;
                default:
                    return '';
            }
        },

        downloadAsPNG: function() {
            if (!lastGeneratedData) return;

            const qrCanvas = document.querySelector('#qrcode canvas');
            if (!qrCanvas) return;

            // Créer un lien de téléchargement
            const link = document.createElement('a');
            link.download = `qrcode-${lastGeneratedData.type}.png`;
            link.href = qrCanvas.toDataURL('image/png');
            link.click();
        },

        getLastGeneratedData: function() {
            return lastGeneratedData;
        }
    };
})();