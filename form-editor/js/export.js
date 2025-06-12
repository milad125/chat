// Handles generating HTML and CSS for the designed form

function generateFormHtml() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return "";

    // Create a temporary container to clone canvas content for manipulation
    const tempCanvas = canvas.cloneNode(true);

    // Remove any editor-specific classes or elements that shouldn't be in the export
    // For now, our elements are fairly clean, but this is where cleanup would happen.
    // e.g., remove 'selected' class if present from all elements
    tempCanvas.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    // Remove any wrapper divs if they are purely for editor purposes and not for form structure
    // Our current structure with .form-group is likely fine for export.

    // Get the innerHTML of the cleaned canvas content
    let formHtml = tempCanvas.innerHTML;

    // Basic beautification: simple indentation for readability
    // This is a very naive beautifier. A proper library would be better for complex HTML.
    let beautifiedHtml = '';
    let indentLevel = 0;
    const indentSize = 2; // Number of spaces for indentation
    let lines = formHtml.trim().split('\n');
    let formattedLines = [];

    lines.forEach(line => {
        line = line.trim();
        if (line.startsWith('</')) {
            indentLevel = Math.max(0, indentLevel - 1);
        }
        formattedLines.push(' '.repeat(indentLevel * indentSize) + line);
        if (line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>') &&
            (line.includes('>') || line.includes('</'))) { // Basic check for opening tag, not self-closing
             // More complex conditions needed for proper HTML5 void elements
            if (!['<input', '<img', '<br', '<hr'].some(prefix => line.startsWith(prefix))) {
                 indentLevel++;
            }
        }
    });
    beautifiedHtml = formattedLines.join('\n');

    // Wrap in a <form> tag
    const finalHtml = `
<form action="#" method="POST">
${beautifiedHtml.split('\n').map(line => '  ' + line).join('\n')}
</form>
    `;

    return finalHtml.trim();
}

function getExportableCss() {
    // Manually curated CSS rules relevant for the exported form.
    // These should match the styles applied to .form-group, input, label, button from style.css
    // This is a simplified approach for MVP.
    return `
body {
    font-family: sans-serif;
    margin: 20px;
    background-color: #f4f4f4;
    color: #333;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 90vh;
}

form {
    background-color: #ffffff;
    padding: 25px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 450px; /* A bit wider for standalone form */
    border: 1px solid #ddd;
}

.form-group {
    margin-bottom: 15px;
}

.form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
    color: #555;
}

.form-group input[type="text"],
.form-group input[type="email"],
.form-group input[type="password"] {
    width: calc(100% - 22px); /* Adjusted for padding and border */
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
}

.form-group button[type="submit"], /* Assuming buttons in forms are submit */
.form-group button[type="button"] { /* Or general buttons if that's what we used */
    width: 100%;
    padding: 10px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    font-size: 1em;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.form-group button[type="submit"]:hover,
.form-group button[type="button"]:hover {
    background-color: #0056b3;
}

/* Add any other essential styles for other elements like standalone labels if used */
/* For example, if a 'label' element type is just a <label> not in a .form-group */
label {
    /* General styling for standalone labels if needed */
}
    `.trim();
}

function showExportModal(htmlContent, cssContent) {
    const modal = document.getElementById('export-modal');
    const htmlOutput = document.getElementById('html-output');
    const cssOutput = document.getElementById('css-output');
    const closeModalButton = document.getElementById('close-modal-button');

    if (modal && htmlOutput && cssOutput && closeModalButton) {
        htmlOutput.value = htmlContent;
        cssOutput.value = cssContent;
        modal.style.display = 'flex';

        closeModalButton.onclick = () => {
            modal.style.display = 'none';
        };
        // Close modal if clicked outside content
        modal.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    } else {
        console.error("Modal elements not found for export.");
        // Fallback if modal is not there
        alert("HTML Output:\\n" + htmlContent + "\\n\\nCSS Output:\\n" + cssContent);
    }
}
