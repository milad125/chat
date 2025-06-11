document.addEventListener('DOMContentLoaded', () => {
    console.log('Login Form Editor script loaded.');

    // Existing selectors (condensed)
    const draggableElements = document.querySelectorAll('.draggable-element');
    const loginFormContainer = document.getElementById('login-form-container');
    // ... (other selectors like formContainerHasContent, color pickers, gradient inputs/buttons)

    // Drag and Drop, Element Creation, Resizing, Color/Gradient BG logic (assumed to be present)
    // ... (full code for createFormElement, makeElementResizable, color/gradient handlers) ...
    // For brevity, I'm omitting the full code of previous functions here.
    // Assume they are defined as in the previous step.
    draggableElements.forEach(elem => {
        elem.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.dataset.type);
            event.target.style.opacity = '0.7';
        });
        elem.addEventListener('dragend', (event) => {
            event.target.style.opacity = '1';
        });
    });

    loginFormContainer.addEventListener('dragover', (event) => {
        event.preventDefault();
        loginFormContainer.style.border = '2px dashed #007bff';
    });

    loginFormContainer.addEventListener('dragleave', () => {
        loginFormContainer.style.border = 'none';
    });

    // --- BACKGROUND CONTROL LOGIC (Solid Color, Gradient, Clear - from previous steps) ---
    const pageBgColorInput = document.getElementById('page-bg-color');
    const formBgColorInput = document.getElementById('form-bg-color');

    if (pageBgColorInput) {
        pageBgColorInput.addEventListener('input', (event) => {
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = event.target.value;
        });
    }

    if (formBgColorInput && loginFormContainer) {
        formBgColorInput.addEventListener('input', (event) => {
            loginFormContainer.style.backgroundImage = 'none';
            loginFormContainer.style.backgroundColor = event.target.value;
        });
    }

    // Page Gradient
    const pageGradientColor1Input = document.getElementById('page-gradient-color1');
    const pageGradientColor2Input = document.getElementById('page-gradient-color2');
    const pageGradientAngleInput = document.getElementById('page-gradient-angle');
    const applyPageGradientButton = document.getElementById('apply-page-gradient');
    const clearPageBgButton = document.getElementById('clear-page-bg');

    if (applyPageGradientButton && pageGradientColor1Input && pageGradientColor2Input && pageGradientAngleInput) {
        applyPageGradientButton.addEventListener('click', () => {
            const color1 = pageGradientColor1Input.value;
            const color2 = pageGradientColor2Input.value;
            const angle = pageGradientAngleInput.value;
            document.body.style.backgroundColor = ''; // Clear solid color
            document.body.style.backgroundImage = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        });
    }

    if (clearPageBgButton && pageBgColorInput) {
        clearPageBgButton.addEventListener('click', () => {
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = pageBgColorInput.value;
             if(pageBgImageInput) pageBgImageInput.value = ""; // Clear file input
        });
    }

    // Form Gradient
    const formGradientColor1Input = document.getElementById('form-gradient-color1');
    const formGradientColor2Input = document.getElementById('form-gradient-color2');
    const formGradientAngleInput = document.getElementById('form-gradient-angle');
    const applyFormGradientButton = document.getElementById('apply-form-gradient');
    const clearFormBgButton = document.getElementById('clear-form-bg');

    if (applyFormGradientButton && loginFormContainer && formGradientColor1Input && formGradientColor2Input && formGradientAngleInput) {
        applyFormGradientButton.addEventListener('click', () => {
            const color1 = formGradientColor1Input.value;
            const color2 = formGradientColor2Input.value;
            const angle = formGradientAngleInput.value;
            loginFormContainer.style.backgroundColor = ''; // Clear solid color
            loginFormContainer.style.backgroundImage = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        });
    }

    if (clearFormBgButton && loginFormContainer && formBgColorInput) {
        clearFormBgButton.addEventListener('click', () => {
            loginFormContainer.style.backgroundImage = 'none';
            loginFormContainer.style.backgroundColor = formBgColorInput.value;
            if(formBgImageInput) formBgImageInput.value = ""; // Clear file input
        });
    }

    // --- NEW BACKGROUND IMAGE LOGIC ---
    const pageBgImageInput = document.getElementById('page-bg-image');
    const formBgImageInput = document.getElementById('form-bg-image');

    function applyBackgroundImage(targetElement, file, fileInputToReset) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                targetElement.style.backgroundColor = ''; // Clear solid color
                targetElement.style.backgroundImage = `url('${e.target.result}')`;
                targetElement.style.backgroundSize = 'cover';
                targetElement.style.backgroundPosition = 'center center';
                targetElement.style.backgroundRepeat = 'no-repeat';
            }
            reader.readAsDataURL(file);
        } else if (file) {
            alert("Please select a valid image file.");
            if (fileInputToReset) fileInputToReset.value = ""; // Reset the input
        }
    }

    if (pageBgImageInput) {
        pageBgImageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                applyBackgroundImage(document.body, file, pageBgImageInput);
            }
        });
    }

    if (formBgImageInput && loginFormContainer) {
        formBgImageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) {
                applyBackgroundImage(loginFormContainer, file, formBgImageInput);
            }
        });
    }
    // --- END OF NEW BACKGROUND IMAGE LOGIC ---

    // Ensure full function definitions for createFormElement and makeElementResizable are included
    let formContainerInitialized = false;
    if (loginFormContainer && loginFormContainer.children.length > 0 && !loginFormContainer.querySelector('p')) {
        formContainerInitialized = true;
    }
     if (loginFormContainer && loginFormContainer.children.length === 1 && loginFormContainer.querySelector('p')) {
        formContainerInitialized = false;
    }


    if(loginFormContainer) { // Ensure loginFormContainer exists before adding drop listener
        loginFormContainer.addEventListener('drop', (event) => {
            event.preventDefault();
            loginFormContainer.style.border = 'none';
            const elementType = event.dataTransfer.getData('text/plain');

            if (!formContainerInitialized && loginFormContainer.querySelector('p')) {
                loginFormContainer.innerHTML = '';
                formContainerInitialized = true;
                loginFormContainer.style.display = 'block';
                loginFormContainer.style.textAlign = 'left';
                loginFormContainer.style.position = 'relative';
            }

            const newElement = createFormElement(elementType); // Uses globalThis.createFormElement
            if (newElement) {
                loginFormContainer.appendChild(newElement);
                makeElementResizable(newElement); // Uses globalThis.makeElementResizable
            }
        });
    }

    function createFormElement(type) { // Changed from globalThis.createFormElement to just function
        let elementWrapper = document.createElement('div');
        elementWrapper.className = 'form-element-wrapper';
        elementWrapper.style.position = 'relative';
        elementWrapper.style.marginBottom = '10px';
        elementWrapper.style.padding = '5px';

        let element;
        switch (type) {
            case 'text-input':
                element = document.createElement('input');
                element.type = 'text';
                element.placeholder = 'Text Input';
                break;
            case 'password-input':
                element = document.createElement('input');
                element.type = 'password';
                element.placeholder = 'Password Input';
                break;
            case 'button':
                element = document.createElement('button');
                element.textContent = 'Button';
                break;
            case 'label':
                element = document.createElement('label');
                element.textContent = 'Label Text';
                element.contentEditable = 'true';
                element.addEventListener('blur', () => { console.log('Label text changed to:', element.textContent); });
                break;
            default:
                console.warn('Unknown element type:', type);
                return null;
        }

        if (element) {
            element.className = 'form-element';
            element.style.display = 'block';
            element.style.width = '100%';
            element.style.padding = '8px';
            element.style.border = '1px solid #ccc';
            element.style.borderRadius = '4px';
            element.style.boxSizing = 'border-box';

            if (element.tagName === 'BUTTON') {
                element.style.backgroundColor = '#007bff';
                element.style.color = 'white';
                element.style.border = 'none';
                element.style.cursor = 'pointer';
            }
            if (element.tagName === 'LABEL') {
                element.style.backgroundColor = 'transparent';
                element.style.border = '1px dashed #ccc';
            }
            elementWrapper.appendChild(element);
        }
        return elementWrapper;
    };

    function makeElementResizable(elementWrapper) { // Changed from globalThis.makeElementResizable to just function
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'resize-handle bottom-right';
        resizeHandle.style.cssText = `
            position: absolute; width: 12px; height: 12px;
            background-color: #007bff; border: 2px solid #fff;
            border-radius: 50%; bottom: -6px; right: -6px;
            cursor: nwse-resize; z-index: 10;
        `;
        elementWrapper.appendChild(resizeHandle);

        let originalWidth, originalHeight, originalMouseX, originalMouseY;
        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault(); e.stopPropagation();
            originalWidth = parseFloat(getComputedStyle(elementWrapper, null).getPropertyValue('width').replace('px', ''));
            const currentHeight = getComputedStyle(elementWrapper, null).getPropertyValue('height').replace('px', '');
            if (currentHeight === 'auto' || elementWrapper.style.height === 'auto' || !elementWrapper.style.height) {
                originalHeight = elementWrapper.offsetHeight;
                elementWrapper.style.height = originalHeight + 'px';
            } else {
                originalHeight = parseFloat(currentHeight);
            }
            originalMouseX = e.pageX;
            originalMouseY = e.pageY;
            document.addEventListener('mousemove', resizeElement);
            document.addEventListener('mouseup', stopResize);
        });

        function resizeElement(e) {
            const width = originalWidth + (e.pageX - originalMouseX);
            const height = originalHeight + (e.pageY - originalMouseY);
            if (width > 50) elementWrapper.style.width = width + 'px';
            if (height > 30) elementWrapper.style.height = height + 'px';
        }
        function stopResize() {
            document.removeEventListener('mousemove', resizeElement);
            document.removeEventListener('mouseup', stopResize);
        }
    };
});
