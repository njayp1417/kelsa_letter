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
    
    // Auto-scale content
    autoScaleText();
});

// Go back to edit form
function goBack() {
    window.location.href = 'index.html';
}

// Auto-scale text to fit
function autoScaleText() {
    const bodyText = document.getElementById('bodyText');
    const letterData = JSON.parse(localStorage.getItem('letterData'));
    const text = letterData.body || '';
    
    // Check if text is too long
    if (text.length > 800) {
        bodyText.style.fontSize = '10px';
        bodyText.style.lineHeight = '1.2';
    } else if (text.length > 500) {
        bodyText.style.fontSize = '11px';
        bodyText.style.lineHeight = '1.3';
    } else {
        bodyText.style.fontSize = '12px';
        bodyText.style.lineHeight = '1.4';
    }
    
    // Truncate if still too long
    if (text.length > 1200) {
        const truncated = text.substring(0, 1200) + '...';
        bodyText.textContent = truncated;
        
        // Show warning
        if (!document.getElementById('lengthWarning')) {
            const warning = document.createElement('div');
            warning.id = 'lengthWarning';
            warning.style.cssText = 'background: #fff3cd; color: #856404; padding: 10px; margin: 10px 0; border-radius: 5px; border: 1px solid #ffeaa7;';
            warning.innerHTML = '⚠️ Letter content was truncated to fit on one page. Consider shortening your message.';
            document.querySelector('.preview-section').insertBefore(warning, document.getElementById('letter'));
        }
    }
}

// Generate PDF function
async function generatePDF() {
    const element = document.getElementById('letter');
    
    try {
        // Auto-scale before generating
        autoScaleText();
        
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