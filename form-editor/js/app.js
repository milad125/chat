// Main JavaScript file for the form editor
// console.log("ویرایشگر فرم آماده شد - app.js loaded"); // Reduced console noise

document.addEventListener('DOMContentLoaded', () => {
    // console.log("DOM fully loaded and parsed."); // Reduced console noise
    populateTemplateSelector(); // Populate template selector first
    populateElementsPanel();    // Then populate draggable elements
    setupDragAndDrop();
    setupCanvasClickListener();

    let stateLoaded = false;
    if (typeof loadCanvasState === 'function') {
        stateLoaded = loadCanvasState();
    }

    if (!stateLoaded && typeof loadDefaultTemplate === 'function') {
        loadDefaultTemplate();
    }

    if (typeof clearPropertiesPanel === 'function') {
        clearPropertiesPanel();
    }

    if (typeof setupExportButton === 'function') setupExportButton();
    if (typeof setupModalTabs === 'function') setupModalTabs();
});

function populateElementsPanel() {
    const panel = document.getElementById('elements-panel');
    if (!panel || typeof formElements === 'undefined') {
        console.error("Elements panel or formElements definition not found.");
        return;
    }

    let elementsListContainer = panel.querySelector('#draggable-elements-list');
    if (!elementsListContainer) {
        // Ensure the main "عناصر" H2 is there if not handled by index.html structure around template selector
        // This assumes the H2 for "عناصر" is still in index.html or managed separately
        elementsListContainer = document.createElement('div');
        elementsListContainer.id = 'draggable-elements-list';

        // Find the h2 for "عناصر" and insert the list after it.
        const elementsH2 = Array.from(panel.querySelectorAll('h2')).find(h2 => h2.textContent === 'عناصر');
        if (elementsH2 && elementsH2.nextSibling) {
            panel.insertBefore(elementsListContainer, elementsH2.nextSibling);
        } else {
            panel.appendChild(elementsListContainer); // Fallback append
        }
    }
    elementsListContainer.innerHTML = ''; // Clear previous draggable elements

    for (const key in formElements) {
        const element = formElements[key];
        const div = document.createElement('div');
        div.className = 'palette-item';
        div.setAttribute('draggable', true);
        div.setAttribute('data-element-type', element.type);
        div.innerHTML = element.htmlRepresentation;
        elementsListContainer.appendChild(div);
    }
    // console.log("Elements panel populated."); // Reduced console noise
}

function populateTemplateSelector() {
    const container = document.getElementById('template-selector-container');
    const canvas = document.getElementById('canvas');

    if (!container || !canvas || typeof templates === 'undefined') {
        console.error("Template selector container, canvas, or templates definition not found.");
        if(container) container.innerHTML = '<p style="color:red; font-size:0.8em;">خطا در بارگذاری قالب‌ها.</p>';
        return;
    }
    // Title (<h3>قالب‌ها</h3>) is assumed to be in index.html from previous step.

    const templatesList = document.createElement('div');
    templatesList.className = 'templates-list';
    container.appendChild(templatesList);

    for (const key in templates) {
        const template = templates[key];
        const button = document.createElement('button');
        button.className = 'template-select-button editor-button'; // Re-use editor-button for consistent styling
        button.textContent = template.name;
        button.setAttribute('data-template-id', template.id);

        button.addEventListener('click', () => {
            // console.log("Template selected:", template.name); // Reduced console noise
            canvas.innerHTML = template.html;

            // Clear any selected element state from properties panel
            if (typeof clearPropertiesPanel === 'function') {
                clearPropertiesPanel();
            }
            // Save the new state (the template itself) to LocalStorage
            if (typeof saveCanvasState === 'function') {
                 saveCanvasState();
            }
            // No need to call setupCanvasClickListener again, it's on the canvas element itself.
        });
        templatesList.appendChild(button);
    }
    // console.log("Template selector populated."); // Reduced console noise
}


