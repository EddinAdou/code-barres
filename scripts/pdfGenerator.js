// Module pour la génération de PDF
const PDFGenerator = (function() {
    // API publique
    return {
        generateQRCodePDF: function(qrData) {
            if (!qrData) return;

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Titre du document
            doc.setFontSize(16);
            doc.text("QR Code", 105, 20, { align: "center" });

            // Type de QR code
            doc.setFontSize(12);
            let typeLabel = '';
            switch (qrData.type) {
                case 'text': typeLabel = 'Texte'; break;
                case 'wifi': typeLabel = 'Configuration Wi-Fi'; break;
                case 'vcard': typeLabel = 'Carte de visite'; break;
                case 'url': typeLabel = 'URL'; break;
                case 'email': typeLabel = 'Email'; break;
            }
            doc.text(`Type: ${typeLabel}`, 20, 30);

            // Ajouter l'image du QR code
            const qrCanvas = document.querySelector('#qrcode canvas');
            if (qrCanvas) {
                const imgData = qrCanvas.toDataURL('image/png');
                doc.addImage(imgData, 'PNG', 70, 40, 70, 70);
            }

            // Ajouter les détails selon le type
            doc.setFontSize(10);
            let yPosition = 120;

            switch (qrData.type) {
                case 'text':
                    doc.text("Contenu:", 20, yPosition);
                    doc.text(qrData.formData.textContent, 20, yPosition + 7, { maxWidth: 170 });
                    break;
                case 'wifi':
                    doc.text(`Réseau: ${qrData.formData.ssid}`, 20, yPosition);
                    doc.text(`Sécurité: ${qrData.formData.encryption}`, 20, yPosition + 7);
                    break;
                case 'vcard':
                    doc.text(`Nom: ${qrData.formData.firstName} ${qrData.formData.lastName}`, 20, yPosition);
                    doc.text(`Entreprise: ${qrData.formData.company}`, 20, yPosition + 7);
                    doc.text(`Fonction: ${qrData.formData.position}`, 20, yPosition + 14);
                    doc.text(`Email: ${qrData.formData.email}`, 20, yPosition + 21);
                    doc.text(`Téléphone: ${qrData.formData.phone}`, 20, yPosition + 28);
                    doc.text(`Site web: ${qrData.formData.website}`, 20, yPosition + 35);
                    doc.text("Adresse:", 20, yPosition + 42);
                    doc.text(qrData.formData.address, 20, yPosition + 49, { maxWidth: 170 });
                    break;
                case 'url':
                    doc.text(`URL: ${qrData.formData.url}`, 20, yPosition);
                    break;
                case 'email':
                    doc.text(`Adresse Email: ${qrData.formData.emailAddress}`, 20, yPosition);
                    if (qrData.formData.subject) {
                        doc.text(`Sujet: ${qrData.formData.subject}`, 20, yPosition + 7);
                    }
                    if (qrData.formData.body) {
                        doc.text("Corps du message:", 20, yPosition + 14);
                        doc.text(qrData.formData.body, 20, yPosition + 21, { maxWidth: 170 });
                    }
                    break;
            }

            // Pied de page avec date de génération
            const today = new Date();
            const formattedDate = today.toLocaleDateString('fr-FR');
            doc.setFontSize(8);
            doc.text(`Généré le ${formattedDate}`, 105, 280, { align: "center" });

            // Enregistrer le PDF
            doc.save('qrcode.pdf');
        },

        generateBarcodePDF: function(barcodeData) {
            if (!barcodeData) return;

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Titre du document
            doc.setFontSize(16);
            doc.text("Code-barres", 105, 20, { align: "center" });

            // Type de code-barres
            doc.setFontSize(12);
            doc.text(`Type: ${barcodeData.type.toUpperCase()}`, 20, 30);

            // Ajouter l'image du code-barres
            const barcodeImage = document.getElementById('barcodeImage');
            if (barcodeImage) {
                const imgData = barcodeImage.src;
                doc.addImage(imgData, 'PNG', 50, 40, 110, 60);
            }

            // Ajouter les détails
            doc.setFontSize(10);
            doc.text("Données:", 20, 110);
            doc.text(barcodeData.data, 20, 117, { maxWidth: 170 });

            // Options utilisées
            doc.text("Options:", 20, 130);
            let yPos = 137;

            if (barcodeData.options) {
                if (barcodeData.options.width) {
                    doc.text(`Largeur: ${barcodeData.options.width}`, 20, yPos);
                    yPos += 7;
                }
                if (barcodeData.options.height) {
                    doc.text(`Hauteur: ${barcodeData.options.height}`, 20, yPos);
                    yPos += 7;
                }
                if (barcodeData.options.displayValue !== undefined) {
                    doc.text(`Affichage de la valeur: ${barcodeData.options.displayValue ? 'Oui' : 'Non'}`, 20, yPos);
                    yPos += 7;
                }
                if (barcodeData.options.text) {
                    doc.text(`Texte personnalisé: ${barcodeData.options.text}`, 20, yPos);
                    yPos += 7;
                }
            }

            // Pied de page avec date de génération
            const today = new Date();
            const formattedDate = today.toLocaleDateString('fr-FR');
            doc.setFontSize(8);
            doc.text(`Généré le ${formattedDate}`, 105, 280, { align: "center" });

            // Enregistrer le PDF
            doc.save('barcode.pdf');
        },

        // Fonction générique pour télécharger n'importe quelle image comme PDF
        generateImagePDF: function(imageId, title) {
            const image = document.getElementById(imageId);
            if (!image) return;

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Titre du document
            doc.setFontSize(16);
            doc.text(title || "Image", 105, 20, { align: "center" });

            // Ajouter l'image
            const imgData = image.src || image.toDataURL('image/png');

            // Calculer les dimensions pour adapter l'image à la page
            const imgWidth = 170;
            const imgHeight = image.height * (imgWidth / image.width);

            doc.addImage(imgData, 'PNG', 20, 30, imgWidth, imgHeight);

            // Pied de page avec date de génération
            const today = new Date();
            const formattedDate = today.toLocaleDateString('fr-FR');
            doc.setFontSize(8);
            doc.text(`Généré le ${formattedDate}`, 105, 280, { align: "center" });

            // Enregistrer le PDF
            doc.save('image.pdf');
        }
    };
})();