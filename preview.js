// Load letter data from localStorage and display preview
window.addEventListener('load', function() {
    const letterData = JSON.parse(localStorage.getItem('letterData'));
    
    if (!letterData) {
        alert('No letter data found. Redirecting to form...');
        window.location.href = 'index.html';
        return;
    }
    
    // Update preview elements
    document.getElementById('dateText').textContent = letterData.date ? `Date: ${letterData.date}` : '';
    document.getElementById('referenceText').textContent = letterData.reference || '';
    document.getElementById('recipientNameText').textContent = letterData.recipientName || '';
    document.getElementById('recipientAddressText').textContent = letterData.recipientAddress || '';
    document.getElementById('subjectText').textContent = letterData.subject ? `RE: ${letterData.subject}` : '';
    document.getElementById('salutationText').textContent = letterData.salutation || '';
    document.getElementById('bodyText').textContent = letterData.body || '';
    document.getElementById('closingText').textContent = letterData.closing || '';
});

// Go back to edit form
function goBack() {
    window.location.href = 'index.html';
}

// Generate PDF function
async function generatePDF() {
    const element = document.getElementById('letter');
    
    try {
        const canvas = await html2canvas(element, {
            scale: 2,
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
        const letterData = JSON.parse(localStorage.getItem('letterData'));
        const subject = letterData.subject || 'letter';
        const safeSubject = subject.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
        const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
        const filename = `kelsa_${safeSubject}_${timestamp}.pdf`;
        
        pdf.save(filename);
        
    } catch (error) {
        console.error('Error generating PDF:', error);
        alert('Error generating PDF. Please try again.');
    }
}