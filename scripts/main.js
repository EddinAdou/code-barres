// Point d'entrée principal de l'application
document.addEventListener('DOMContentLoaded', () => {
    // Initialisation de l'UI
    UIController.initialize();

    // Événements principaux
    document.getElementById('qrCodeTab').addEventListener('click', () => UIController.switchTab('qrCode'));
    document.getElementById('barcodeTab').addEventListener('click', () => UIController.switchTab('barcode'));

    document.getElementById('generateButton').addEventListener('click', generateCode);
    document.getElementById('downloadPNG').addEventListener('click', downloadAsPNG);
    document.getElementById('downloadPDF').addEventListener('click', downloadAsPDF);

    // Initialisation du formulaire par défaut
    UIController.changeQRCodeType('text');
    UIController.changeBarcodeType('ean13');

    // Écouteurs pour les changements de type
    document.getElementById('qrCodeType').addEventListener('change', (e) => {
        UIController.changeQRCodeType(e.target.value);
    });

    document.getElementById('barcodeType').addEventListener('change', (e) => {
        UIController.changeBarcodeType(e.target.value);
    });
});

function generateCode() {
    const activeTab = UIController.getActiveTab();
    const codePreview = document.getElementById('codePreview');

    // Vider le conteneur d'aperçu
    codePreview.innerHTML = '';

    if (activeTab === 'qrCode') {
        const qrCodeType = document.getElementById('qrCodeType').value;
        const formData = UIController.getFormData('qrCodeFormFields');

        QRGenerator.generate(qrCodeType, formData, codePreview);
    } else {
        const barcodeType = document.getElementById('barcodeType').value;
        const formData = UIController.getFormData('barcodeFormFields');

        BarcodeGenerator.generate(barcodeType, formData, codePreview);
    }
}

function downloadAsPNG() {
    const activeTab = UIController.getActiveTab();

    if (activeTab === 'qrCode') {
        QRGenerator.downloadAsPNG();
    } else {
        BarcodeGenerator.downloadAsPNG();
    }
}

function downloadAsPDF() {
    const activeTab = UIController.getActiveTab();

    if (activeTab === 'qrCode') {
        PDFGenerator.generateQRCodePDF(QRGenerator.getLastGeneratedData());
    } else {
        PDFGenerator.generateBarcodePDF(BarcodeGenerator.getLastGeneratedData());
    }
}