// Handles displaying and updating properties for selected elements

let currentSelectedElement = null;

// Define editable properties for each element type
const editableProperties = {
    textInput: [
        { name: 'label', type: 'text', label: 'متن برچسب (Label)' },
        { name: 'placeholder', type: 'text', label: 'متن جایگزین (Placeholder)' }
    ],
    passwordInput: [
        { name: 'label', type: 'text', label: 'متن برچسب (Label)' },
        { name: 'placeholder', type: 'text', label: 'متن جایگزین (Placeholder)' }
    ],
    button: [
        { name: 'text', type: 'text', label: 'متن دکمه' },
        // { name: 'backgroundColor', type: 'color', label: 'رنگ پس‌زمینه' }, // Future
        // { name: 'textColor', type: 'color', label: 'رنگ متن' } // Future
    ],
    label: [
        { name: 'text', type: 'text', label: 'متن برچسب' }
    ]
};

function displayProperties(element) {
    currentSelectedElement = element;
    const propertiesPanel = document.getElementById('properties-panel');
    propertiesPanel.innerHTML = '<h2>تنظیمات عنصر</h2>'; // Clear previous, keep title

    const elementType = element.dataset.elementType; // Assuming elements on canvas have 'data-element-type'
    const props = editableProperties[elementType];

    if (!props) {
        propertiesPanel.innerHTML += '<p>هیچ ویژگی قابل ویرایشی برای این عنصر وجود ندارد.</p>';
        return;
    }

    props.forEach(prop => {
        const propGroup = document.createElement('div');
        propGroup.className = 'property-group';

        const label = document.createElement('label');
        label.setAttribute('for', `prop-${prop.name}`);
        label.textContent = prop.label + ':';
        propGroup.appendChild(label);

        const input = document.createElement('input');
        input.type = prop.type;
        input.id = `prop-${prop.name}`;
        input.name = prop.name;

        // Get current value from element
        if (elementType === 'button' && prop.name === 'text') {
            input.value = element.querySelector('button') ? element.querySelector('button').textContent : '';
        } else if ((elementType === 'textInput' || elementType === 'passwordInput') && prop.name === 'label') {
            input.value = element.querySelector('label') ? element.querySelector('label').textContent : '';
        } else if ((elementType === 'textInput' || elementType === 'passwordInput') && prop.name === 'placeholder') {
            input.value = element.querySelector('input') ? element.querySelector('input').placeholder : '';
        } else if (elementType === 'label' && prop.name === 'text') {
             input.value = element.querySelector('label') ? element.querySelector('label').textContent : '';
        }
        // Add more specific value retrievals if needed, e.g. for colors

        input.addEventListener('input', (e) => {
            updateElementProperty(element, prop.name, e.target.value, elementType);
        });
        propGroup.appendChild(input);
        propertiesPanel.appendChild(propGroup);
    });
}

function updateElementProperty(element, propName, value, elementType) {
    if (!element) return;

    if (elementType === 'button' && propName === 'text') {
        const buttonTag = element.querySelector('button');
        if (buttonTag) buttonTag.textContent = value;
    } else if ((elementType === 'textInput' || elementType === 'passwordInput') && propName === 'label') {
        const labelTag = element.querySelector('label');
        if (labelTag) labelTag.textContent = value;
    } else if ((elementType === 'textInput' || elementType === 'passwordInput') && propName === 'placeholder') {
        const inputTag = element.querySelector('input');
        if (inputTag) inputTag.placeholder = value;
    } else if (elementType === 'label' && propName === 'text') {
        const labelTag = element.querySelector('label');
        if (labelTag) labelTag.textContent = value;
    }
    // Add more specific property updates, e.g. for style.backgroundColor

    // Mark that changes have been made (for LocalStorage saving, if needed)
    // This could be a global flag or an event.
    console.log(`Property ${propName} updated to ${value} for element ${element.id}`);
    if (typeof saveCanvasState === 'function') {
        saveCanvasState();
    }
}

function clearPropertiesPanel() {
    currentSelectedElement = null;
    const propertiesPanel = document.getElementById('properties-panel');
    propertiesPanel.innerHTML = '<h2>تنظیمات</h2><p>برای ویرایش، یک عنصر را از بوم انتخاب کنید.</p>';
}
