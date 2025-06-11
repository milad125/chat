// Debounce utility function
function debounce(func, delay) {
    let timeoutId;
    const debounced = function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
    debounced.flush = function(...args) { // Added flush
        clearTimeout(timeoutId);
        func.apply(this, args);
    };
    return debounced;
}

document.addEventListener('DOMContentLoaded', () => {
    const elementsPanel = document.querySelector('.elements-panel');
    const formCanvas = document.getElementById('login-form-canvas');
    const settingsPanelContent = document.querySelector('.settings-panel');
    let selectedElementWrapper = null;
    let selectedIconElement = null;
    const pageBody = document.body;
    const editorContainer = document.querySelector('.editor-container');

    const elementIconsSVG = {
        'text-input': '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M2 5.5A1.5 1.5 0 013.5 4h13A1.5 1.5 0 0118 5.5v9A1.5 1.5 0 0116.5 16h-13A1.5 1.5 0 012 14.5v-9zM16.5 5H3.5a.5.5 0 00-.5.5v9a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-9a.5.5 0 00-.5-.5z"/><path d="M4 7h12v1H4V7zm0 3h8v1H4v-1z"/></svg>',
        'email-input': '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/></svg>',
        'password-input': '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v7a2 2 0 002 2h10a2 2 0 002-2v-7a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6zM5 11v7h10v-7H5z" clip-rule="evenodd"/></svg>',
        'submit-button': '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M3.5 2A1.5 1.5 0 002 3.5v13A1.5 1.5 0 003.5 18h13a1.5 1.5 0 001.5-1.5v-13A1.5 1.5 0 0016.5 2h-13zm13 1.5a.5.5 0 00-.5-.5h-13a.5.5 0 00-.5.5v13a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-13z"/><path d="M10 13.5a.5.5 0 01-.5-.5V8.707l-1.646 1.647a.5.5 0 01-.708-.708l2.5-2.5a.5.5 0 01.708 0l2.5 2.5a.5.5 0 01-.708.708L10.5 8.707V13a.5.5 0 01-.5.5z"/></svg>',
        'label': '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M17.707 3.293a1 1 0 00-1.414 0l-11 11A1 1 0 006 15H3a1 1 0 100 2h3a1 1 0 00.707-.293l11-11a1 1 0 000-1.414zM7.414 15L17 5.414 14.586 3 5 12.586V15h2.414z"/><path d="M4.5 2A2.5 2.5 0 002 4.5v1c0 .27.03.53.08.79L10.5 18h.01c.16 0 .3-.07.4-.2l1.6-2.4a1.24 1.24 0 00-.07-1.7L4.5 2zm0 1a1.5 1.5 0 011.5 1.5v.05L3.05 7.5H3V4.5A1.5 1.5 0 014.5 3z"/></svg>',
        'checkbox': '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V3zm1.5 1a.5.5 0 00-.5.5v11a.5.5 0 00.5.5h11a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5h-11z" clip-rule="evenodd"/><path fill-rule="evenodd" d="M13.78 6.22a.75.75 0 010 1.06l-5.5 5.5a.75.75 0 01-1.06 0l-2.5-2.5a.75.75 0 111.06-1.06L7.5 11.19l4.97-4.97a.75.75 0 011.06 0z" clip-rule="evenodd"/></svg>',
        'radio': '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fill-rule="evenodd" d="M10 3a7 7 0 100 14 7 7 0 000-14zm0 1.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11z" clip-rule="evenodd"/><path d="M10 6.5a3.5 3.5 0 100 7 3.5 3.5 0 000-7z"/></svg>',
        'textarea': '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M2 5.5A1.5 1.5 0 013.5 4h13A1.5 1.5 0 0118 5.5v9A1.5 1.5 0 0116.5 16h-13A1.5 1.5 0 012 14.5v-9zM16.5 5H3.5a.5.5 0 00-.5.5v9a.5.5 0 00.5.5h13a.5.5 0 00.5-.5v-9a.5.5 0 00-.5-.5z"/><path d="M4 7h12v1H4V7zm0 2h12v1H4V9zm0 2h8v1H4v-1zm0 2h10v1H4v-1z"/></svg>'
    };

    let currentBackgroundSettings = {
        page: { type: 'solid', color: '#f4f6f8', gradient: '', image: '' },
        form: { type: 'solid', color: '#fdfdfd', gradient: '', image: '' }
    };
    let currentAppliedTemplate = 'default';
    let uploadedIcons = [];

    const LS_KEY = 'loginFormEditorState_v1';

    const formElementsConfig = {
        'text-input': { name: 'Text Input', tag: 'input', type: 'text', placeholder: 'Enter text' },
        'email-input': { name: 'Email Input', tag: 'input', type: 'email', placeholder: 'Enter email' },
        'password-input': { name: 'Password Input', tag: 'input', type: 'password', placeholder: 'Enter password' },
        'submit-button': { name: 'Button', tag: 'button', type: 'submit', text: 'Submit' },
        'label': { name: 'Label', tag: 'label', text: 'Label Text' },
        'checkbox': { name: 'Checkbox', tag: 'input', type: 'checkbox', label: 'Checkbox option' },
        'radio': { name: 'Radio Button', tag: 'input', type: 'radio', label: 'Radio option', name: 'radio-group' },
        'textarea': { name: 'Textarea', tag: 'textarea', placeholder: 'Enter text here' },
    };
    const formTemplates = {
        'default': { name: 'Default Blank', pageBackground: { type: 'solid', color: '#f4f6f8' }, formBackground: { type: 'solid', color: '#fdfdfd', styles: {'padding':'20px'} }, elements: [] },
        'classic-login': { name: 'Classic Login', pageBackground: { type: 'solid', color: '#e9ecef' }, formBackground: { type: 'solid', color: '#ffffff', styles: { 'border-radius': '8px', 'box-shadow': '0 4px 15px rgba(0,0,0,0.1)', 'padding':'25px'} }, elements: [ { type: 'label', text: 'Welcome Back!', wrapperStyles: { 'margin-bottom': '5px'}, styles: { 'font-size': '24px', 'font-weight': 'bold', color: '#333', 'text-align': 'center', display:'block', width:'100%'} }, { type: 'label', text: 'Sign in to continue', wrapperStyles: { 'margin-bottom': '20px'}, styles: { 'font-size': '14px', color: '#777', 'text-align': 'center', display:'block', width:'100%'} }, { type: 'email-input', placeholder: 'Email address', wrapperStyles: {'margin-bottom':'10px'}, styles: {'padding':'10px'} }, { type: 'password-input', placeholder: 'Password', wrapperStyles: {'margin-bottom':'15px'}, styles: {'padding':'10px'} }, { type: 'submit-button', text: 'Login', wrapperStyles: { 'margin-top': '10px' }, styles: { 'background-color': '#007bff', color: 'white', width: '100%', padding:'12px', 'border':'none', 'border-radius':'4px'} } ] },
        'dark-mode': { name: 'Dark Mode Login', pageBackground: { type: 'solid', color: '#121212' }, formBackground: { type: 'solid', color: '#1e1e1e', styles: { 'border-radius': '8px', border: '1px solid #333', 'padding': '25px' } }, elements: [ { type: 'label', text: 'Secure Login', wrapperStyles: {'margin-bottom':'20px'}, styles: { 'font-size': '22px', color: '#e0e0e0', 'text-align': 'center', display:'block', width:'100%' } }, { type: 'email-input', placeholder: 'Enter your email', wrapperStyles: {'margin-bottom':'10px'}, styles: { 'background-color': '#2c2c2c', color: '#e0e0e0', 'border':'1px solid #444', 'padding':'10px', 'border-radius':'4px' } }, { type: 'password-input', placeholder: 'Enter your password', wrapperStyles: {'margin-bottom':'20px'}, styles: { 'background-color': '#2c2c2c', color: '#e0e0e0', 'border':'1px solid #444', 'padding':'10px', 'border-radius':'4px' } }, { type: 'submit-button', text: 'Sign In', wrapperStyles: {'margin-top':'10px'}, styles: { 'background-color': '#00acc1', color: 'white', width: '100%', padding:'12px', 'border':'none', 'border-radius':'4px' } } ] },
        'minimal-transparent': { name: 'Minimal Transparent', pageBackground: { type: 'gradient', gradient: 'linear-gradient(to right, #ff7e5f, #feb47b)' }, formBackground: { type: 'solid', color: 'rgba(255, 255, 255, 0.15)', styles: { 'backdrop-filter': 'blur(10px)', 'border-radius': '10px', 'padding': '30px', 'box-shadow': '0 0 20px rgba(0,0,0,0.2)' } }, elements: [ { type: 'email-input', placeholder: 'Email', wrapperStyles: {'margin-bottom':'15px'}, styles: { 'background-color': 'rgba(255,255,255,0.2)', 'border':'none', color:'white', 'border-radius':'5px', padding:'12px', 'placeholder-color':'rgba(255,255,255,0.7)'} }, { type: 'password-input', placeholder: 'Password', wrapperStyles: {'margin-bottom':'20px'}, styles: { 'background-color': 'rgba(255,255,255,0.2)', 'border':'none', color:'white', 'border-radius':'5px', padding:'12px', 'placeholder-color':'rgba(255,255,255,0.7)' } }, { type: 'submit-button', text: 'Go', wrapperStyles: {}, styles: { 'background-color': 'rgba(255,255,255,0.3)', color: 'white', 'border-radius':'5px', padding:'12px', width:'100%', 'font-weight':'bold', 'border':'none' } } ] },
        'corporate-blue': { name: 'Corporate Blue', pageBackground: { type: 'solid', color: '#f0f4f8' }, formBackground: { type: 'solid', color: '#ffffff', styles: {'border-left': '5px solid #0d6efd', 'box-shadow': '0 2px 10px rgba(0,0,0,0.07)', 'padding': '25px'} }, elements: [ { type: 'label', text: 'Company Portal', wrapperStyles: {'margin-bottom':'25px'}, styles: { 'font-size': '22px', color: '#0d6efd', 'font-weight':'600' } }, { type: 'text-input', placeholder: 'Username', wrapperStyles: {'margin-bottom':'10px'}, styles: {'border-radius':'3px', 'border':'1px solid #ced4da', 'padding':'10px'} }, { type: 'password-input', placeholder: 'Password', wrapperStyles: {'margin-bottom':'20px'}, styles: {'border-radius':'3px', 'border':'1px solid #ced4da', 'padding':'10px'} }, { type: 'submit-button', text: 'Login', wrapperStyles: {}, styles: { 'background-color': '#0d6efd', color: 'white', 'border-radius':'3px', padding:'10px', width:'100%', 'border':'none'} } ] }
    };

    const debouncedSaveState = debounce(saveStateToLocalStorage, 500);

    function saveStateToLocalStorage() {
        const formElementsData = [];
        formCanvas.querySelectorAll('.dropped-element-wrapper').forEach(wrapper => {
            const actualElement = wrapper.querySelector(':scope > .dropped-form-element') ||
                                  wrapper.querySelector(':scope > label > .dropped-form-element') ||
                                  (wrapper.firstChild?.classList?.contains('dropped-form-element') ? wrapper.firstChild : null);
            if (!actualElement) return;

            const elementTypeKey = Object.keys(formElementsConfig).find(key => {
                const config = formElementsConfig[key];
                if (config.tag.toLowerCase() !== actualElement.tagName.toLowerCase()) return false;
                return !config.type || config.type === actualElement.type;
            });

            if (!elementTypeKey) { console.warn("Could not find config for element:", actualElement); return; }

            const data = {
                type: elementTypeKey,
                id: actualElement.id,
                wrapperStyles: wrapper.style.cssText,
                elementStyles: actualElement.style.cssText,
                text: undefined, placeholder: undefined, value: undefined, label: undefined, name: undefined
            };

            if (actualElement.tagName === 'BUTTON' || actualElement.tagName === 'LABEL') {
                data.text = actualElement.textContent;
            } else if (actualElement.tagName === 'INPUT' && actualElement.type === 'submit') {
                data.text = actualElement.value;
            } else if (actualElement.tagName === 'TEXTAREA') {
                data.value = actualElement.value;
            }

            if (actualElement.placeholder !== undefined) data.placeholder = actualElement.placeholder;
            if (actualElement.value !== undefined && actualElement.tagName === 'INPUT' && actualElement.type !== 'submit' && actualElement.type !== 'button') {
                data.value = actualElement.value;
            }
            if (actualElement.name !== undefined) data.name = actualElement.name;

            if (actualElement.tagName === 'INPUT' && (actualElement.type === 'checkbox' || actualElement.type === 'radio')) {
                const span = actualElement.closest('label')?.querySelector('span');
                if (span) data.label = span.textContent.trim();
            }
            formElementsData.push(data);
        });

        const state = {
            formElements: formElementsData,
            formCanvas: { width: formCanvas.style.width, height: formCanvas.style.height, styles: formCanvas.style.cssText },
            backgroundSettings: currentBackgroundSettings,
            template: currentAppliedTemplate,
            icons: uploadedIcons
        };
        localStorage.setItem(LS_KEY, JSON.stringify(state));
        console.log('State actually saved now.');
    }

    function loadStateFromLocalStorage() {
        const savedState = localStorage.getItem(LS_KEY);
        if (!savedState) {
            console.log('No saved state found. Applying default template.');
            applyTemplate(currentAppliedTemplate || 'default', false);
            return;
        }

        try {
            const state = JSON.parse(savedState);
            currentBackgroundSettings = state.backgroundSettings || currentBackgroundSettings;
            currentAppliedTemplate = state.template || 'default';
            uploadedIcons = state.icons || [];

            if (state.formCanvas) {
                formCanvas.style.width = state.formCanvas.width || '';
                formCanvas.style.height = state.formCanvas.height || '';
                if(state.formCanvas.styles) formCanvas.style.cssText = state.formCanvas.styles;
            }

            formCanvas.innerHTML = '';

            if (state.formElements && state.formElements.length > 0) {
                state.formElements.forEach(elementData => {
                    const wrapper = createFormElementFromConfig(elementData.type, elementData);
                    if (wrapper) {
                        wrapper.style.cssText = elementData.wrapperStyles || '';
                        const actualElement = wrapper.querySelector(':scope > .dropped-form-element') ||
                                              wrapper.querySelector(':scope > label > .dropped-form-element') ||
                                              (wrapper.firstChild?.classList?.contains('dropped-form-element') ? wrapper.firstChild : null);
                        if (actualElement) {
                             actualElement.style.cssText = elementData.elementStyles || '';
                        }
                        formCanvas.appendChild(wrapper);
                        makeElementResizableAndDraggable(wrapper);
                    }
                });
            } else if (formTemplates[currentAppliedTemplate] && formTemplates[currentAppliedTemplate].elements.length > 0) {
                applyTemplate(currentAppliedTemplate, true);
            }

            uploadedIcons.forEach(iconData => {
                if (iconData.onPage) {
                    placeIconOnPage(iconData, iconData.x || 50, iconData.y || 50, iconData.width || 50, iconData.height || 50, true);
                }
            });

            console.log('State loaded.');
        } catch (error) {
            console.error('Error loading state:', error);
            localStorage.removeItem(LS_KEY);
            applyTemplate('default', false);
        }
        clearSettingsPanel();
        if(document.getElementById('template-select') && currentAppliedTemplate){
            document.getElementById('template-select').value = currentAppliedTemplate;
        }
        updateBackground(pageBody, currentBackgroundSettings.page, true);
        updateBackground(formCanvas, currentBackgroundSettings.form, true);
    }

    // Populate Elements Panel - MODIFIED FOR ICONS
    for (const id in formElementsConfig) {
        const config = formElementsConfig[id];
        const elDiv = document.createElement('div');
        elDiv.classList.add('form-element');
        elDiv.setAttribute('data-element-type', id);

        const iconHTML = elementIconsSVG[id] || '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"/></svg>'; // Default icon
        const nameSpan = document.createElement('span');
        nameSpan.textContent = config.name;
        // nameSpan.style.marginLeft = 'var(--space-2)'; // REMOVED - handle spacing with CSS on SVG

        elDiv.innerHTML = iconHTML;
        elDiv.appendChild(nameSpan);

        elementsPanel.appendChild(elDiv);
    }

    interact('.form-element',{context:elementsPanel}).draggable({inertia:true,autoScroll:true,listeners:{start(t){const e=t.target,n=e.cloneNode(true);n.classList.add('dragging-clone');n.style.position='absolute';n.style.left=(t.clientX-e.offsetWidth/2)+'px';n.style.top=(t.clientY-e.offsetHeight/2)+'px';document.body.appendChild(n);t.interaction.draggedClone=n},move(t){const e=t.interaction.draggedClone;e.style.left=(parseFloat(e.style.left)||0)+t.dx+'px';e.style.top=(parseFloat(e.style.top)||0)+t.dy+'px'},end(t){const e=t.interaction.draggedClone;e&&e.remove();delete t.interaction.draggedClone;}}});
    interact('.login-form-canvas').dropzone({accept:'.form-element',ondrop:function(t){const e=t.relatedTarget,n=e.getAttribute('data-element-type');if(formElementsConfig[n]){const o=createFormElementFromConfig(n,{type:n});formCanvas.appendChild(o);makeElementResizableAndDraggable(o);populateElementSettings(o);debouncedSaveState();}t.target.classList.remove('drop-target');e.classList.remove('can-drop')},ondropactivate:t=>t.target.classList.add('drop-active'),ondragenter:t=>{t.target.classList.add('drop-target');t.relatedTarget.classList.add('can-drop')},ondragleave:t=>{t.target.classList.remove('drop-target');t.relatedTarget.classList.remove('can-drop')},ondropdeactivate:t=>t.target.classList.remove('drop-active')});
    new Sortable(formCanvas,{animation:150,handle:'.dropped-element-wrapper',draggable:'.dropped-element-wrapper',ghostClass:'sortable-ghost',chosenClass:'sortable-chosen',dragClass:'sortable-drag', onEnd: debouncedSaveState});
    function makeElementResizableAndDraggable(t){interact(t).resizable({edges:{left:true,right:true,bottom:true,top:true},listeners:{move(t){Object.assign(t.target.style,{width:`${t.rect.width}px`,height:`${t.rect.height}px`});debouncedSaveState();}},inertia:false,modifiers:[interact.modifiers.restrictEdges({outer:'parent'}),interact.modifiers.restrictSize({min:{width:30,height:20}})]}).draggable({listeners:{move(t){let{x:e,y:n}=t.target.dataset;e=(parseFloat(e)||0)+t.dx;n=(parseFloat(n)||0)+t.dy;t.target.style.transform=`translate(${e}px, ${n}px)`;Object.assign(t.target.dataset,{x:e,y:n});debouncedSaveState();}},inertia:true,modifiers:[interact.modifiers.restrictRect({restriction:'parent'})]})}
    interact('.login-form-canvas').resizable({edges:{left:true,right:true,bottom:true,top:false},listeners:{move:t=>{const e=t.target;e.style.width=`${t.rect.width}px`;e.style.height=`${t.rect.height}px`;debouncedSaveState();}},inertia:true,modifiers:[interact.modifiers.restrictSize({min:{width:200,height:150}})]});
    function getStyle(t,e){return t?window.getComputedStyle(t)[e]:''}
    function addSettingInput(idSuffix, labelText, initialValue, type = 'text', onChangeCallback, readOnly = false, parent = settingsPanelContent) {
        const settingId = `setting-${idSuffix}-${selectedElementWrapper ? (selectedElementWrapper.dataset.uuid || Math.random().toString(36).substr(2,9)) : (parent.id || 'global_' + Math.random().toString(36).substr(2,9))}`;
        const labelEl = document.createElement('label'); labelEl.setAttribute('for', settingId); labelEl.textContent = labelText;
        const inputEl = document.createElement(type === 'textarea' ? 'textarea' : 'input');
        if (type !== 'textarea') inputEl.setAttribute('type', type);
        inputEl.setAttribute('id', settingId);
        if (type === 'color') { inputEl.value = initialValue && initialValue !== 'rgba(0, 0, 0, 0)' && initialValue !== 'transparent' ? initialValue : '#ffffff'; }
        else if (type === 'number' && (initialValue === null || initialValue === undefined || initialValue === '' || isNaN(parseInt(initialValue)))) { inputEl.value = 0; }
        else { inputEl.value = initialValue || ''; }
        if (readOnly) inputEl.setAttribute('readonly', true);
        inputEl.addEventListener('input', (e) => { if(onChangeCallback) onChangeCallback(e.target.value); debouncedSaveState(); });
        if (type === 'color' || type === 'radio') { inputEl.addEventListener('change', (e) => { if(onChangeCallback) onChangeCallback(e.target.value); debouncedSaveState(); });}
        parent.appendChild(labelEl); parent.appendChild(inputEl);
    }
    function updateBackground(element, settings, skipSave = false) {
        if(!element)return;
        let originalTransition = element.style.transition;
        element.style.transition = 'none';

        const w = element.style.width, h = element.style.height;
        element.style.cssText = '';
        if(w && element === formCanvas) element.style.width = w;
        if(h && element === formCanvas) element.style.height = h;

        switch(settings.type){
            case'solid':element.style.background=settings.color||'';break;
            case'gradient':element.style.background=settings.gradient||'';break;
            case'image':element.style.background=settings.image?`url('${settings.image}')`:''; break;
            default:element.style.background='';
        }
        if (element === formCanvas && settings.styles) {
             Object.assign(element.style, settings.styles);
        }
        setTimeout(() => { element.style.transition = originalTransition;}, 0);
        if(!skipSave) debouncedSaveState();
    }
    function createFormElementFromConfig(elementTypeKey, config) {
        const baseConfig = formElementsConfig[elementTypeKey];
        if (!baseConfig) { console.warn(`Unknown element type key: ${elementTypeKey}`); return null; }
        const newElementWrapper = document.createElement('div');
        newElementWrapper.classList.add('dropped-element-wrapper');
        if (config.wrapperStyles && typeof config.wrapperStyles === 'string') newElementWrapper.style.cssText = config.wrapperStyles;
        else if (config.wrapperStyles) Object.assign(newElementWrapper.style, config.wrapperStyles);

        const actualElement = document.createElement(baseConfig.tag);
        actualElement.classList.add('dropped-form-element');
        if (baseConfig.type) actualElement.setAttribute('type', baseConfig.type);

        actualElement.id = config.id || '';
        actualElement.setAttribute('placeholder', config.placeholder || baseConfig.placeholder || '');
        if (baseConfig.tag === 'button') actualElement.textContent = config.text || baseConfig.text || 'Button';
        else if (baseConfig.tag === 'label') actualElement.textContent = config.text || baseConfig.text || 'Label';
        else if (baseConfig.tag === 'textarea') actualElement.value = config.value || config.text || '';
        else if (actualElement.tagName === 'INPUT' && config.value !== undefined) actualElement.value = config.value;

        if (config.name && actualElement.name !== undefined) actualElement.name = config.name;

        if (config.elementStyles && typeof config.elementStyles === 'string') actualElement.style.cssText = config.elementStyles;
        else if (config.styles) Object.assign(actualElement.style, config.styles);

        if (config.styles && config.styles['placeholder-color'] && actualElement.style.setProperty) {
            actualElement.style.setProperty('--placeholder-color', config.styles['placeholder-color']);
        }

        if (baseConfig.tag === 'input' && (baseConfig.type === 'checkbox' || baseConfig.type === 'radio')) {
            const labelElement = document.createElement('label');
            const span = document.createElement('span');
            span.textContent = " " + (config.label || baseConfig.label || elementTypeKey);
            if (actualElement.style.color) span.style.color = actualElement.style.color;

            labelElement.appendChild(actualElement); labelElement.appendChild(span);
            if (baseConfig.name && baseConfig.type === 'radio') {
                actualElement.setAttribute('name', (config.name || baseConfig.name || `radio-group-${Date.now()}`));
            }
            newElementWrapper.appendChild(labelElement);
        } else {
            newElementWrapper.appendChild(actualElement);
        }
        return newElementWrapper;
    }
    function populateElementSettings(elementWrapper) {
        settingsPanelContent.innerHTML = '<h2>Element Settings</h2>';
        if(selectedElementWrapper && selectedElementWrapper !== elementWrapper) selectedElementWrapper.classList.remove('selected');
        if(selectedIconElement) { selectedIconElement.classList.remove('selected-icon'); selectedIconElement = null; }
        selectedElementWrapper = elementWrapper; selectedElementWrapper.classList.add('selected');

        let actualElement = elementWrapper.querySelector(':scope > .dropped-form-element');
        if (!actualElement && elementWrapper.querySelector(':scope > label > .dropped-form-element')) {
            actualElement = elementWrapper.querySelector(':scope > label > .dropped-form-element');
        }
        if (!actualElement && elementWrapper.firstChild?.classList?.contains('dropped-form-element')) {
            actualElement = elementWrapper.firstChild;
        }

        if(!actualElement){console.error("Could not find actual form element:",elementWrapper);clearSettingsPanel();return;}
        const elementType=actualElement.tagName,inputType=actualElement.type;
        addSettingInput('element-id','Element ID',actualElement.id || '','text',(v)=>{actualElement.id=v; debouncedSaveState();}, false, settingsPanelContent);
        if(elementType==='LABEL'&&!actualElement.querySelector('input'))addSettingInput('text-content','Label Text',actualElement.textContent,'text',(v)=>actualElement.textContent=v,false,settingsPanelContent);
        else if(elementType==='BUTTON'||(elementType==='INPUT'&&(inputType==='submit'||inputType==='button'))){const p=(elementType==='BUTTON')?'textContent':'value';addSettingInput('text-content','Button Text',actualElement[p],'text',(v)=>actualElement[p]=v,false,settingsPanelContent);}
        else if (elementType === 'TEXTAREA') { addSettingInput('value', 'Text Content', actualElement.value, 'textarea', (v) => { actualElement.value = v; }, false, settingsPanelContent); }
        else if(elementType==='INPUT'&&(inputType==='checkbox'||inputType==='radio')){const lC=actualElement.closest('label'),tS=lC?.querySelector('span');if(tS)addSettingInput('option-label','Option Label',tS.textContent.trim(),'text',(v)=>tS.textContent=" "+v,false,settingsPanelContent);}
        if((elementType==='INPUT'&&!['checkbox','radio','submit','button'].includes(inputType))||elementType==='TEXTAREA')addSettingInput('placeholder','Placeholder',actualElement.placeholder||'','text',(v)=>actualElement.placeholder=v,false,settingsPanelContent);
        let sT=document.createElement('h3');sT.textContent='Element Styles';settingsPanelContent.appendChild(sT);
        addSettingInput('color','Text Color',getStyle(actualElement,'color'),'color',(v)=>{ if (elementType === 'INPUT' && (inputType === 'checkbox' || inputType === 'radio')) { const textSpan = actualElement.closest('label').querySelector('span'); if(textSpan) textSpan.style.color = v; } else { actualElement.style.color = v; }},false,settingsPanelContent);
        addSettingInput('background-color','Bg Color',getStyle(actualElement,'backgroundColor'),'color',(v)=>actualElement.style.backgroundColor=v,false,settingsPanelContent);
        addSettingInput('font-size','Font Size (px)',parseInt(getStyle(actualElement,'fontSize'))||16,'number',(v)=>actualElement.style.fontSize=`${v}px`,false,settingsPanelContent);
        sT=document.createElement('h3');sT.textContent='Wrapper Styles & Spacing';settingsPanelContent.appendChild(sT);
        addSettingInput('wrapper-padding-top','Pad Top (px)',parseInt(getStyle(elementWrapper,'paddingTop'))||0,'number',(v)=>elementWrapper.style.paddingTop=`${v}px`,false,settingsPanelContent);
        addSettingInput('wrapper-padding-right','Pad Right (px)',parseInt(getStyle(elementWrapper,'paddingRight'))||0,'number',(v)=>elementWrapper.style.paddingRight=`${v}px`,false,settingsPanelContent);
        addSettingInput('wrapper-padding-bottom','Pad Bottom (px)',parseInt(getStyle(elementWrapper,'paddingBottom'))||0,'number',(v)=>elementWrapper.style.paddingBottom=`${v}px`,false,settingsPanelContent);
        addSettingInput('wrapper-padding-left','Pad Left (px)',parseInt(getStyle(elementWrapper,'paddingLeft'))||0,'number',(v)=>elementWrapper.style.paddingLeft=`${v}px`,false,settingsPanelContent);
        addSettingInput('wrapper-margin-top','Margin Top (px)',parseInt(getStyle(elementWrapper,'marginTop'))||0,'number',(v)=>elementWrapper.style.marginTop=`${v}px`,false,settingsPanelContent);
        addSettingInput('wrapper-margin-bottom','Margin Bottom (px)',parseInt(getStyle(elementWrapper,'marginBottom'))||0,'number',(v)=>elementWrapper.style.marginBottom=`${v}px`,false,settingsPanelContent);
        const rB=document.createElement('button');rB.textContent='Remove Element';rB.classList.add('remove-button');rB.onclick=()=>{elementWrapper.remove();clearSettingsPanel();debouncedSaveState();};settingsPanelContent.appendChild(rB);
    }
    function populateBackgroundSettings(){ const t=document.createElement('h3');t.textContent='Page & Form Background';t.className='background-settings-title';settingsPanelContent.appendChild(t);['Page','Form'].forEach(e=>{const n=e==='Page'?pageBody:formCanvas,o=e==='Page'?currentBackgroundSettings.page:currentBackgroundSettings.form,i=document.createElement('div');i.style.marginBottom='20px';i.innerHTML=`<h4>${e} Background</h4>`;const a=document.createElement('div');a.className='background-type-selector';i.appendChild(a);const s=document.createElement('div');s.className='background-config-group-wrapper';['solid','gradient','image'].forEach(t=>{const r=document.createElement('label'),c=document.createElement('input');c.type='radio';c.name=`${e.toLowerCase()}-bg-type`;c.value=t;c.checked=o.type===t;c.onchange=()=>{o.type=t;updateBackground(n,o);const e=c.closest('.background-config-group-wrapper');e.querySelectorAll('.background-config-section').forEach(t=>t.classList.add('hidden-section'));e.querySelector(`.config-${t}`).classList.remove('hidden-section');};r.appendChild(c);r.append(` ${t.charAt(0).toUpperCase()+t.slice(1)}`);a.appendChild(r)});const l=document.createElement('div');l.className=`background-config-section config-solid ${o.type!=='solid'?'hidden-section':''}`;addSettingInput(`${e}-bg-color`,'Color',o.color,'color',t=>{o.color=t;o.type==='solid'&&updateBackground(n,o)},false,l);s.appendChild(l);const r=document.createElement('div');r.className=`background-config-section config-gradient ${o.type!=='gradient'?'hidden-section':''}`;addSettingInput(`${e}-gradient-string`,'Gradient CSS',o.gradient,'text',t=>{o.gradient=t;o.type==='gradient'&&updateBackground(n,o)},false,r);s.appendChild(r);const c=document.createElement('div');c.className=`background-config-section config-image ${o.type!=='image'?'hidden-section':''}`;addSettingInput(`${e}-image-url`,'Image URL',o.image,'text',t=>{o.image=t;o.type==='image'&&updateBackground(n,o)},false,c);s.appendChild(c);i.appendChild(s);settingsPanelContent.appendChild(i)}); }
    function populateTemplateSelector(){
        let e=document.getElementById('template-select-container');
        if(!e){
            e=document.createElement('div');e.id='template-select-container';
            const t=document.createElement('h3');t.textContent='Form Templates';t.className='template-settings-title';e.appendChild(t);
            const n=document.createElement('label');n.setAttribute('for','template-select');n.textContent='Choose a template:';n.className='template-selector-label';e.appendChild(n);
            const o=document.createElement('select');o.id='template-select';
            o.addEventListener('change', (event) => {
                const templateKey = event.target.value;
                if (templateKey) {
                    applyTemplate(templateKey, false);
                } else {
                    applyTemplate('default', false);
                }
            });
            e.appendChild(o);
            settingsPanelContent.insertBefore(e,settingsPanelContent.firstChild.nextSibling);
        }
        const t=document.getElementById('template-select');t.innerHTML='';
        const n=document.createElement('option');n.value="";n.textContent="Select a template...";t.appendChild(n);
        for(const o in formTemplates){const i=document.createElement('option');i.value=o;i.textContent=formTemplates[o].name;t.appendChild(i)}
        t.value=currentAppliedTemplate||"";
    }
    function applyTemplate(templateKey, isLoadingState = false) {
        currentAppliedTemplate = templateKey;
        const template = formTemplates[templateKey];
        if (!template) {
            console.warn(`Template with key "${templateKey}" not found. Applying default.`);
            if (templateKey !== 'default') {
                applyTemplate('default', isLoadingState);
            }
            return;
        }

        formCanvas.innerHTML = '';
        if(selectedElementWrapper) {selectedElementWrapper.classList.remove('selected'); selectedElementWrapper = null;}
        if(selectedIconElement) {selectedIconElement.classList.remove('selected-icon'); selectedIconElement = null;}

        const mainTitle = settingsPanelContent.querySelector('h2');
        const templateContainer = document.getElementById('template-select-container');
        const iconContainer = document.getElementById('icon-settings-container');

        settingsPanelContent.innerHTML = '';
        if(mainTitle) settingsPanelContent.appendChild(mainTitle);
        if(templateContainer) settingsPanelContent.appendChild(templateContainer); else populateTemplateSelector();
        if(iconContainer) settingsPanelContent.appendChild(iconContainer); else populateIconUploader();

        currentBackgroundSettings.form = JSON.parse(JSON.stringify({...formTemplates['default'].formBackground, ...(template.formBackground || {})}));
        currentBackgroundSettings.form.styles = template.formBackground?.styles ? JSON.parse(JSON.stringify(template.formBackground.styles)) : {};

        currentBackgroundSettings.page = JSON.parse(JSON.stringify({...formTemplates['default'].pageBackground, ...(template.pageBackground || {})}));

        updateBackground(pageBody, currentBackgroundSettings.page, isLoadingState);
        updateBackground(formCanvas, currentBackgroundSettings.form, isLoadingState);

        populateBackgroundSettings();

        template.elements.forEach(elementConfig => {
            const newElementWrapper = createFormElementFromConfig(elementConfig.type, elementConfig);
            if(newElementWrapper) {
                formCanvas.appendChild(newElementWrapper);
                makeElementResizableAndDraggable(newElementWrapper);
            }
        });

        const currentTemplateSelect = document.getElementById('template-select');
        if(currentTemplateSelect) currentTemplateSelect.value = templateKey;
        console.log(`Applied template: ${template.name}`);
        if(!isLoadingState) debouncedSaveState();
    }

    function clearSettingsPanel() {
        if(selectedElementWrapper) selectedElementWrapper.classList.remove('selected');
        if(selectedIconElement) selectedIconElement.classList.remove('selected-icon');
        selectedElementWrapper = null;
        selectedIconElement = null;

        settingsPanelContent.innerHTML = '';

        const title = document.createElement('h2');
        title.textContent = 'تنظیمات ویرایشگر';
        settingsPanelContent.appendChild(title);

        const saveButton = document.createElement('button');
        saveButton.id = 'save-editor-state-button';
        saveButton.textContent = 'ذخیره تغییرات';
        saveButton.addEventListener('click', () => {
            saveStateToLocalStorage(); // Direct call for explicit save
            const originalText = saveButton.textContent;
            saveButton.textContent = 'ذخیره شد!';
            saveButton.classList.add('saved');
            saveButton.disabled = true;
            setTimeout(() => {
                saveButton.textContent = originalText;
                saveButton.classList.remove('saved');
                saveButton.disabled = false;
            }, 2000);
        });
        settingsPanelContent.appendChild(saveButton);

        const previewButton = document.createElement('button');
        previewButton.id = 'preview-form-button';
        previewButton.textContent = 'پیش‌نمایش فرم';
        previewButton.style.backgroundColor = 'var(--text-color-secondary)';
        previewButton.style.marginTop = 'var(--space-2)';

        previewButton.addEventListener('click', () => {
            pageBody.classList.add('preview-mode');
            editorContainer.style.width = '100vw';
            editorContainer.style.height = '100vh';
            editorContainer.style.maxWidth = '100vw';
            editorContainer.style.maxHeight = '100vh';
            editorContainer.style.borderRadius = '0';
            editorContainer.style.border = 'none';
        });
        settingsPanelContent.appendChild(previewButton);

        if (!document.getElementById('exit-preview-button')) {
            const exitPreviewBtn = document.createElement('button');
            exitPreviewBtn.id = 'exit-preview-button';
            exitPreviewBtn.textContent = 'خروج از پیش‌نمایش';
            exitPreviewBtn.addEventListener('click', () => {
                pageBody.classList.remove('preview-mode');
                editorContainer.style.width = '';
                editorContainer.style.height = '';
                editorContainer.style.maxWidth = '';
                editorContainer.style.maxHeight = '';
                editorContainer.style.borderRadius = '';
                editorContainer.style.border = '';
            });
            pageBody.appendChild(exitPreviewBtn);
        }

        populateTemplateSelector();
        populateIconUploader();
        populateBackgroundSettings();
    }

    function populateIconUploader() {
        let container = document.getElementById('icon-settings-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'icon-settings-container';
            const iconTitle = document.createElement('h3');
            iconTitle.textContent = 'Manage Icons';
            iconTitle.className = 'icon-settings-title';
            container.appendChild(iconTitle);
            const uploadLabel = document.createElement('label');
            uploadLabel.setAttribute('for', 'icon-upload-input');
            uploadLabel.textContent = 'Upload Icon (PNG/SVG):';
            container.appendChild(uploadLabel);
            const input = document.createElement('input');
            input.type = 'file';
            input.id = 'icon-upload-input';
            input.accept = 'image/png, image/svg+xml';
            input.addEventListener('change', handleIconUpload);
            container.appendChild(input);
            const paletteLabel = document.createElement('label');
            paletteLabel.textContent = 'Uploaded Icons (drag to page):';
            paletteLabel.style.display = 'block';
            paletteLabel.style.marginTop = '10px';
            container.appendChild(paletteLabel);
            const palette = document.createElement('div');
            palette.id = 'uploaded-icons-palette';
            container.appendChild(palette);

            const templateContainer = document.getElementById('template-select-container');
            if (templateContainer && templateContainer.nextSibling) {
                settingsPanelContent.insertBefore(container, templateContainer.nextSibling);
            } else if (settingsPanelContent.firstChild && settingsPanelContent.firstChild.nextSibling) {
                 settingsPanelContent.insertBefore(container, settingsPanelContent.firstChild.nextSibling);
            } else {
                settingsPanelContent.appendChild(container);
            }
        }
        renderIconPalette();
    }

    function handleIconUpload(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newIcon = { id: `icon-${Date.now()}`, src: e.target.result, onPage: false };
                uploadedIcons.push(newIcon);
                renderIconPalette();
                debouncedSaveState();
            };
            reader.readAsDataURL(file);
        }
        event.target.value = '';
    }

    function renderIconPalette() {
        const palette = document.getElementById('uploaded-icons-palette');
        if (!palette) return;
        palette.innerHTML = '';
        uploadedIcons.forEach(iconData => {
            const img = document.createElement('img');
            img.src = iconData.src;
            img.classList.add('palette-icon');
            img.setAttribute('data-icon-id', iconData.id);
            img.setAttribute('draggable', 'true');
            img.addEventListener('dragstart', (e) => {
                 e.dataTransfer.setData('text/icon-id', iconData.id);
                 e.dataTransfer.effectAllowed = 'copy';
            });
            palette.appendChild(img);
        });
    }

    interact(editorContainer)
        .dropzone({
            accept: '.palette-icon',
            ondrop: function (event) {
                const iconId = event.dragEvent.dataTransfer.getData('text/icon-id');
                const iconData = uploadedIcons.find(ic => ic.id === iconId);
                if (iconData) {
                    const editorRect = editorContainer.getBoundingClientRect();
                    const dropX = event.clientX - editorRect.left;
                    const dropY = event.clientY - editorRect.top;
                    placeIconOnPage(iconData, dropX, dropY);
                }
                event.target.classList.remove('drop-target-icons');
            },
            ondragenter: function (event) { event.target.classList.add('drop-target-icons'); },
            ondragleave: function (event) { event.target.classList.remove('drop-target-icons'); }
        });

    function placeIconOnPage(iconData, x, y, width = 50, height = 50, skipSave = false) {
        let iconWrapper = document.querySelector(`.draggable-icon[data-icon-ref-id="${iconData.id}"]`);
        if (!iconWrapper) {
            iconWrapper = document.createElement('div');
            iconWrapper.classList.add('draggable-icon');
            iconWrapper.setAttribute('data-icon-ref-id', iconData.id);
            const img = document.createElement('img');
            img.src = iconData.src;
            iconWrapper.appendChild(img);
            editorContainer.appendChild(iconWrapper);
            makeIconDraggableAndResizable(iconWrapper);
        }

        iconWrapper.style.left = `${x}px`;
        iconWrapper.style.top = `${y}px`;
        iconWrapper.style.width = `${width}px`;
        iconWrapper.style.height = `${height}px`;

        iconData.x = x; iconData.y = y; iconData.width = width; iconData.height = height; iconData.onPage = true;
        if(!skipSave) debouncedSaveState();
    }

    function makeIconDraggableAndResizable(iconElement) {
        interact(iconElement)
            .resizable({
                edges: { left: true, right: true, bottom: true, top: true },
                listeners: {
                    move(event) {
                        const target = event.target;
                        target.style.width = `${event.rect.width}px`;
                        target.style.height = `${event.rect.height}px`;
                        const iconId = target.getAttribute('data-icon-ref-id');
                        const iconData = uploadedIcons.find(ic => ic.id === iconId);
                        if(iconData) { iconData.width = event.rect.width; iconData.height = event.rect.height; }
                        debouncedSaveState();
                    }
                },
                modifiers: [interact.modifiers.restrictSize({ min: { width: 20, height: 20 } })],
                inertia: false
            })
            .draggable({
                listeners: {
                    start(event) { selectIcon(event.target); },
                    move(event) {
                        const target = event.target;
                        let newX = (parseFloat(target.style.left) || 0) + event.dx;
                        let newY = (parseFloat(target.style.top) || 0) + event.dy;
                        target.style.left = `${newX}px`; target.style.top = `${newY}px`;
                        const iconId = target.getAttribute('data-icon-ref-id');
                        const iconData = uploadedIcons.find(ic => ic.id === iconId);
                        if(iconData) { iconData.x = newX; iconData.y = newY; }
                        debouncedSaveState();
                    }
                },
                modifiers: [interact.modifiers.restrictRect({ restriction: editorContainer })],
                inertia: true
            })
            .on('tap', function(event) {
                selectIcon(event.currentTarget);
                event.stopPropagation();
            });
    }

    function selectIcon(iconElement) {
        if (selectedElementWrapper) {selectedElementWrapper.classList.remove('selected'); selectedElementWrapper = null;}
        if (selectedIconElement && selectedIconElement !== iconElement) { selectedIconElement.classList.remove('selected-icon');}
        selectedIconElement = iconElement;
        selectedIconElement.classList.add('selected-icon');

        const mainTitle = settingsPanelContent.querySelector('h2');
        const templateContainer = document.getElementById('template-select-container');
        const uploaderContainer = document.getElementById('icon-settings-container');
        const backgroundTitle = settingsPanelContent.querySelector('.background-settings-title');
        const backgroundControls = settingsPanelContent.querySelectorAll('h4, .background-type-selector, .background-config-group-wrapper');

        settingsPanelContent.innerHTML = '';
        if(mainTitle) settingsPanelContent.appendChild(mainTitle);
        if(templateContainer) settingsPanelContent.appendChild(templateContainer);
        if(uploaderContainer) settingsPanelContent.appendChild(uploaderContainer);
        if(backgroundTitle) settingsPanelContent.appendChild(backgroundTitle);
        backgroundControls.forEach(el => settingsPanelContent.appendChild(el));

        const iconSettingsTitle = document.createElement('h3');
        iconSettingsTitle.textContent = "Selected Icon Settings";
        iconSettingsTitle.className = "icon-settings-title";
        settingsPanelContent.appendChild(iconSettingsTitle);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = "Delete Icon from Page";
        deleteBtn.classList.add("remove-button");
        deleteBtn.onclick = () => {
            if(selectedIconElement) {
                const iconId = selectedIconElement.getAttribute('data-icon-ref-id');
                const iconData = uploadedIcons.find(ic => ic.id === iconId);
                if(iconData) {
                    iconData.onPage = false;
                    delete iconData.x; delete iconData.y; delete iconData.width; delete iconData.height;
                }
                selectedIconElement.remove();
                selectedIconElement = null;
                clearSettingsPanel();
                debouncedSaveState();
            }
        };
        settingsPanelContent.appendChild(deleteBtn);
    }

    formCanvas.addEventListener('click', (event) => {
        const clickedWrapper = event.target.closest('.dropped-element-wrapper');
        if (clickedWrapper && formCanvas.contains(clickedWrapper)) {
            if (selectedElementWrapper === clickedWrapper && settingsPanelContent.querySelector('h2').textContent.includes('Element Settings')) return;
            populateElementSettings(clickedWrapper);
        } else if (!event.target.closest('.draggable-icon')) {
             if (selectedElementWrapper && !event.target.closest('.settings-panel')) {
                selectedElementWrapper.classList.remove('selected');
                clearSettingsPanel();
            } else if (!selectedElementWrapper && !event.target.closest('.settings-panel')) {
                 clearSettingsPanel();
            }
        }
    });
    editorContainer.addEventListener('click', function(event) {
        if (!event.target.closest('.dropped-element-wrapper') &&
            !event.target.closest('.draggable-icon') &&
            !event.target.closest('.settings-panel') &&
            !event.target.closest('.elements-panel'))
        {
            if (selectedIconElement) {
                selectedIconElement.classList.remove('selected-icon');
                selectedIconElement = null;
                clearSettingsPanel();
            }
            if (selectedElementWrapper) {
                selectedElementWrapper.classList.remove('selected');
                selectedElementWrapper = null;
                clearSettingsPanel();
            }
        }
    }, true);

    loadStateFromLocalStorage();

    if (!document.getElementById('dynamic-styles')) {
        const styleSheet = document.createElement("style"); styleSheet.id = 'dynamic-styles'; styleSheet.type = "text/css";
        styleSheet.innerText = `
            .form-element.dragging-clone{opacity:.7;background-color:#007bff;color:#fff;z-index:1000;pointer-events:none;border-radius:4px;padding:10px;font-size:.9em}
            .login-form-canvas.drop-active{background-color:#e8f0fe!important}
            .login-form-canvas.drop-target{border-color:#007bff!important;background-color:#d0e3ff!important}
            .form-element.can-drop{outline:2px dashed #28a745}
            .dropped-element-wrapper{position:relative;margin:5px 0;border:1px dashed transparent;cursor:grab;box-sizing:border-box;min-height:30px}
            .dropped-element-wrapper:hover:not(.selected){border-color:#7bbdff}
            .dropped-element-wrapper.selected{border:2px solid #007bff!important;box-shadow:0 0 5px rgba(0,123,255,0.5)}
            .dropped-form-element{background-color:#fff;display:block;width:100%;height:100%;box-sizing:border-box;pointer-events:none}
            .dropped-form-element::placeholder{color:var(--placeholder-color,#aaa)}
            .dropped-element-wrapper input,.dropped-element-wrapper button,.dropped-element-wrapper textarea,.dropped-element-wrapper label,.dropped-element-wrapper select,.dropped-element-wrapper span{pointer-events:auto;cursor:default}
            .dropped-element-wrapper button.dropped-form-element,.dropped-element-wrapper input[type=submit].dropped-form-element,.dropped-element-wrapper input[type=button].dropped-form-element{padding:10px 15px;cursor:pointer}
            .dropped-element-wrapper label{display:flex;align-items:center;padding:5px 0;cursor:default}
            .dropped-element-wrapper label .dropped-form-element[type=checkbox],.dropped-element-wrapper label .dropped-form-element[type=radio]{width:auto;height:auto;margin-right:8px;display:inline-block;vertical-align:middle;cursor:pointer}
            .dropped-element-wrapper label span{vertical-align:middle;flex-grow:1;cursor:text}
            .sortable-ghost{opacity:.4;background-color:#c8ebfb;border:1px dashed #007bff}
            .settings-panel .background-settings-title{margin-top:25px;margin-bottom:15px;font-size:1.1em;color:#222;border-top:1px solid #ddd;padding-top:15px}
            .settings-panel .background-type-selector label{display:inline-block;margin-right:10px;font-size:.85em;cursor:pointer}
            .settings-panel .background-type-selector input[type=radio]{margin-right:3px;vertical-align:middle;cursor:pointer}
            .background-config-section{border:1px solid #eee;padding:10px;margin-top:10px;border-radius:4px}
            .hidden-section{display:none}
            .resize-handle{position:absolute;width:10px;height:10px;background:#007bff;border:1px solid white;box-sizing:border-box;z-index:10}
            .resize-handle.resize-left{left:-5px;top:calc(50% - 5px);cursor:ew-resize}
            .resize-handle.resize-right{right:-5px;top:calc(50% - 5px);cursor:ew-resize}
            .resize-handle.resize-top{top:-5px;left:calc(50% - 5px);cursor:ns-resize}
            .resize-handle.resize-bottom{bottom:-5px;left:calc(50% - 5px);cursor:ns-resize}
            .resize-handle.resize-top-left{top:-5px;left:-5px;cursor:nwse-resize}
            .resize-handle.resize-top-right{top:-5px;right:-5px;cursor:nesw-resize}
            .resize-handle.resize-bottom-left{bottom:-5px;left:-5px;cursor:nesw-resize}
            .resize-handle.resize-bottom-right{bottom:-5px;right:-5px;cursor:nwse-resize}
            .settings-panel .template-settings-title{margin-top:15px;margin-bottom:10px;font-size:1.1em;color:#222;border-top:1px solid #ddd;padding-top:15px}
            .settings-panel .template-selector-label{display:block;margin-bottom:8px;font-size:.9em;color:#555}
            .settings-panel #template-select{width:calc(100% - 16px);padding:8px;margin-bottom:15px;border:1px solid #ccc;border-radius:4px;box-sizing:border-box;font-size:.9em;background-color:#fff}
            .settings-panel .icon-settings-title { margin-top:25px; margin-bottom:10px; font-size:1.1em; color:#222; border-top:1px solid #ddd; padding-top:15px; }
            .settings-panel #icon-upload-input { display: block; margin-bottom:10px; font-size:0.9em; }
            #uploaded-icons-palette { display:flex; flex-wrap:wrap; gap:10px; padding:10px; background-color:#f0f0f0; border-radius:4px; margin-top:10px; min-height:50px; border:1px solid #e0e0e0; max-height:200px;overflow-y:auto; }
            #uploaded-icons-palette .palette-icon { width:40px; height:40px; object-fit:contain; cursor:grab; border:1px solid #ccc; background-color:white; padding:2px; border-radius:3px; }
            .draggable-icon { position:absolute; cursor:move; z-index:100; border:1px dashed transparent; box-sizing:border-box;}
            .draggable-icon:hover, .draggable-icon.selected-icon { border-color:#007bff; box-shadow: 0 0 5px rgba(0,123,255,0.5); }
            .draggable-icon img { width:100%; height:100%; object-fit:contain; pointer-events:none; }
            .editor-container.drop-target-icons { background-color: rgba(0,123,255,0.05); }
        `;
        document.head.appendChild(styleSheet);
    }
});

[end of front/script.js]
