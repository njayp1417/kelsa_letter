# Kelsa Letter Generator

A web-based letter generator that creates professional letters using your existing letterhead template.

## Features

- Removes text from existing PDF while preserving letterhead/graphics
- Web interface for easy letter creation
- Automatic PDF generation with your branding
- Supports recipient details, dates, subjects, body text, and financial totals

## Setup

1. **Install dependencies and create blank template:**
   ```bash
   python setup.py
   ```

2. **Start the web server:**
   ```bash
   python app.py
   ```

3. **Open your browser and go to:**
   ```
   http://localhost:5000
   ```

## How it works

1. **Template Creation**: The `create_blank_template.py` script removes all text from your original PDF (`kelsa_day.pdf`) while keeping the letterhead, logo, and design intact.

2. **Letter Generation**: The web app overlays new text onto the blank template using your form inputs.

3. **PDF Output**: Downloads a complete letter with your letterhead and the new content.

## Files

- `kelsa_day.pdf` - Your original letter template
- `kelsa_blank_template.pdf` - Generated blank template (created automatically)
- `app.py` - Flask web application
- `create_blank_template.py` - Script to create blank template
- `templates/index.html` - Web form interface
- `requirements.txt` - Python dependencies
- `setup.py` - Setup script

## Customization

To adjust text positioning, modify the coordinates in `app.py` in the `generate_letter()` function:

```python
c.drawString(x_position, y_position, text)
```

Where:
- `x_position`: Horizontal position (0 = left edge)
- `y_position`: Vertical position (0 = bottom edge)
- A4 page is approximately 595 x 842 points