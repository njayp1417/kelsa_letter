// Set today's date as default
document.getElementById('date').valueAsDate = new Date();

// Go to preview page
function goToPreview() {
    // Validate required fields
    const requiredFields = ['recipientName', 'recipientAddress', 'date', 'subject', 'body'];
    let isValid = true;
    
    requiredFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (!field.value.trim()) {
            field.style.borderColor = '#d32f2f';
            isValid = false;
        } else {
            field.style.borderColor = '#ddd';
        }
    });
    
    if (!isValid) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Store form data in localStorage
    const formData = {
        recipientName: document.getElementById('recipientName').value,
        recipientAddress: document.getElementById('recipientAddress').value,
        date: document.getElementById('date').value,
        reference: document.getElementById('reference').value,
        subject: document.getElementById('subject').value,
        salutation: document.getElementById('salutation').value,
        body: document.getElementById('body').value,
        closing: document.getElementById('closing').value
    };
    
    localStorage.setItem('letterData', JSON.stringify(formData));
    
    // Navigate to preview page
    window.location.href = 'preview.html';
}