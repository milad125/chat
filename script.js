document.addEventListener('DOMContentLoaded', () => {
    console.log('Login Form Editor script loaded. Reviewing Label/Text-Block element...');

    const EDITOR_STORAGE_KEY = 'loginFormEditorState_v1';

    // --- Selectors ---
    const draggableElements = document.querySelectorAll('.draggable-element');
    const loginFormContainer = document.getElementById('login-form-container');
    const canvas = document.getElementById('canvas');
    const selectedElementEditor = document.getElementById('selected-element-editor');

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
    const iconPalette = document.getElementById('icon-palette');

    let currentlySelectedElementWrapper = null;

    // --- Utility Functions ---
    function generateUniqueId(prefix = 'el') { return prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 10000); }
    function rgbToHex(rgbString) { if (!rgbString || typeof rgbString !== 'string') return '#ffffff'; if (rgbString.startsWith('#')) return rgbString; const match = rgbString.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)$/); if (match) { const r = parseInt(match[1]); const g = parseInt(match[2]); const b = parseInt(match[3]); return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toLowerCase(); } if (rgbString === 'transparent' || rgbString === 'rgba(0, 0, 0, 0)') return '#00000000'; return '#000000'; }
    function updateGradientInputControls(c1, c2, angleInput, settings) { if(c1 && settings && settings.color1) c1.value = settings.color1; else if(c1) c1.value = '#ffffff'; if(c2 && settings && settings.color2) c2.value = settings.color2; else if(c2) c2.value = '#000000'; if(angleInput && settings && settings.angle) angleInput.value = settings.angle; else if(angleInput) angleInput.value = '90';}
    function capitalizeFirstLetter(string) { return string.charAt(0).toUpperCase() + string.slice(1); }
    function parseBoxShadow(boxShadowString) { if (!boxShadowString || boxShadowString === 'none' || boxShadowString.trim() === '') { return { offsetX: '0px', offsetY: '0px', blurRadius: '0px', spreadRadius: '0px', color: 'rgba(0,0,0,0)', inset: false }; } let inset = false; if (boxShadowString.includes('inset')) { inset = true; boxShadowString = boxShadowString.replace('inset', '').trim(); } const colorRegex = /(rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}|\b[a-zA-Z]+\b(?!px))/; const lengthRegex = /-?\d+(\.\d+)?px/g; let colorMatch = boxShadowString.match(colorRegex); let color = colorMatch ? colorMatch[0] : 'rgba(0,0,0,0)'; let lengthsString = colorMatch ? boxShadowString.replace(color, '').trim() : boxShadowString; const lengths = lengthsString.match(lengthRegex) || []; return { offsetX: lengths[0] || '0px', offsetY: lengths[1] || '0px', blurRadius: lengths[2] || '0px', spreadRadius: lengths[3] || '0px', color: color, inset: inset }; }

    // --- Custom CSS Application ---
    function applyCustomCss(wrapper, cssString) { if (!wrapper) return; let customStyleId = wrapper.dataset.customStyleId; if (!customStyleId) { customStyleId = generateUniqueId('customstyle'); wrapper.dataset.customStyleId = customStyleId; } const styleTagId = `style-for-${customStyleId}`; let styleTag = document.getElementById(styleTagId); if (!cssString || !cssString.trim()) { if (styleTag) { styleTag.remove(); } wrapper.dataset.rawCustomCss = ''; saveStateToLocalStorage(); return; } if (!styleTag) { styleTag = document.createElement('style'); styleTag.id = styleTagId; styleTag.type = 'text/css'; document.head.appendChild(styleTag); } styleTag.innerHTML = `[data-custom-style-id="${customStyleId}"] { ${cssString} }`; wrapper.dataset.rawCustomCss = cssString; saveStateToLocalStorage(); }

    // --- Element Selection & Editor Population ---
    function deselectCurrentElement() { if (currentlySelectedElementWrapper) { currentlySelectedElementWrapper.classList.remove('selected-element-wrapper'); } currentlySelectedElementWrapper = null; if (selectedElementEditor) { selectedElementEditor.innerHTML = '<p class="no-element-selected">الماني انتخاب نشده است.</p>'; } }
    function selectElementWrapper(wrapper) {  if (!wrapper || wrapper === currentlySelectedElementWrapper) return; deselectCurrentElement(); currentlySelectedElementWrapper = wrapper; wrapper.classList.add('selected-element-wrapper'); populateElementEditor(wrapper); }
    if (loginFormContainer) { loginFormContainer.addEventListener('click', (event) => { const clickedWrapper = event.target.closest('.form-element-wrapper'); if (clickedWrapper && loginFormContainer.contains(clickedWrapper)) { event.stopPropagation(); selectElementWrapper(clickedWrapper); } else if (event.target === loginFormContainer) { deselectCurrentElement(); } }); }
    if (canvas) { canvas.addEventListener('click', (event) => { if (event.target === canvas) { deselectCurrentElement(); } }); }

    function createColorControl(labelText, initialValue, onChangeCallback) { const controlDiv = document.createElement('div'); controlDiv.className = 'element-editor-control'; const label = document.createElement('label'); label.textContent = labelText; const colorInput = document.createElement('input'); colorInput.type = 'color'; colorInput.value = rgbToHex(initialValue); colorInput.addEventListener('input', (event) => { onChangeCallback(event.target.value); }); controlDiv.appendChild(label); controlDiv.appendChild(colorInput); selectedElementEditor.appendChild(controlDiv); }
    function createDimensionControl(labelText, initialValue, unit, onChangeCallback, inputType = 'number') { const controlDiv = document.createElement('div'); controlDiv.className = 'element-editor-control dimension-control'; const label = document.createElement('label'); label.textContent = labelText; const input = document.createElement('input'); input.type = inputType; input.value = parseFloat(initialValue) || 0; if (inputType === 'number' && labelText.toLowerCase().includes('blur')) { /* no min for blur */ } else if (inputType === 'number' && !labelText.toLowerCase().includes('offset')) input.min = "0"; input.addEventListener('input', (event) => { onChangeCallback(event.target.value + unit); }); controlDiv.appendChild(label); controlDiv.appendChild(input); selectedElementEditor.appendChild(controlDiv); }
    function createSideControls(groupLabelText, unit, initialValues, onChangeCallback) { const fieldset = document.createElement('fieldset'); fieldset.className = 'element-editor-group'; const legend = document.createElement('legend'); legend.textContent = groupLabelText; fieldset.appendChild(legend); const sides = ['top', 'right', 'bottom', 'left']; const sideLabelsPersian = { top: 'بالا', right: 'راست', bottom: 'پایین', left: 'چپ' }; sides.forEach(side => { const controlDiv = document.createElement('div'); controlDiv.className = 'element-editor-control side-control'; const label = document.createElement('label'); label.textContent = `${sideLabelsPersian[side]}:`; const input = document.createElement('input'); input.type = 'number'; input.value = parseFloat(initialValues[side]) || 0; input.min = "0"; input.addEventListener('input', (event) => { onChangeCallback(side, event.target.value + unit); }); controlDiv.appendChild(label); controlDiv.appendChild(input); fieldset.appendChild(controlDiv); }); selectedElementEditor.appendChild(fieldset); }
    function createShadowDimensionInput(labelText, initialValue, unit, parentElement) { const controlDiv = document.createElement('div'); controlDiv.className = 'element-editor-control shadow-dimension-control'; const label = document.createElement('label'); label.textContent = labelText; const input = document.createElement('input'); input.type = 'number'; input.value = parseFloat(initialValue) || 0; if (labelText.toLowerCase().includes('blur')) input.min = '0'; controlDiv.appendChild(label); controlDiv.appendChild(input); parentElement.appendChild(controlDiv); return input; }
    function createShadowColorInput(labelText, initialValue, parentElement) { const controlDiv = document.createElement('div'); controlDiv.className = 'element-editor-control shadow-color-control'; const label = document.createElement('label'); label.textContent = labelText; const input = document.createElement('input'); input.type = 'color'; input.value = rgbToHex(initialValue); controlDiv.appendChild(label); controlDiv.appendChild(input); parentElement.appendChild(controlDiv); return input; }
    function createColorControlInParent(parentElement, labelText, initialValue, onChangeCallback) { const controlDiv = document.createElement('div'); controlDiv.className = 'element-editor-control'; const label = document.createElement('label'); label.textContent = labelText; const colorInput = document.createElement('input'); colorInput.type = 'color'; colorInput.value = rgbToHex(initialValue || '#ffffff'); colorInput.addEventListener('input', (event) => { onChangeCallback(event.target.value); }); controlDiv.appendChild(label); controlDiv.appendChild(colorInput); parentElement.appendChild(controlDiv); }

    function populateElementEditor(wrapper) { if (!selectedElementEditor || !wrapper) return; const formElement = wrapper.querySelector('.form-element'); if (!formElement) return; selectedElementEditor.innerHTML = ''; const computedElementStyle = getComputedStyle(formElement); const computedWrapperStyle = getComputedStyle(wrapper); createColorControl('رنگ متن:', formElement.style.color || computedElementStyle.color, (newColor) => { formElement.style.color = newColor; saveStateToLocalStorage(); }); createColorControl('رنگ پس‌زمینه:', formElement.style.backgroundColor || computedElementStyle.backgroundColor, (newColor) => { formElement.style.backgroundColor = newColor; saveStateToLocalStorage(); }); createColorControl('رنگ حاشیه:', formElement.style.borderColor || computedElementStyle.borderColor, (newColor) => { formElement.style.borderColor = newColor; const currentBorderWidthNum = parseFloat(computedElementStyle.borderTopWidth); if (isNaN(currentBorderWidthNum) || currentBorderWidthNum === 0) { formElement.style.borderWidth = '1px'; } if (!formElement.style.borderStyle || formElement.style.borderStyle === 'none') { formElement.style.borderStyle = 'solid'; } saveStateToLocalStorage(); }); selectedElementEditor.appendChild(document.createElement('hr')); createDimensionControl('اندازه فونت (px):', formElement.style.fontSize || computedElementStyle.fontSize, 'px', (newVal) => { formElement.style.fontSize = newVal; saveStateToLocalStorage(); }); selectedElementEditor.appendChild(document.createElement('hr')); createSideControls('فاصله داخلی (Padding):', 'px', { top: formElement.style.paddingTop || computedElementStyle.paddingTop, right: formElement.style.paddingRight || computedElementStyle.paddingRight, bottom: formElement.style.paddingBottom || computedElementStyle.paddingBottom, left: formElement.style.paddingLeft || computedElementStyle.paddingLeft }, (side, newVal) => { formElement.style[`padding${capitalizeFirstLetter(side)}`] = newVal; saveStateToLocalStorage(); }); selectedElementEditor.appendChild(document.createElement('hr')); createSideControls('فاصله خارجی (Margin):', 'px', { top: wrapper.style.marginTop || computedWrapperStyle.marginTop, right: wrapper.style.marginRight || computedWrapperStyle.marginRight, bottom: wrapper.style.marginBottom || computedWrapperStyle.marginBottom, left: wrapper.style.marginLeft || computedWrapperStyle.marginLeft }, (side, newVal) => { wrapper.style[`margin${capitalizeFirstLetter(side)}`] = newVal; saveStateToLocalStorage(); }); selectedElementEditor.appendChild(document.createElement('hr')); const shadowFieldset = document.createElement('fieldset'); shadowFieldset.className = 'element-editor-group'; const shadowLegend = document.createElement('legend'); shadowLegend.textContent = 'سایه (Box Shadow):'; shadowFieldset.appendChild(shadowLegend); let currentShadow = parseBoxShadow(formElement.style.boxShadow); const shadowControls = { offsetX: createShadowDimensionInput('OffsetX (px):', currentShadow.offsetX, 'px', shadowFieldset), offsetY: createShadowDimensionInput('OffsetY (px):', currentShadow.offsetY, 'px', shadowFieldset), blurRadius: createShadowDimensionInput('Blur (px):', currentShadow.blurRadius, 'px', shadowFieldset), color: createShadowColorInput('رنگ سایه:', currentShadow.color, shadowFieldset) }; function applyBoxShadow() { const newBoxShadow = `${shadowControls.offsetX.value}px ${shadowControls.offsetY.value}px ${shadowControls.blurRadius.value}px ${shadowControls.color.value}`; formElement.style.boxShadow = newBoxShadow; saveStateToLocalStorage(); } Object.values(shadowControls).forEach(input => { input.addEventListener('input', applyBoxShadow); if (input.type === 'color') { input.addEventListener('change', applyBoxShadow); } }); selectedElementEditor.appendChild(shadowFieldset); selectedElementEditor.appendChild(document.createElement('hr')); const hoverFieldset = document.createElement('fieldset'); hoverFieldset.className = 'element-editor-group hover-effect-controls'; const hoverLegend = document.createElement('legend'); hoverLegend.textContent = 'افکت هاور (Hover):'; hoverFieldset.appendChild(hoverLegend); const initialHoverBgColor = formElement.style.getPropertyValue('--hover-background-color').trim(); const initialHoverTextColor = formElement.style.getPropertyValue('--hover-text-color').trim(); createColorControlInParent(hoverFieldset, 'رنگ پس‌زمینه هاور:', initialHoverBgColor || computedElementStyle.backgroundColor, (newColor) => { formElement.style.setProperty('--hover-background-color', newColor); saveStateToLocalStorage(); }); createColorControlInParent(hoverFieldset, 'رنگ متن هاور:', initialHoverTextColor || computedElementStyle.color, (newColor) => { formElement.style.setProperty('--hover-text-color', newColor); saveStateToLocalStorage(); }); selectedElementEditor.appendChild(hoverFieldset); selectedElementEditor.appendChild(document.createElement('hr')); const customCssFieldset = document.createElement('fieldset'); customCssFieldset.className = 'element-editor-group custom-css-controls'; const customCssLegend = document.createElement('legend'); customCssLegend.textContent = 'CSS سفارشی:'; customCssFieldset.appendChild(customCssLegend); const customCssTextarea = document.createElement('textarea'); customCssTextarea.className = 'custom-css-textarea'; customCssTextarea.placeholder = 'مثال:\nbackground-color: lightblue;\nfont-style: italic;'; customCssTextarea.value = wrapper.dataset.rawCustomCss || ''; customCssTextarea.addEventListener('input', () => { applyCustomCss(wrapper, customCssTextarea.value); }); customCssFieldset.appendChild(customCssTextarea); selectedElementEditor.appendChild(customCssFieldset); selectedElementEditor.appendChild(document.createElement('hr')); const deselectButton = document.createElement('button'); deselectButton.textContent = 'لغو انتخاب'; deselectButton.className = 'setting-button clear-button'; deselectButton.style.marginTop = '20px'; deselectButton.onclick = deselectCurrentElement; selectedElementEditor.appendChild(deselectButton); }
    if (selectedElementEditor) { selectedElementEditor.innerHTML = '<p class="no-element-selected">الماني انتخاب نشده است.</p>'; }

    // --- Element Creation (Modified for 'label' -> 'text-block') ---
    function createFormElement(type, initialData = null) {
        const elementWrapper = document.createElement('div');
        elementWrapper.className = 'form-element-wrapper';
        let customStyleIdToUse = (initialData && initialData.styles && initialData.styles.customStyleId) ? initialData.styles.customStyleId : generateUniqueId('csid');
        elementWrapper.dataset.customStyleId = customStyleIdToUse;

        const effectiveType = (initialData && initialData.type) ? initialData.type : type;
        // If loading an old 'label', treat it as 'text-block' for creation, but save as 'text-block'
        elementWrapper.dataset.elementType = (effectiveType === 'label') ? 'text-block' : effectiveType;


        elementWrapper.dataset.rawCustomCss = (initialData && initialData.styles && initialData.styles.rawCustomCss) ? initialData.styles.rawCustomCss : '';

        let formElement;
        switch (effectiveType) {
            case 'text-input': formElement = document.createElement('input'); formElement.type = 'text'; formElement.placeholder = (initialData && initialData.placeholder) ? initialData.placeholder : 'ورودی متن'; if(initialData && initialData.value) formElement.value = initialData.value; break;
            case 'password-input': formElement = document.createElement('input'); formElement.type = 'password'; formElement.placeholder = (initialData && initialData.placeholder) ? initialData.placeholder : 'ورودی رمز عبور'; if(initialData && initialData.value) formElement.value = initialData.value; break;
            case 'button': formElement = document.createElement('button'); formElement.type = 'button'; formElement.textContent = (initialData && initialData.text) ? initialData.text : 'دکمه'; break;
            case 'label': // Handles loading of old 'label' types
            case 'text-block': // New 'text-block' type
                formElement = document.createElement('div');
                formElement.textContent = (initialData && initialData.text) ? initialData.text : 'متن نمونه';
                formElement.contentEditable = 'true';
                formElement.classList.add('text-block-element'); // Specific class if needed for styling the div
                formElement.addEventListener('blur', () => saveStateToLocalStorage());
                break;
            case 'checkbox':
                formElement = document.createElement('div');
                formElement.className = 'checkbox-control';
                const checkboxId = generateUniqueId('chk');
                const chkInput = document.createElement('input'); chkInput.type = 'checkbox'; chkInput.id = checkboxId;
                if (initialData && typeof initialData.checked === 'boolean') { chkInput.checked = initialData.checked; }
                chkInput.addEventListener('change', () => saveStateToLocalStorage());
                const chkLabel = document.createElement('label'); chkLabel.htmlFor = checkboxId; chkLabel.contentEditable = 'true'; chkLabel.textContent = (initialData && initialData.labelText) ? initialData.labelText : 'چک‌باکس جدید';
                chkLabel.addEventListener('blur', () => saveStateToLocalStorage());
                formElement.appendChild(chkInput); formElement.appendChild(chkLabel);
                break;
            case 'radio':
                formElement = document.createElement('div');
                formElement.className = 'radio-control';
                const radioId = generateUniqueId('rad');
                const radioInput = document.createElement('input'); radioInput.type = 'radio'; radioInput.id = radioId;
                radioInput.name = (initialData && initialData.radioGroupName) ? initialData.radioGroupName : `default-radio-group-${loginFormContainer.id}`;
                let initialRadioValue = 'گزینه ۱';
                if (initialData && initialData.labelText) initialRadioValue = initialData.labelText; // Default value to label text
                if (initialData && initialData.value) initialRadioValue = initialData.value; // Override with specific value if present
                radioInput.value = initialRadioValue;
                if (initialData && typeof initialData.checked === 'boolean') { radioInput.checked = initialData.checked; }
                radioInput.addEventListener('change', () => saveStateToLocalStorage());
                const radioLabel = document.createElement('label'); radioLabel.htmlFor = radioId; radioLabel.contentEditable = 'true';
                radioLabel.textContent = (initialData && initialData.labelText) ? initialData.labelText : 'گزینه ۱';
                radioLabel.addEventListener('blur', () => { radioInput.value = radioLabel.textContent; saveStateToLocalStorage(); });
                formElement.appendChild(radioInput); formElement.appendChild(radioLabel);
                break;
            default: console.warn('Unknown element type in createFormElement:', effectiveType); return null;
        }

        formElement.classList.add('form-element'); // Add .form-element to the primary created element/container

        if (formElement) {
            if (effectiveType !== 'checkbox' && effectiveType !== 'radio' && effectiveType !== 'text-block' && effectiveType !== 'label') {
                formElement.style.display = 'block';
                formElement.style.width = '100%';
            } else if (effectiveType === 'text-block' || effectiveType === 'label') { // Ensure div text-blocks are stylable as blocks
                 formElement.style.display = 'block'; // Or inline-block depending on desired default
            }
            formElement.style.boxSizing = 'border-box';
            if (elementWrapper.dataset.elementType === 'button' && formElement.tagName === 'BUTTON') formElement.style.cursor = 'pointer';

            if (initialData && initialData.styles) {
                const styles = initialData.styles;
                let stylablePart = formElement;
                if (effectiveType === 'checkbox' || effectiveType === 'radio') {
                    stylablePart = formElement.querySelector('label');
                }

                if(stylablePart) {
                    stylablePart.style.color = styles.color || '';
                    if (effectiveType !== 'checkbox' && effectiveType !== 'radio') { // For checkbox/radio, BG is on formElement div
                       if (stylablePart.style && stylablePart.style.hasOwnProperty('backgroundColor')) stylablePart.style.backgroundColor = styles.backgroundColor || '';
                    }
                    stylablePart.style.borderColor = styles.borderColor || '';
                    stylablePart.style.borderWidth = styles.borderWidth || '';
                    stylablePart.style.borderStyle = styles.borderStyle || '';
                    stylablePart.style.fontSize = styles.fontSize || '';
                }
                // These styles apply to formElement (the main div for checkbox/radio, or the element itself for others)
                formElement.style.backgroundColor = (effectiveType === 'checkbox' || effectiveType === 'radio') ? styles.backgroundColor || '' : (stylablePart && stylablePart !== formElement ? stylablePart.style.backgroundColor : styles.backgroundColor || '');
                formElement.style.paddingTop = styles.paddingTop || ''; formElement.style.paddingRight = styles.paddingRight || ''; formElement.style.paddingBottom = styles.paddingBottom || ''; formElement.style.paddingLeft = styles.paddingLeft || '';
                formElement.style.boxShadow = styles.boxShadow || '';
                if (styles.hover) { formElement.style.setProperty('--hover-background-color', styles.hover.backgroundColor || 'transparent'); formElement.style.setProperty('--hover-text-color', styles.hover.textColor || 'inherit'); }
            }
            if (initialData && initialData.styles) { elementWrapper.style.marginTop = initialData.styles.marginTop || ''; elementWrapper.style.marginRight = initialData.styles.marginRight || ''; elementWrapper.style.marginBottom = initialData.styles.marginBottom || ''; elementWrapper.style.marginLeft = initialData.styles.marginLeft || ''; }
            elementWrapper.appendChild(formElement);
        }
        return elementWrapper;
    }

    // --- Drag and Drop ---
    draggableElements.forEach(elem => { elem.addEventListener('dragstart', (event) => { event.dataTransfer.setData('text/plain', event.target.dataset.type); event.target.style.opacity = '0.7'; }); elem.addEventListener('dragend', (event) => { event.target.style.opacity = '1'; }); });
    if (loginFormContainer) { loginFormContainer.addEventListener('dragover', (event) => { event.preventDefault(); loginFormContainer.style.border = '2px dashed #007bff'; }); loginFormContainer.addEventListener('dragleave', () => { loginFormContainer.style.border = 'none'; }); loginFormContainer.addEventListener('drop', (event) => { event.preventDefault(); loginFormContainer.style.border = 'none'; const elementType = event.dataTransfer.getData('text/plain'); const placeholder = loginFormContainer.querySelector('p:only-child'); if (placeholder && placeholder.textContent.includes("بکشید")) { loginFormContainer.innerHTML = ''; loginFormContainer.style.display = 'block'; loginFormContainer.style.textAlign = document.dir === 'rtl' ? 'right' : 'left'; formContainerInitialized = true; } const newElementWrapper = createFormElement(elementType); if (newElementWrapper) { loginFormContainer.appendChild(newElementWrapper); makeElementResizable(newElementWrapper); selectElementWrapper(newElementWrapper); saveStateToLocalStorage(); } }); }
    // --- Other functions (makeElementResizable, applyBackgroundImage, icon logic) ---
    function makeElementResizable(elementWrapper) { const resizeHandle = document.createElement('div'); resizeHandle.className = 'resize-handle bottom-right'; resizeHandle.style.position = 'absolute'; resizeHandle.style.width = '14px'; resizeHandle.style.height = '14px'; resizeHandle.style.backgroundColor = '#007bff'; resizeHandle.style.border = '2px solid #fff'; resizeHandle.style.borderRadius = '50%'; resizeHandle.style.bottom = '-7px'; resizeHandle.style.right = '-7px'; resizeHandle.style.cursor = 'nwse-resize'; resizeHandle.style.zIndex = '10'; elementWrapper.appendChild(resizeHandle); let originalWidth, originalHeight, originalMouseX, originalMouseY; resizeHandle.addEventListener('mousedown', (e) => { e.preventDefault(); e.stopPropagation(); originalWidth = parseFloat(getComputedStyle(elementWrapper, null).getPropertyValue('width').replace('px', '')); const currentHeight = getComputedStyle(elementWrapper, null).getPropertyValue('height').replace('px', ''); if (currentHeight === 'auto' || elementWrapper.style.height === 'auto' || !elementWrapper.style.height) { originalHeight = elementWrapper.offsetHeight; elementWrapper.style.height = originalHeight + 'px'; } else { originalHeight = parseFloat(currentHeight); } originalMouseX = e.pageX; originalMouseY = e.pageY; document.addEventListener('mousemove', resizeElement); document.addEventListener('mouseup', stopResize); }); function resizeElement(e) { const width = originalWidth + (e.pageX - originalMouseX); const height = originalHeight + (e.pageY - originalMouseY); if (width > 50) elementWrapper.style.width = width + 'px'; if (height > 30) elementWrapper.style.height = height + 'px'; } function stopResize() { document.removeEventListener('mousemove', resizeElement); document.removeEventListener('mouseup', stopResize); saveStateToLocalStorage(); } }
    function applyBackgroundImage(targetElement, file, fileInputToReset) { if (file && file.type.startsWith('image/')) { const reader = new FileReader(); reader.onload = (e) => { targetElement.style.backgroundColor = ''; targetElement.style.backgroundImage = `url('${e.target.result}')`; saveStateToLocalStorage(); } reader.readAsDataURL(file); } else if (file) { alert("Please select a valid image file."); if (fileInputToReset) fileInputToReset.value = ""; } }
    if (pageBgColorInput) pageBgColorInput.addEventListener('input', () => { document.body.style.backgroundImage = 'none'; document.body.style.backgroundColor = pageBgColorInput.value; saveStateToLocalStorage(); }); if (formBgColorInput && loginFormContainer) formBgColorInput.addEventListener('input', () => { loginFormContainer.style.backgroundImage = 'none'; loginFormContainer.style.backgroundColor = formBgColorInput.value; saveStateToLocalStorage(); }); if (applyPageGradientButton && pageGradientColor1Input && pageGradientColor2Input && pageGradientAngleInput) applyPageGradientButton.addEventListener('click', () => { document.body.style.backgroundColor = ''; document.body.style.backgroundImage = `linear-gradient(${pageGradientAngleInput.value}deg, ${pageGradientColor1Input.value}, ${pageGradientColor2Input.value})`; saveStateToLocalStorage(); }); if (applyFormGradientButton && loginFormContainer && formGradientColor1Input && formGradientColor2Input && formGradientAngleInput) applyFormGradientButton.addEventListener('click', () => { loginFormContainer.style.backgroundColor = ''; loginFormContainer.style.backgroundImage = `linear-gradient(${formGradientAngleInput.value}deg, ${formGradientColor1Input.value}, ${formGradientColor2Input.value})`; saveStateToLocalStorage(); }); if (clearPageBgButton && pageBgColorInput) clearPageBgButton.addEventListener('click', () => { document.body.style.backgroundImage = 'none'; document.body.style.backgroundColor = pageBgColorInput.value; if(pageBgImageInput) pageBgImageInput.value = ""; saveStateToLocalStorage(); }); if (clearFormBgButton && loginFormContainer && formBgColorInput) clearFormBgButton.addEventListener('click', () => { loginFormContainer.style.backgroundImage = 'none'; loginFormContainer.style.backgroundColor = formBgColorInput.value; if(formBgImageInput) formBgImageInput.value = ""; saveStateToLocalStorage(); }); if (pageBgImageInput) pageBgImageInput.addEventListener('change', (event) => { const file = event.target.files[0]; if (file) applyBackgroundImage(document.body, file, pageBgImageInput); }); if (formBgImageInput && loginFormContainer) formBgImageInput.addEventListener('change', (event) => { const file = event.target.files[0]; if (file) applyBackgroundImage(loginFormContainer, file, formBgImageInput); });
    const icons = [ { name: 'circle', svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="40" fill="currentColor"/></svg>' }, { name: 'square', svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="10" width="80" height="80" fill="currentColor"/></svg>' }, { name: 'star', svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><polygon points="50,5 61,35 95,35 67,57 78,87 50,70 22,87 33,57 5,35 39,35" fill="currentColor"/></svg>'}, { name: 'heart', svg: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M50,87 C-20,40 20,-10 50,25 C80,-10 120,40 50,87 Z" fill="crimson"/></svg>'} ]; if (iconPalette) { icons.forEach(iconData => { const iconDiv = document.createElement('div'); iconDiv.className = 'icon-item'; iconDiv.innerHTML = iconData.svg; iconDiv.title = `Add ${iconData.name}`; iconDiv.addEventListener('click', () => { const newIconOnPage = document.createElement('div'); newIconOnPage.innerHTML = iconData.svg; newIconOnPage.className = 'page-icon'; newIconOnPage.style.position = 'absolute'; const existingIconsCount = document.querySelectorAll('.page-icon').length; newIconOnPage.style.left = `${100 + existingIconsCount * 40}px`; newIconOnPage.style.top = `${100}px`; newIconOnPage.style.width = '50px'; newIconOnPage.style.height = '50px'; newIconOnPage.style.zIndex = '1000'; newIconOnPage.style.cursor = 'move'; newIconOnPage.style.color = (iconData.name === 'heart') ? 'crimson' : '#5555dd'; document.body.appendChild(newIconOnPage); saveStateToLocalStorage(); }); iconPalette.appendChild(iconDiv); }); }

    // --- LOCALSTORAGE SAVE/LOAD (Modified getElementData, loadStateFromLocalStorage for text-block) ---
    function getElementData(elementWrapper) {
        const formElement = elementWrapper.querySelector('.form-element');
        if (!formElement) return null;
        const elementType = elementWrapper.dataset.elementType;
        if (!elementType) { console.warn("Element wrapper missing dataset.elementType", elementWrapper); return null; }

        let stylablePart = formElement;
        if (elementType === 'checkbox' || elementType === 'radio') {
            stylablePart = formElement.querySelector('label');
        }
        // For text-block (div), stylablePart is formElement itself.

        let data = {
            type: elementType, // Will be 'text-block' for new/updated labels
            width: elementWrapper.style.width || getComputedStyle(elementWrapper).width,
            height: elementWrapper.style.height || getComputedStyle(elementWrapper).height,
            styles: {
                color: stylablePart ? stylablePart.style.color : '',
                backgroundColor: (elementType === 'checkbox' || elementType === 'radio') ? formElement.style.backgroundColor : (stylablePart ? stylablePart.style.backgroundColor : ''),
                borderColor: stylablePart ? stylablePart.style.borderColor : '', borderWidth: stylablePart ? stylablePart.style.borderWidth : '', borderStyle: stylablePart ? stylablePart.style.borderStyle : '',
                fontSize: stylablePart ? stylablePart.style.fontSize : '',
                paddingTop: formElement.style.paddingTop, paddingRight: formElement.style.paddingRight, paddingBottom: formElement.style.paddingBottom, paddingLeft: formElement.style.paddingLeft,
                boxShadow: formElement.style.boxShadow,
                hover: { backgroundColor: formElement.style.getPropertyValue('--hover-background-color').trim(), textColor: formElement.style.getPropertyValue('--hover-text-color').trim() },
                customCSS: elementWrapper.dataset.rawCustomCss || '', customStyleId: elementWrapper.dataset.customStyleId || ''
            },
            marginTop: elementWrapper.style.marginTop, marginRight: elementWrapper.style.marginRight, marginBottom: elementWrapper.style.marginBottom, marginLeft: elementWrapper.style.marginLeft,
        };

        if (elementType === 'text-input' || elementType === 'password-input') { data.placeholder = formElement.placeholder; data.value = formElement.value; }
        else if (elementType === 'button') { data.text = formElement.textContent; }
        else if (elementType === 'text-block' || elementType === 'label') { // Handle old 'label' type for loading
            data.text = formElement.textContent;
        }
        else if (elementType === 'checkbox') { const chkInput = formElement.querySelector('input[type="checkbox"]'); const chkLabel = formElement.querySelector('label'); if (chkInput && chkLabel) { data.checked = chkInput.checked; data.labelText = chkLabel.textContent; } }
        else if (elementType === 'radio') { const radioInput = formElement.querySelector('input[type="radio"]'); const radioLabel = formElement.querySelector('label'); if (radioInput && radioLabel) { data.checked = radioInput.checked; data.labelText = radioLabel.textContent; data.value = radioInput.value; data.radioGroupName = radioInput.name; } }
        return data;
    }

    function getPageIconData(iconElement) { const svgElement = iconElement.querySelector('svg'); if (!svgElement) return null; return { svgString: iconElement.innerHTML, top: iconElement.style.top, left: iconElement.style.left, width: iconElement.style.width, height: iconElement.style.height, color: iconElement.style.color, }; }
    function saveStateToLocalStorage() { if (!loginFormContainer) { console.error("Cannot save state: loginFormContainer not found."); return; } const formElements = []; loginFormContainer.querySelectorAll('.form-element-wrapper').forEach(wrapper => { const data = getElementData(wrapper); if (data) formElements.push(data); }); const pageIcons = []; document.querySelectorAll('.page-icon').forEach(iconElem => { const iconData = getPageIconData(iconElem); if (iconData) pageIcons.push(iconData); }); const state = { formElements: formElements, pageBackground: { color: document.body.style.backgroundColor, image: document.body.style.backgroundImage, }, formBackground: { color: loginFormContainer.style.backgroundColor, image: loginFormContainer.style.backgroundImage, }, pageIcons: pageIcons, gradientSettings: { page: { color1: pageGradientColor1Input ? pageGradientColor1Input.value : '', color2: pageGradientColor2Input ? pageGradientColor2Input.value : '', angle: pageGradientAngleInput ? pageGradientAngleInput.value : '90' }, form: { color1: formGradientColor1Input ? formGradientColor1Input.value : '', color2: formGradientColor2Input ? formGradientColor2Input.value : '', angle: formGradientAngleInput ? pageGradientAngleInput.value : '90' } }, }; try { localStorage.setItem(EDITOR_STORAGE_KEY, JSON.stringify(state)); console.log('State saved. Items:', formElements.length, 'Icons:', pageIcons.length); } catch (error) { console.error('Error saving state:', error); } }
    window.saveStateToLocalStorage = saveStateToLocalStorage;

    function loadStateFromLocalStorage() { const savedStateJSON = localStorage.getItem(EDITOR_STORAGE_KEY); if (!savedStateJSON) { console.log('No saved state found.'); updateGradientInputControls(pageGradientColor1Input, pageGradientColor2Input, pageGradientAngleInput, { color1: '#accbee', color2: '#e7f0fd', angle: '90' }); updateGradientInputControls(formGradientColor1Input, formGradientColor2Input, formGradientAngleInput, { color1: '#f8f9fa', color2: '#e9ecef', angle: '90' }); if(pageBgColorInput) document.body.style.backgroundColor = pageBgColorInput.value; if(formBgColorInput && loginFormContainer) loginFormContainer.style.backgroundColor = formBgColorInput.value; return; } console.log('Found saved state. Attempting to load...'); try { const state = JSON.parse(savedStateJSON); if (state.pageBackground) { document.body.style.backgroundColor = state.pageBackground.color || ''; document.body.style.backgroundImage = state.pageBackground.image || ''; if (pageBgColorInput && state.pageBackground.color) pageBgColorInput.value = rgbToHex(state.pageBackground.color); } if (state.formBackground && loginFormContainer) { loginFormContainer.style.backgroundColor = state.formBackground.color || ''; loginFormContainer.style.backgroundImage = state.formBackground.image || ''; if (formBgColorInput && state.formBackground.color) formBgColorInput.value = rgbToHex(state.formBackground.color); } if (state.gradientSettings) { if (state.gradientSettings.page) updateGradientInputControls(pageGradientColor1Input, pageGradientColor2Input, pageGradientAngleInput, state.gradientSettings.page); if (state.gradientSettings.form) updateGradientInputControls(formGradientColor1Input, formGradientColor2Input, formGradientAngleInput, state.gradientSettings.form); } else { updateGradientInputControls(pageGradientColor1Input, pageGradientColor2Input, pageGradientAngleInput, { color1: '#accbee', color2: '#e7f0fd', angle: '90' }); updateGradientInputControls(formGradientColor1Input, formGradientColor2Input, formGradientAngleInput, { color1: '#f8f9fa', color2: '#e9ecef', angle: '90' });} if (loginFormContainer && state.formElements && Array.isArray(state.formElements)) { loginFormContainer.innerHTML = ''; let hasContent = false; state.formElements.forEach(elementData => { const newElementWrapper = createFormElement(elementData.type, elementData); if (newElementWrapper) { newElementWrapper.style.width = elementData.width; newElementWrapper.style.height = elementData.height; loginFormContainer.appendChild(newElementWrapper); makeElementResizable(newElementWrapper); if (elementData.styles && elementData.styles.customCSS && elementData.styles.customStyleId) { applyCustomCss(newElementWrapper, elementData.styles.customCSS); } hasContent = true; } }); formContainerInitialized = hasContent; if (hasContent) { loginFormContainer.style.display = 'block'; loginFormContainer.style.textAlign = 'left'; loginFormContainer.style.position = 'relative'; } else { loginFormContainer.innerHTML = '<p>برای ساخت فرم، المان‌ها را به اینجا بکشید</p>'; loginFormContainer.style.display = 'flex'; loginFormContainer.style.justifyContent = 'center'; loginFormContainer.style.alignItems = 'center'; loginFormContainer.style.textAlign = 'center';} } if (state.pageIcons && Array.isArray(state.pageIcons)) { document.querySelectorAll('.page-icon').forEach(pi => pi.remove()); state.pageIcons.forEach(iconData => { const newIconOnPage = document.createElement('div'); newIconOnPage.innerHTML = iconData.svgString; newIconOnPage.className = 'page-icon'; newIconOnPage.style.position = 'absolute'; newIconOnPage.style.left = iconData.left; newIconOnPage.style.top = iconData.top; newIconOnPage.style.width = iconData.width; newIconOnPage.style.height = iconData.height; newIconOnPage.style.color = iconData.color; newIconOnPage.style.zIndex = '1000'; newIconOnPage.style.cursor = 'move'; document.body.appendChild(newIconOnPage); }); } console.log('State loaded successfully.'); } catch (error) { console.error('Error loading state:', error); localStorage.removeItem(EDITOR_STORAGE_KEY); } }

    loadStateFromLocalStorage();
    if (!document.body.style.backgroundColor && !document.body.style.backgroundImage && pageBgColorInput) { document.body.style.backgroundColor = pageBgColorInput.value; }
    if (loginFormContainer && !loginFormContainer.style.backgroundColor && !loginFormContainer.style.backgroundImage && formBgColorInput) { loginFormContainer.style.backgroundColor = formBgColorInput.value; }
});