function setupDragAndDrop() {
    // Drag source is now #draggable-elements-list within #elements-panel
    const draggableItemsContainer = document.getElementById('draggable-elements-list');
    const canvas = document.getElementById('canvas');

    if (!draggableItemsContainer) {
        console.error("#draggable-elements-list container not found for dragstart listener.");
        return;
    }

    draggableItemsContainer.addEventListener('dragstart', (event) => {
        const paletteItem = event.target.closest('.palette-item');
        if (paletteItem) {
            event.dataTransfer.setData('text/plain', paletteItem.getAttribute('data-element-type'));
        }
    });

    canvas.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    canvas.addEventListener('drop', (event) => {
        event.preventDefault();
        const elementType = event.dataTransfer.getData('text/plain');

        if (typeof formElements !== 'undefined' && formElements[elementType] && typeof formElements[elementType].getFormHtml === 'function') {
            // If a .form-template div is on canvas (likely from a loaded template)
            // AND it contains no .form-group.draggable-item elements yet (meaning it's pristine),
            // then clear the canvas before dropping the first real element.
            const formTemplateOnCanvas = canvas.querySelector('.form-template');
            if (formTemplateOnCanvas && formTemplateOnCanvas.querySelectorAll('.form-group.draggable-item').length === 0) {
                canvas.innerHTML = '';
            }

            const elementId = elementType + '_' + Date.now();
            const newElementHtml = formElements[elementType].getFormHtml(elementId);

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newElementHtml;
            const newElementNode = tempDiv.firstChild;

            if (newElementNode && newElementNode.nodeType === Node.ELEMENT_NODE) {
                newElementNode.id = elementId;
                if (!newElementNode.classList.contains('draggable-item')) {
                    newElementNode.classList.add('draggable-item');
                }
                if (!newElementNode.dataset.elementType) {
                    newElementNode.dataset.elementType = elementType;
                }
                canvas.appendChild(newElementNode);
                if (typeof saveCanvasState === 'function') saveCanvasState();
            } else {
                 console.error("Could not create a valid DOM element from HTML for", elementType);
            }
        } else {
            console.error("Dropped element type not found or has no getFormHtml method:", elementType);
        }
    });
}

function setupCanvasClickListener() {
    const canvas = document.getElementById('canvas');
    canvas.addEventListener('click', (event) => {
        const clickedElement = event.target.closest('.form-group.draggable-item');

        const currentlySelected = canvas.querySelector('.selected');
        if (currentlySelected) {
            currentlySelected.classList.remove('selected');
        }

        if (clickedElement) {
            clickedElement.classList.add('selected');
            if (typeof displayProperties === 'function') {
                displayProperties(clickedElement);
            }
        } else {
            if (typeof clearPropertiesPanel === 'function') {
                clearPropertiesPanel();
            }
        }
    });
}

function loadDefaultTemplate() {
    const canvas = document.getElementById('canvas');
    if (canvas && typeof templates !== 'undefined' && templates.simpleLogin && canvas.innerHTML.trim() === '') {
        canvas.innerHTML = templates.simpleLogin.html;
        // Do NOT saveCanvasState here automatically.
        // Let user action (dropping element, changing property, or choosing another template) trigger first save.
        // This prevents overwriting a potentially empty localStorage on first load if user immediately picks another template.
    } else if (canvas && canvas.innerHTML.trim() === '') {
        // console.error("Canvas or simpleLogin template not found for default loading, and canvas is empty."); // Reduced console noise
    }
}

// --- Functions for Export Functionality ---
function setupExportButton() {
    const exportButton = document.getElementById('export-button');
    if (exportButton && typeof generateFormHtml === 'function' && typeof getExportableCss === 'function' && typeof showExportModal === 'function') {
        exportButton.addEventListener('click', () => {
            const html = generateFormHtml();
            const css = getExportableCss();
            showExportModal(html, css);
        });
    } else {
        // console.error("Export button or necessary export functions not found for setup."); // Reduced console noise
    }
}

function setupModalTabs() {
    const modal = document.getElementById('export-modal');
    if (!modal) return;

    const tabButtons = modal.querySelectorAll('.tab-button');
    const codeContainers = modal.querySelectorAll('.code-container');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            codeContainers.forEach(cont => cont.classList.remove('active'));

            button.classList.add('active');
            const targetTabId = button.dataset.tab;
            const targetContainer = document.getElementById(targetTabId);
            if (targetContainer) {
                targetContainer.classList.add('active');
            }
        });
    });
    const defaultActiveTab = modal.querySelector('.tab-button[data-tab="html-output-container"]');
    const defaultActiveContainer = modal.querySelector('#html-output-container');
     if(defaultActiveTab && defaultActiveContainer){
        const anyActiveTab = modal.querySelector('.tab-button.active');
        if (!anyActiveTab) {
            defaultActiveTab.classList.add('active');
            defaultActiveContainer.classList.add('active');
        }
    }
}
