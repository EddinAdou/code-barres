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

        generateBarcodePDF: function(data) {
            if (!data) return;

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();

            // Titre
            doc.setFontSize(18);
            doc.text('Code-barres produit', 105, 20, { align: 'center' });

            // Ajout de l'image du code-barres
            const canvas = document.getElementById('barcodeCanvas');
            if (canvas) {
                const imgData = canvas.toDataURL('image/jpeg', 1.0);
                doc.addImage(imgData, 'JPEG', 55, 30, 100, 50);
            }

            // Informations du produit
            doc.setFontSize(12);
            let y = 90;

            if (data.type === 'ean13' && data.formData) {
                const formData = data.formData;

                doc.setFont(undefined, 'bold');
                doc.text(`Code EAN-13: ${data.data}`, 20, y);
                y += 10;

                if (formData.productName) {
                    doc.text(`Nom du produit: ${formData.productName}`, 20, y);
                    y += 7;
                }

                if (formData.brand) {
                    doc.text(`Marque: ${formData.brand}`, 20, y);
                    y += 7;
                }

                if (formData.category) {
                    doc.text(`Catégorie: ${formData.category}`, 20, y);
                    y += 7;
                }

                if (formData.price) {
                    doc.text(`Prix: ${formData.price} €`, 20, y);
                    y += 7;
                }

                if (formData.weight) {
                    doc.text(`Poids/Volume: ${formData.weight}`, 20, y);
                    y += 7;
                }

                if (formData.sku) {
                    doc.text(`Référence: ${formData.sku}`, 20, y);
                    y += 7;
                }

                if (formData.country) {
                    doc.text(`Pays d'origine: ${formData.country}`, 20, y);
                    y += 7;
                }

                if (formData.manufacturer) {
                    doc.text(`Fabricant: ${formData.manufacturer}`, 20, y);
                    y += 7;
                }

                if (formData.vatRate) {
                    doc.text(`TVA: ${formData.vatRate}%`, 20, y);
                    y += 7;
                }

                if (formData.expiryDate) {
                    doc.text(`Date d'expiration: ${formData.expiryDate}`, 20, y);
                    y += 7;
                }

                if (formData.description) {
                    doc.setFont(undefined, 'bold');
                    doc.text(`Description:`, 20, y);
                    y += 7;
                    doc.setFont(undefined, 'normal');

                    // Découper la description en lignes
                    const splitDescription = doc.splitTextToSize(formData.description, 170);
                    doc.text(splitDescription, 20, y);
                }
            }

            // Télécharger le PDF
            doc.save(`barcode-${data.type}.pdf`);
        }
    };
})();
