from flask import Flask, render_template, request, send_file
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch

from PyPDF2 import PdfReader, PdfWriter
import io
import os
from datetime import datetime
import textwrap

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')



def wrap_text(text, max_chars=80):
    """Simple text wrapping by character count"""
    import textwrap
    return textwrap.wrap(text, width=max_chars)

@app.route('/generate', methods=['POST'])
def generate_letter():
    try:
        # Get form data
        recipient_name = request.form.get('recipient_name', '')
        recipient_address = request.form.get('recipient_address', '')
        date = request.form.get('date') or datetime.now().strftime('%Y-%m-%d')
        reference = request.form.get('reference', '')
        subject = request.form.get('subject', '')
        salutation = request.form.get('salutation', 'Dear Sir/Madam,')
        body = request.form.get('body', '')
        closing = request.form.get('closing', 'Yours faithfully,')
        subtotal = request.form.get('subtotal', '')
        tax = request.form.get('tax', '')
        total = request.form.get('total', '')
        
        # Create overlay PDF with text
        overlay_buffer = io.BytesIO()
        c = canvas.Canvas(overlay_buffer, pagesize=A4)
        
        # A4 dimensions: 595 x 842 points
        page_width, page_height = A4
        
        # Font settings
        font_name = "Helvetica"
        font_size = 11
        c.setFont(font_name, font_size)
        
        # Professional letter positioning for clean template
        left_margin = 80
        right_margin = page_width - 80
        
        # Date (top right, below letterhead)
        c.drawRightString(right_margin, page_height - 180, f"Date: {date}")
        
        # Reference (if provided)
        if reference:
            c.drawRightString(right_margin, page_height - 200, reference)
        
        # Recipient information (left side, proper spacing)
        y_pos = page_height - 250
        
        if recipient_name:
            c.setFont(font_name + "-Bold", font_size)
            c.drawString(left_margin, y_pos, recipient_name)
            y_pos -= 20
        
        # Recipient address (wrap if needed)
        if recipient_address:
            c.setFont(font_name, font_size)
            address_lines = recipient_address.split('\n')
            for line in address_lines:
                if line.strip():
                    wrapped_lines = wrap_text(line.strip(), 60)
                    for wrapped_line in wrapped_lines:
                        c.drawString(left_margin, y_pos, wrapped_line)
                        y_pos -= 15
        
        # Subject
        y_pos -= 20
        if subject:
            c.setFont(font_name + "-Bold", font_size)
            subject_text = f"RE: {subject}"
            # Center the subject or keep it left-aligned
            c.drawString(left_margin, y_pos, subject_text)
            y_pos -= 30
        
        # Salutation
        c.setFont(font_name, font_size)
        c.drawString(left_margin, y_pos, salutation)
        y_pos -= 25
        
        # Body text (wrap and format)
        if body:
            body_lines = body.split('\n')
            for paragraph in body_lines:
                if paragraph.strip():
                    wrapped_lines = wrap_text(paragraph.strip(), 80)
                    for line in wrapped_lines:
                        if y_pos < 200:  # Check if we're running out of space
                            break
                        c.drawString(left_margin, y_pos, line)
                        y_pos -= 15
                    y_pos -= 10  # Extra space between paragraphs
        
        # Financial information (if provided)
        if any([subtotal, tax, total]):
            y_pos -= 20
            financial_x = page_width - 250  # Right-aligned
            
            if subtotal:
                c.drawString(financial_x, y_pos, f"Subtotal: ₦{subtotal}")
                y_pos -= 15
            
            if tax:
                c.drawString(financial_x, y_pos, f"Tax/VAT: ₦{tax}")
                y_pos -= 15
            
            if total:
                c.setFont(font_name + "-Bold", font_size)
                c.drawString(financial_x, y_pos, f"Total: ₦{total}")
                y_pos -= 20
        
        # Closing
        y_pos -= 20
        c.setFont(font_name, font_size)
        c.drawString(left_margin, y_pos, closing)
        
        # Signature directly below closing (like a block)
        y_pos -= 20
        
        # Add signature image if available
        signature_files = ["signature.png", "signature.jpg", "signature.jpeg", "signature.webp"]
        signature_path = None
        for sig_file in signature_files:
            if os.path.exists(sig_file):
                signature_path = sig_file
                break
        
        if signature_path:
            try:
                c.drawImage(signature_path, 50, y_pos - 70, width=250, height=70, preserveAspectRatio=True)
                y_pos -= 80
            except:
                y_pos -= 20
        else:
            y_pos -= 20
        
        # FOR: KELSA EVENT in italic bold capitals
        c.setFont(font_name + "-BoldOblique", 11)
        c.drawString(left_margin, y_pos, "FOR: KELSA EVENT MANAGEMENT")
        
        c.save()
        overlay_buffer.seek(0)
        
        # Use clean template directly
        template_path = "kelsa_day.pdf"
        if not os.path.exists(template_path):
            return "Error: kelsa_day.pdf not found. Please ensure the template is in the project directory.", 400
        
        # Merge with clean template
        template_reader = PdfReader(template_path)
        overlay_reader = PdfReader(overlay_buffer)
        
        writer = PdfWriter()
        
        # Merge first page
        template_page = template_reader.pages[0]
        overlay_page = overlay_reader.pages[0]
        template_page.merge_page(overlay_page)
        writer.add_page(template_page)
        
        # Save final PDF
        output_buffer = io.BytesIO()
        writer.write(output_buffer)
        output_buffer.seek(0)
        
        # Generate filename using subject
        safe_subject = "".join(c for c in subject if c.isalnum() or c in (' ', '-', '_')).rstrip()[:30] if subject else "letter"
        filename = f"kelsa_{safe_subject}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
        
        return send_file(
            output_buffer,
            as_attachment=True,
            download_name=filename,
            mimetype='application/pdf'
        )
        
    except Exception as e:
        return f"Error generating letter: {str(e)}", 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)