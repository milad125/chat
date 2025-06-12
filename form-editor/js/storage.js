// Handles saving and loading canvas state to/from LocalStorage

const LOCAL_STORAGE_KEY = 'formEditorCanvasState';

function saveCanvasState() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;

    const elementsToSave = [];
    const canvasElements = canvas.querySelectorAll('.form-group.draggable-item'); // Select all elements on canvas

    canvasElements.forEach(el => {
        const elementType = el.dataset.elementType;
        const elementId = el.id;
        let properties = {};

        // Extract properties based on element type - this needs to be robust
        if (elementType === 'textInput' || elementType === 'passwordInput') {
            const labelTag = el.querySelector('label');
            const inputTag = el.querySelector('input');
            properties.label = labelTag ? labelTag.textContent : '';
            properties.placeholder = inputTag ? inputTag.placeholder : '';
        } else if (elementType === 'button') {
            const buttonTag = el.querySelector('button');
            properties.text = buttonTag ? buttonTag.textContent : '';
            // Future: properties.backgroundColor = buttonTag.style.backgroundColor;
        } else if (elementType === 'label') {
            const labelTag = el.querySelector('label');
            properties.text = labelTag ? labelTag.textContent : '';
        }
        // Add more types as needed

        elementsToSave.push({
            id: elementId,
            type: elementType,
            properties: properties
        });
    });

    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(elementsToSave));
        console.log('Canvas state saved to LocalStorage:', elementsToSave);
    } catch (e) {
        console.error('Error saving state to LocalStorage:', e);
    }
}

function loadCanvasState() {
    const canvas = document.getElementById('canvas');
    if (!canvas) return null;

    try {
        const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedState) {
            const elements = JSON.parse(savedState);
            if (elements && elements.length > 0) {
                canvas.innerHTML = ''; // Clear canvas before loading
                elements.forEach(elData => {
                    if (typeof formElements !== 'undefined' && formElements[elData.type] && typeof formElements[elData.type].getFormHtml === 'function') {
                        const newElementHtml = formElements[elData.type].getFormHtml(elData.id);
                        const tempDiv = document.createElement('div');
                        tempDiv.innerHTML = newElementHtml;
                        const newElementNode = tempDiv.firstChild;

                        if (newElementNode && newElementNode.nodeType === Node.ELEMENT_NODE) {
                            newElementNode.id = elData.id; // Ensure ID is set from saved data
                             // Ensure the element has the class .draggable-item for selection logic
                            if (!newElementNode.classList.contains('draggable-item')) {
                                newElementNode.classList.add('draggable-item');
                            }
                            // Ensure data-element-type is set, as properties.js relies on it
                            if (!newElementNode.dataset.elementType) {
                                newElementNode.dataset.elementType = elData.type;
                            }

                            // Apply saved properties
                            if (elData.type === 'textInput' || elData.type === 'passwordInput') {
                                const labelTag = newElementNode.querySelector('label');
                                const inputTag = newElementNode.querySelector('input');
                                if (labelTag && elData.properties.label) labelTag.textContent = elData.properties.label;
                                if (inputTag && elData.properties.placeholder) inputTag.placeholder = elData.properties.placeholder;
                            } else if (elData.type === 'button') {
                                const buttonTag = newElementNode.querySelector('button');
                                if (buttonTag && elData.properties.text) buttonTag.textContent = elData.properties.text;
                            } else if (elData.type === 'label') {
                                const labelTag = newElementNode.querySelector('label');
                                if (labelTag && elData.properties.text) labelTag.textContent = elData.properties.text;
                            }
                            canvas.appendChild(newElementNode);
                        }
                    }
                });
                console.log('Canvas state loaded from LocalStorage.');
                return true; // Indicate that state was loaded
            }
        }
    } catch (e) {
        console.error('Error loading state from LocalStorage:', e);
    }
    return false; // Indicate no state was loaded
}
