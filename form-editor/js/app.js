// Main JavaScript file for the form editor
console.log("ویرایشگر فرم آماده شد - app.js loaded");

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed.");
    populateElementsPanel();
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

    // For Export Functionality
    if (typeof setupExportButton === 'function') {
        setupExportButton();
    }
    if (typeof setupModalTabs === 'function') {
        setupModalTabs();
    }
});

function populateElementsPanel() {
    const panel = document.getElementById('elements-panel');
    if (!panel || typeof formElements === 'undefined') {
        console.error("Elements panel or formElements definition not found.");
        return;
    }
    panel.innerHTML = '<h2>عناصر</h2>';

    for (const key in formElements) {
        const element = formElements[key];
        const div = document.createElement('div');
        div.className = 'palette-item';
        div.setAttribute('draggable', true);
        div.setAttribute('data-element-type', element.type);
        div.innerHTML = element.htmlRepresentation;
        panel.appendChild(div);
    }
    // console.log("Elements panel populated."); // Reduce console noise
}

function setupDragAndDrop() {
    const panel = document.getElementById('elements-panel');
    const canvas = document.getElementById('canvas');

    panel.addEventListener('dragstart', (event) => {
        const paletteItem = event.target.closest('.palette-item');
        if (paletteItem) {
            event.dataTransfer.setData('text/plain', paletteItem.getAttribute('data-element-type'));
            // console.log('Drag started:', paletteItem.getAttribute('data-element-type')); // Reduce console noise
        }
    });

    canvas.addEventListener('dragover', (event) => {
        event.preventDefault();
    });

    canvas.addEventListener('drop', (event) => {
        event.preventDefault();
        const elementType = event.dataTransfer.getData('text/plain');
        // console.log('Dropped:', elementType); // Reduce console noise

        if (typeof formElements !== 'undefined' && formElements[elementType] && typeof formElements[elementType].getFormHtml === 'function') {
            if (canvas.querySelector('.form-template')) {
                const existingUserElements = canvas.querySelectorAll('.form-group.draggable-item');
                if (existingUserElements.length === 0) {
                    canvas.innerHTML = '';
                }
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
                // console.log(elementType, "added to canvas with ID:", elementId); // Reduce console noise
                if (typeof saveCanvasState === 'function') {
                    saveCanvasState();
                }
            } else {
                 console.error("Could not create a valid DOM element from HTML for", elementType);
            }
        } else {
            console.error("Dropped element type not found or has no getFormHtml method:", elementType);
        }
    });
    // console.log("Drag and drop event listeners set up."); // Reduce console noise
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
            // console.log('Element selected:', clickedElement.id, "Type:", clickedElement.dataset.elementType); // Reduce console noise
            if (typeof displayProperties === 'function') {
                displayProperties(clickedElement);
            }
        } else {
            if (typeof clearPropertiesPanel === 'function') {
                clearPropertiesPanel();
            }
        }
    });
    // console.log("Canvas click listener for selection set up."); // Reduce console noise
}

function loadDefaultTemplate() {
    const canvas = document.getElementById('canvas');
    if (canvas && typeof templates !== 'undefined' && templates.simpleLogin && canvas.innerHTML.trim() === '') {
        canvas.innerHTML = templates.simpleLogin.html;
        // console.log("قالب ورود ساده بارگذاری شد."); // Reduce console noise
    } else if (canvas && canvas.innerHTML.trim() === '') {
        // console.error("Canvas or simpleLogin template not found for default loading, and canvas is empty."); // Reduce console noise
    }
}

// --- Functions for Export Functionality ---
function setupExportButton() {
    const exportButton = document.getElementById('export-button');
    if (exportButton && typeof generateFormHtml === 'function' && typeof getExportableCss === 'function' && typeof showExportModal === 'function') {
        exportButton.addEventListener('click', () => {
            // console.log("Export button clicked."); // Reduce console noise
            const html = generateFormHtml();
            const css = getExportableCss();
            showExportModal(html, css);
        });
        // console.log("Export button listener set up."); // Reduce console noise
    } else {
        console.error("Export button or necessary export functions not found for setup.");
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
    // Ensure HTML tab is active by default when modal is first shown or page loads
    const defaultActiveTab = modal.querySelector('.tab-button[data-tab="html-output-container"]');
    const defaultActiveContainer = modal.querySelector('#html-output-container');
    if(defaultActiveTab && defaultActiveContainer){
        // Check if any tab is already active, if not, activate default.
        const anyActiveTab = modal.querySelector('.tab-button.active');
        if (!anyActiveTab) {
            defaultActiveTab.classList.add('active');
            defaultActiveContainer.classList.add('active');
        }
    }
}
