document.addEventListener('DOMContentLoaded', () => {
    // ... (all previous code: selectors, drag/drop, resize, background logic)
    // For brevity, only new/modified parts are shown in detail.
    // Assume all previous functions and event listeners are correctly in place.

    console.log('Login Form Editor script loaded. Initializing icons...');

    // --- Full code from previous steps should be here ---
    // Ensure all selectors and functions like createFormElement, makeElementResizable,
    // background handlers, etc., are present.
    const draggableElements = document.querySelectorAll('.draggable-element');
    const loginFormContainer = document.getElementById('login-form-container');
    let formContainerInitialized = false;
    if (loginFormContainer && loginFormContainer.children.length > 0 && !loginFormContainer.querySelector('p')) {
        formContainerInitialized = true;
    }
     if (loginFormContainer && loginFormContainer.children.length === 1 && loginFormContainer.querySelector('p')) {
        formContainerInitialized = false;
    }

    const pageBgColorInput = document.getElementById('page-bg-color');
    const formBgColorInput = document.getElementById('form-bg-color');
    const pageGradientColor1Input = document.getElementById('page-gradient-color1');
    const pageGradientColor2Input = document.getElementById('page-gradient-color2');
    const pageGradientAngleInput = document.getElementById('page-gradient-angle');
    const applyPageGradientButton = document.getElementById('apply-page-gradient');
    const clearPageBgButton = document.getElementById('clear-page-bg');
    const formGradientColor1Input = document.getElementById('form-gradient-color1');
    const formGradientColor2Input = document.getElementById('form-gradient-color2');
    const formGradientAngleInput = document.getElementById('form-gradient-angle');
    const applyFormGradientButton = document.getElementById('apply-form-gradient');
    const clearFormBgButton = document.getElementById('clear-form-bg');
    const pageBgImageInput = document.getElementById('page-bg-image');
    const formBgImageInput = document.getElementById('form-bg-image');

    // Event listeners for drag/drop
    draggableElements.forEach(elem => {
        elem.addEventListener('dragstart', (event) => {
            event.dataTransfer.setData('text/plain', event.target.dataset.type);
            event.target.style.opacity = '0.7';
        });
        elem.addEventListener('dragend', (event) => {
            event.target.style.opacity = '1';
        });
    });

    if(loginFormContainer) {
        loginFormContainer.addEventListener('dragover', (event) => { event.preventDefault(); loginFormContainer.style.border = '2px dashed #007bff'; });
        loginFormContainer.addEventListener('dragleave', () => { loginFormContainer.style.border = 'none'; });
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
            const newElement = createFormElement(elementType);
            if (newElement) {
                loginFormContainer.appendChild(newElement);
                makeElementResizable(newElement);
            }
        });
    }


    // Background color logic
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
    // Gradient logic
    if (applyPageGradientButton && pageGradientColor1Input && pageGradientColor2Input && pageGradientAngleInput) {
        applyPageGradientButton.addEventListener('click', () => {
            const color1 = pageGradientColor1Input.value;
            const color2 = pageGradientColor2Input.value;
            const angle = pageGradientAngleInput.value;
            document.body.style.backgroundColor = '';
            document.body.style.backgroundImage = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        });
    }
    if (clearPageBgButton && pageBgColorInput) {
        clearPageBgButton.addEventListener('click', () => {
            document.body.style.backgroundImage = 'none';
            document.body.style.backgroundColor = pageBgColorInput.value;
            if(pageBgImageInput) pageBgImageInput.value = "";
        });
    }
    if (applyFormGradientButton && loginFormContainer && formGradientColor1Input && formGradientColor2Input && formGradientAngleInput) {
        applyFormGradientButton.addEventListener('click', () => {
            const color1 = formGradientColor1Input.value;
            const color2 = formGradientColor2Input.value;
            const angle = formGradientAngleInput.value;
            loginFormContainer.style.backgroundColor = '';
            loginFormContainer.style.backgroundImage = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
        });
    }
    if (clearFormBgButton && loginFormContainer && formBgColorInput) {
        clearFormBgButton.addEventListener('click', () => {
            loginFormContainer.style.backgroundImage = 'none';
            loginFormContainer.style.backgroundColor = formBgColorInput.value;
            if(formBgImageInput) formBgImageInput.value = "";
        });
    }

    // Background image logic
    function applyBackgroundImage(targetElement, file, fileInputToReset) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                targetElement.style.backgroundColor = '';
                targetElement.style.backgroundImage = `url('${e.target.result}')`;
                targetElement.style.backgroundSize = 'cover';
                targetElement.style.backgroundPosition = 'center center';
                targetElement.style.backgroundRepeat = 'no-repeat';
            }
            reader.readAsDataURL(file);
        } else if (file) {
            alert("Please select a valid image file.");
            if (fileInputToReset) fileInputToReset.value = "";
        }
    }
    if (pageBgImageInput) {
        pageBgImageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) applyBackgroundImage(document.body, file, pageBgImageInput);
        });
    }
    if (formBgImageInput && loginFormContainer) {
        formBgImageInput.addEventListener('change', (event) => {
            const file = event.target.files[0];
            if (file) applyBackgroundImage(loginFormContainer, file, formBgImageInput);
        });
    }

    // --- ICON IMPLEMENTATION ---
    const iconPalette = document.getElementById('icon-palette');
    const icons = [
        { name: 'circle', svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="currentColor"/></svg>' },
        { name: 'square', svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" fill="currentColor"/></svg>' },
        { name: 'star', svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 61,35 95,35 67,57 78,87 50,70 22,87 33,57 5,35 39,35" fill="currentColor"/></svg>'},
        { name: 'heart', svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,87 C-20,40 20,-10 50,25 C80,-10 120,40 50,87 Z" fill="crimson"/></svg>'}
    ];

    if (iconPalette) {
        icons.forEach(iconData => {
            const iconDiv = document.createElement('div');
            iconDiv.className = 'icon-item'; // Use class from style.css
            iconDiv.innerHTML = iconData.svg;
            iconDiv.title = `Add ${iconData.name}`;
            iconDiv.style.width = '30px'; // Define size for the SVG container
            iconDiv.style.height = '30px';
            iconDiv.style.color = '#333'; // Default color for icons using currentColor

            iconDiv.addEventListener('click', (event) => {
                const newIconOnPage = document.createElement('div');
                newIconOnPage.innerHTML = iconData.svg;
                newIconOnPage.className = 'page-icon';
                newIconOnPage.style.position = 'absolute';

                const existingIcons = document.querySelectorAll('.page-icon').length;
                newIconOnPage.style.left = `${100 + existingIcons * 40}px`;
                newIconOnPage.style.top = `${100}px`;
                newIconOnPage.style.width = '50px';
                newIconOnPage.style.height = '50px';
                newIconOnPage.style.zIndex = '1000';
                newIconOnPage.style.cursor = 'move';

                if (iconData.name === 'heart') {
                    newIconOnPage.style.color = 'crimson';
                } else {
                    newIconOnPage.style.color = '#5555dd';
                }

                document.body.appendChild(newIconOnPage);
                console.log(`Added ${iconData.name} icon to page.`);
            });
            iconPalette.appendChild(iconDiv);
        });
    } else {
        console.error("Icon palette element not found!");
    }

    // --- END OF ICON IMPLEMENTATION ---

    function createFormElement(type) {
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

    function makeElementResizable(elementWrapper) {
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

    if (pageBgColorInput) document.body.style.backgroundColor = pageBgColorInput.value;
    if (formBgColorInput && loginFormContainer) loginFormContainer.style.backgroundColor = formBgColorInput.value;

});
