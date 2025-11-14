// Set today's date as default
document.getElementById('date').valueAsDate = new Date();

// Update preview in real-time
function updatePreview() {
    const recipientName = document.getElementById('recipientName').value;
    const recipientAddress = document.getElementById('recipientAddress').value;
    const date = document.getElementById('date').value;
    const reference = document.getElementById('reference').value;
    const subject = document.getElementById('subject').value;
    const salutation = document.getElementById('salutation').value;
    const body = document.getElementById('body').value;
    const closing = document.getElementById('closing').value;

    // Update preview elements
    document.getElementById('dateText').textContent = date ? `Date: ${date}` : '';
    document.getElementById('referenceText').textContent = reference;
    document.getElementById('recipientNameText').textContent = recipientName;
    document.getElementById('recipientAddressText').textContent = recipientAddress;
    document.getElementById('subjectText').textContent = subject ? `RE: ${subject}` : '';
    document.getElementById('salutationText').textContent = salutation;
    document.getElementById('bodyText').textContent = body;
    document.getElementById('closingText').textContent = closing;
}

// Add event listeners to all inputs
document.querySelectorAll('input, textarea').forEach(element => {
    element.addEventListener('input', updatePreview);
});

// Generate PDF function
async function generatePDF() {
    const element = document.getElementById('letter');
    
    try {
        // Hide any UI elements that shouldn't be in PDF
        const canvas = await html2canvas(element, {
            scale: 2, // Higher quality
            useCORS: true,
            allowTaint: true
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // Create PDF
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'pt', 'a4');
        
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        
        // Generate filename
        const subject = document.getElementById('subject').value || 'letter';
        const safeSubject = subject.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `kelsa_${safeSubject}_${timestamp}.pdf`;
        
        pdf.save(filename);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}

// Initialize preview
updatePreview();