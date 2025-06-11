// Ensure this script is merged with the existing full script.
// The following is the complete script.js content with new additions.
document.addEventListener('DOMContentLoaded', () => {
    const elementsPanel = document.querySelector('.elements-panel');
    const formCanvas = document.getElementById('login-form-canvas');
    const settingsPanelContent = document.querySelector('.settings-panel');
    let selectedElementWrapper = null;
    const pageBody = document.body;

    let currentBackgroundSettings = {
        page: { type: 'solid', color: '#f4f6f8', gradient: '', image: '' },
        form: { type: 'solid', color: '#fdfdfd', gradient: '', image: '' }
    };

    let currentAppliedTemplate = 'default'; // To store the key of the currently applied template

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

    // --- NEW: Template Definitions ---
    const formTemplates = {
        'default': {
            name: 'Default Blank',
            pageBackground: { type: 'solid', color: '#f4f6f8' },
            formBackground: { type: 'solid', color: '#fdfdfd' },
            elements: []
        },
        'classic-login': {
            name: 'Classic Login',
            pageBackground: { type: 'solid', color: '#e9ecef' },
            formBackground: { type: 'solid', color: '#ffffff', styles: { 'border-radius': '8px', 'box-shadow': '0 4px 15px rgba(0,0,0,0.1)', 'padding': '25px'} },
            elements: [
                { type: 'label', text: 'Welcome Back!', wrapperStyles: { 'margin-bottom': '5px'}, styles: { 'font-size': '24px', 'font-weight': 'bold', color: '#333', 'text-align': 'center', display:'block', width:'100%'} },
                { type: 'label', text: 'Sign in to continue', wrapperStyles: { 'margin-bottom': '20px'}, styles: { 'font-size': '14px', color: '#777', 'text-align': 'center', display:'block', width:'100%'} },
                { type: 'email-input', placeholder: 'Email address', wrapperStyles: {'margin-bottom':'10px'}, styles: {'padding':'10px'} },
                { type: 'password-input', placeholder: 'Password', wrapperStyles: {'margin-bottom':'15px'}, styles: {'padding':'10px'} },
                { type: 'submit-button', text: 'Login', wrapperStyles: { 'margin-top': '10px' }, styles: { 'background-color': '#007bff', color: 'white', width: '100%', padding:'12px', 'border':'none', 'border-radius':'4px'} }
            ]
        },
        'dark-mode': {
            name: 'Dark Mode Login',
            pageBackground: { type: 'solid', color: '#121212' },
            formBackground: { type: 'solid', color: '#1e1e1e', styles: { 'border-radius': '8px', border: '1px solid #333', 'padding': '25px' } },
            elements: [
                { type: 'label', text: 'Secure Login', wrapperStyles: {'margin-bottom':'20px'}, styles: { 'font-size': '22px', color: '#e0e0e0', 'text-align': 'center', display:'block', width:'100%' } },
                { type: 'email-input', placeholder: 'Enter your email', wrapperStyles: {'margin-bottom':'10px'}, styles: { 'background-color': '#2c2c2c', color: '#e0e0e0', 'border':'1px solid #444', 'padding':'10px', 'border-radius':'4px' } },
                { type: 'password-input', placeholder: 'Enter your password', wrapperStyles: {'margin-bottom':'20px'}, styles: { 'background-color': '#2c2c2c', color: '#e0e0e0', 'border':'1px solid #444', 'padding':'10px', 'border-radius':'4px' } },
                { type: 'submit-button', text: 'Sign In', wrapperStyles: {'margin-top':'10px'}, styles: { 'background-color': '#00acc1', color: 'white', width: '100%', padding:'12px', 'border':'none', 'border-radius':'4px' } }
            ]
        },
         'minimal-transparent': {
            name: 'Minimal Transparent',
            pageBackground: { type: 'gradient', gradient: 'linear-gradient(to right, #ff7e5f, #feb47b)' },
            formBackground: { type: 'solid', color: 'rgba(255, 255, 255, 0.15)', styles: { 'backdrop-filter': 'blur(10px)', 'border-radius': '10px', 'padding': '30px', 'box-shadow': '0 0 20px rgba(0,0,0,0.2)' } },
            elements: [
                { type: 'email-input', placeholder: 'Email', wrapperStyles: {'margin-bottom':'15px'}, styles: { 'background-color': 'rgba(255,255,255,0.2)', 'border':'none', color:'white', 'border-radius':'5px', padding:'12px', 'placeholder-color':'rgba(255,255,255,0.7)'} },
                { type: 'password-input', placeholder: 'Password', wrapperStyles: {'margin-bottom':'20px'}, styles: { 'background-color': 'rgba(255,255,255,0.2)', 'border':'none', color:'white', 'border-radius':'5px', padding:'12px', 'placeholder-color':'rgba(255,255,255,0.7)' } },
                { type: 'submit-button', text: 'Go', wrapperStyles: {}, styles: { 'background-color': 'rgba(255,255,255,0.3)', color: 'white', 'border-radius':'5px', padding:'12px', width:'100%', 'font-weight':'bold', 'border':'none' } }
            ]
        },
        'corporate-blue': {
            name: 'Corporate Blue',
            pageBackground: { type: 'solid', color: '#f0f4f8' },
            formBackground: { type: 'solid', color: '#ffffff', styles: {'border-left': '5px solid #0d6efd', 'box-shadow': '0 2px 10px rgba(0,0,0,0.07)', 'padding': '25px'} },
            elements: [
                { type: 'label', text: 'Company Portal', wrapperStyles: {'margin-bottom':'25px'}, styles: { 'font-size': '22px', color: '#0d6efd', 'font-weight':'600' } },
                { type: 'text-input', placeholder: 'Username', wrapperStyles: {'margin-bottom':'10px'}, styles: {'border-radius':'3px', 'border':'1px solid #ced4da', 'padding':'10px'} },
                { type: 'password-input', placeholder: 'Password', wrapperStyles: {'margin-bottom':'20px'}, styles: {'border-radius':'3px', 'border':'1px solid #ced4da', 'padding':'10px'} },
                { type: 'submit-button', text: 'Login', wrapperStyles: {}, styles: { 'background-color': '#0d6efd', color: 'white', 'border-radius':'3px', padding:'10px', width:'100%', 'border':'none'} }
            ]
        }
    };
    // End Template Definitions

    for (const id in formElementsConfig) {
        const config = formElementsConfig[id];
        const elDiv = document.createElement('div'); elDiv.classList.add('form-element');
        elDiv.setAttribute('data-element-type', id); elDiv.textContent = config.name;
        elementsPanel.appendChild(elDiv);
    }

    interact('.form-element', { context: elementsPanel }).draggable({
        inertia: true, autoScroll: true,
        listeners: {
            start(event) { const o = event.target, c = o.cloneNode(true); c.classList.add('dragging-clone'); c.style.position='absolute'; c.style.left=(event.clientX - o.offsetWidth/2)+'px'; c.style.top=(event.clientY - o.offsetHeight/2)+'px'; document.body.appendChild(c); event.interaction.draggedClone=c; },
            move(event) { const c=event.interaction.draggedClone; c.style.left=(parseFloat(c.style.left)||0)+event.dx+'px'; c.style.top=(parseFloat(c.style.top)||0)+event.dy+'px'; },
            end(event) { const c=event.interaction.draggedClone; if(c)c.remove(); delete event.interaction.draggedClone; }
        }
    });

    interact('.login-form-canvas').dropzone({
        accept: '.form-element',
        ondrop: function (event) {
            const draggableElement = event.relatedTarget;
            const elementType = draggableElement.getAttribute('data-element-type');
            // For elements dragged from panel, config is just their type. Styles are default.
            const newElementWrapper = createFormElementFromConfig(elementType, { type: elementType });
            formCanvas.appendChild(newElementWrapper);
            makeElementResizableAndDraggable(newElementWrapper);
            populateElementSettings(newElementWrapper);

            event.target.classList.remove('drop-target'); draggableElement.classList.remove('can-drop');
        },
        ondropactivate: (e) => e.target.classList.add('drop-active'),
        ondragenter: (e) => { e.target.classList.add('drop-target'); e.relatedTarget.classList.add('can-drop');},
        ondragleave: (e) => { e.target.classList.remove('drop-target'); e.relatedTarget.classList.remove('can-drop');},
        ondropdeactivate: (e) => e.target.classList.remove('drop-active')
    });

    new Sortable(formCanvas, {
        animation:150, handle:'.dropped-element-wrapper', draggable:'.dropped-element-wrapper', ghostClass:'sortable-ghost', chosenClass:'sortable-chosen', dragClass:'sortable-drag'
    });

    function makeElementResizableAndDraggable(elementWrapper) {
        interact(elementWrapper)
            .resizable({ edges:{left:true,right:true,bottom:true,top:true}, listeners:{move(e){Object.assign(e.target.style,{width:`${e.rect.width}px`,height:`${e.rect.height}px`});}}, inertia:false, modifiers:[interact.modifiers.restrictEdges({outer:'parent'}),interact.modifiers.restrictSize({min:{width:30,height:20}})]})
            .draggable({ listeners:{move(e){let{x:t,y:n}=e.target.dataset;t=(parseFloat(t)||0)+e.dx,n=(parseFloat(n)||0)+e.dy,e.target.style.transform=`translate(${t}px, ${n}px)`,Object.assign(e.target.dataset,{x:t,y:n})}}, inertia:true, modifiers:[interact.modifiers.restrictRect({restriction:'parent'})]});
    }

    interact('.login-form-canvas').resizable({
        edges:{left:true,right:true,bottom:true,top:false}, listeners:{move:(e)=>{const t=e.target;t.style.width=`${e.rect.width}px`,t.style.height=`${e.rect.height}px`}}, inertia:true, modifiers:[interact.modifiers.restrictSize({min:{width:200,height:150}})]
    });

    function clearSettingsPanel() {
        if(selectedElementWrapper) selectedElementWrapper.classList.remove('selected');
        selectedElementWrapper = null;
        settingsPanelContent.innerHTML = '<h2>Editor Settings</h2>';
        populateTemplateSelector();
        populateBackgroundSettings();
    }

    function populateElementSettings(elementWrapper) {
        settingsPanelContent.innerHTML = '<h2>Element Settings</h2>';
        if(selectedElementWrapper && selectedElementWrapper !== elementWrapper) selectedElementWrapper.classList.remove('selected');
        selectedElementWrapper = elementWrapper; selectedElementWrapper.classList.add('selected');

        let actualElement = elementWrapper.querySelector('.dropped-form-element');
        if (elementWrapper.firstChild && elementWrapper.firstChild.tagName === 'LABEL') {
            actualElement = elementWrapper.firstChild.querySelector('.dropped-form-element');
        } else if (!actualElement && elementWrapper.firstChild && elementWrapper.firstChild.classList && elementWrapper.firstChild.classList.contains('dropped-form-element')) {
            actualElement = elementWrapper.firstChild;
        }

        if(!actualElement){console.error("Could not find actual form element:",elementWrapper);clearSettingsPanel();return;}
        const elementType=actualElement.tagName,inputType=actualElement.type;
        addSettingInput('element-id','Element ID',actualElement.id || '','text',(v)=>{actualElement.id=v}, false, settingsPanelContent); // ID can be edited

        if(elementType==='LABEL'&&!actualElement.querySelector('input'))addSettingInput('text-content','Label Text',actualElement.textContent,'text',(v)=>actualElement.textContent=v,false,settingsPanelContent);
        else if(elementType==='BUTTON'||(elementType==='INPUT'&&(inputType==='submit'||inputType==='button'))){const p=(elementType==='BUTTON'||elementType==='TEXTAREA')?'textContent':'value';addSettingInput('text-content','Button Text',actualElement[p],'text',(v)=>actualElement[p]=v,false,settingsPanelContent);}
        else if(elementType==='INPUT'&&(inputType==='checkbox'||inputType==='radio')){const lC=actualElement.closest('label'),tS=lC?.querySelector('span');if(tS)addSettingInput('option-label','Option Label',tS.textContent.trim(),'text',(v)=>tS.textContent=" "+v,false,settingsPanelContent);}
        else if (elementType === 'TEXTAREA') { addSettingInput('value', 'Text Content', actualElement.value, 'textarea', (v) => { actualElement.value = v; }, false, settingsPanelContent); }


        if((elementType==='INPUT'&&!['checkbox','radio','submit','button'].includes(inputType))||elementType==='TEXTAREA')addSettingInput('placeholder','Placeholder',actualElement.placeholder||'','text',(v)=>actualElement.placeholder=v,false,settingsPanelContent);

        let sT=document.createElement('h3');sT.textContent='Element Styles';settingsPanelContent.appendChild(sT);
        addSettingInput('color','Text Color',getStyle(actualElement,'color'),'color',(v)=>{
             if (elementType === 'INPUT' && (inputType === 'checkbox' || inputType === 'radio')) {
                const textSpan = actualElement.closest('label').querySelector('span');
                if(textSpan) textSpan.style.color = v;
            } else {
                 actualElement.style.color = v;
            }
        },false,settingsPanelContent);
        addSettingInput('background-color','Bg Color',getStyle(actualElement,'backgroundColor'),'color',(v)=>actualElement.style.backgroundColor=v,false,settingsPanelContent);
        addSettingInput('font-size','Font Size (px)',parseInt(getStyle(actualElement,'fontSize'))||16,'number',(v)=>actualElement.style.fontSize=`${v}px`,false,settingsPanelContent);

        sT=document.createElement('h3');sT.textContent='Wrapper Styles & Spacing';settingsPanelContent.appendChild(sT);
        addSettingInput('wrapper-padding-top','Pad Top (px)',parseInt(getStyle(elementWrapper,'paddingTop'))||0,'number',(v)=>elementWrapper.style.paddingTop=`${v}px`,false,settingsPanelContent);
        addSettingInput('wrapper-padding-right','Pad Right (px)',parseInt(getStyle(elementWrapper,'paddingRight'))||0,'number',(v)=>elementWrapper.style.paddingRight=`${v}px`,false,settingsPanelContent);
        addSettingInput('wrapper-padding-bottom','Pad Bottom (px)',parseInt(getStyle(elementWrapper,'paddingBottom'))||0,'number',(v)=>elementWrapper.style.paddingBottom=`${v}px`,false,settingsPanelContent);
        addSettingInput('wrapper-padding-left','Pad Left (px)',parseInt(getStyle(elementWrapper,'paddingLeft'))||0,'number',(v)=>elementWrapper.style.paddingLeft=`${v}px`,false,settingsPanelContent);
        addSettingInput('wrapper-margin-top','Margin Top (px)',parseInt(getStyle(elementWrapper,'marginTop'))||0,'number',(v)=>elementWrapper.style.marginTop=`${v}px`,false,settingsPanelContent);
        addSettingInput('wrapper-margin-bottom','Margin Bottom (px)',parseInt(getStyle(elementWrapper,'marginBottom'))||0,'number',(v)=>elementWrapper.style.marginBottom=`${v}px`,false,settingsPanelContent);

        const rB=document.createElement('button');rB.textContent='Remove Element';rB.classList.add('remove-button');rB.onclick=()=>{elementWrapper.remove();clearSettingsPanel();};settingsPanelContent.appendChild(rB);
    }

    function populateBackgroundSettings() {
        const bgTitle=document.createElement('h3');bgTitle.textContent='Page & Form Background';bgTitle.className='background-settings-title';settingsPanelContent.appendChild(bgTitle);
        ['Page','Form'].forEach(targetName=>{const targetElement=targetName==='Page'?pageBody:formCanvas;const targetSettings=targetName==='Page'?currentBackgroundSettings.page:currentBackgroundSettings.form;const group=document.createElement('div');group.style.marginBottom='20px';group.innerHTML=`<h4>${targetName} Background</h4>`;const typeSelector=document.createElement('div');typeSelector.className='background-type-selector';group.appendChild(typeSelector);const configGroupWrapper=document.createElement('div');configGroupWrapper.className='background-config-group-wrapper';['solid','gradient','image'].forEach(type=>{const label=document.createElement('label'),radio=document.createElement('input');radio.type='radio';radio.name=`${targetName.toLowerCase()}-bg-type`;radio.value=type;radio.checked=targetSettings.type===type;radio.onchange=()=>{targetSettings.type=type;updateBackground(targetElement,targetSettings);const pG=radio.closest('.background-config-group-wrapper');pG.querySelectorAll('.background-config-section').forEach(s=>s.classList.add('hidden-section'));pG.querySelector(`.config-${type}`).classList.remove('hidden-section');};label.appendChild(radio);label.append(` ${type.charAt(0).toUpperCase()+type.slice(1)}`);typeSelector.appendChild(label);});const solidSection=document.createElement('div');solidSection.className=`background-config-section config-solid ${targetSettings.type!=='solid'?'hidden-section':''}`;addSettingInput(`${targetName}-bg-color`,'Color',targetSettings.color,'color',(v)=>{targetSettings.color=v;if(targetSettings.type==='solid')updateBackground(targetElement,targetSettings)},!1,solidSection);configGroupWrapper.appendChild(solidSection);const gradientSection=document.createElement('div');gradientSection.className=`background-config-section config-gradient ${targetSettings.type!=='gradient'?'hidden-section':''}`;addSettingInput(`${targetName}-gradient-string`,'Gradient CSS',targetSettings.gradient,'text',(v)=>{targetSettings.gradient=v;if(targetSettings.type==='gradient')updateBackground(targetElement,targetSettings)},!1,gradientSection);configGroupWrapper.appendChild(gradientSection);const imageSection=document.createElement('div');imageSection.className=`background-config-section config-image ${targetSettings.type!=='image'?'hidden-section':''}`;addSettingInput(`${targetName}-image-url`,'Image URL',targetSettings.image,'text',(v)=>{targetSettings.image=v;if(targetSettings.type==='image')updateBackground(targetElement,targetSettings)},!1,imageSection);configGroupWrapper.appendChild(imageSection);group.appendChild(configGroupWrapper);settingsPanelContent.appendChild(group);});
        updateBackground(pageBody,currentBackgroundSettings.page);updateBackground(formCanvas,currentBackgroundSettings.form);
    }

    function updateBackground(element, settings) {
        if(!element)return;
        element.style.cssText = ''; // Clear all inline styles first
        switch(settings.type){
            case'solid':element.style.background=settings.color||'';break;
            case'gradient':element.style.background=settings.gradient||'';break;
            case'image':element.style.background=settings.image?`url('${settings.image}')`:''; break;
            default:element.style.background='';
        }
        if (element === formCanvas && settings.styles) { // Apply additional direct styles for form canvas
             Object.assign(element.style, settings.styles);
        }
    }

    function populateTemplateSelector() {
        let container = document.getElementById('template-select-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'template-select-container';
            const templateTitle = document.createElement('h3');
            templateTitle.textContent = 'Form Templates';
            templateTitle.className = 'template-settings-title';
            container.appendChild(templateTitle);

            const label = document.createElement('label');
            label.setAttribute('for', 'template-select');
            label.textContent = 'Choose a template:';
            label.className = 'template-selector-label';
            container.appendChild(label);

            const select = document.createElement('select');
            select.id = 'template-select';
            select.addEventListener('change', (event) => {
                const templateKey = event.target.value;
                if (templateKey) {
                    applyTemplate(templateKey);
                }
            });
            container.appendChild(select);
             // Insert after the main H2 "Editor Settings"
            settingsPanelContent.insertBefore(container, settingsPanelContent.firstChild.nextSibling);
        }

        const select = document.getElementById('template-select');
        select.innerHTML = ''; // Clear existing options before repopulating

        const defaultOption = document.createElement('option');
        defaultOption.value = "";
        defaultOption.textContent = "Select a template...";
        select.appendChild(defaultOption);

        for (const key in formTemplates) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = formTemplates[key].name;
            select.appendChild(option);
        }
        select.value = currentAppliedTemplate || ""; // Set to current or default
    }

    function applyTemplate(templateKey) {
        const template = formTemplates[templateKey];
        if (!template) return;

        currentAppliedTemplate = templateKey; // Set this early
        formCanvas.innerHTML = ''; // Clear current form elements
        if (selectedElementWrapper) {
             selectedElementWrapper.classList.remove('selected');
             selectedElementWrapper = null;
        }

        // Temporarily detach other general settings to avoid them being wiped by innerHTML clearing for element settings
        const settingsPanelChildren = Array.from(settingsPanelContent.children);
        const mainTitle = settingsPanelChildren.find(child => child.tagName === 'H2');
        const templateContainer = document.getElementById('template-select-container');
        const backgroundSettingsElements = settingsPanelContent.querySelectorAll('.background-settings-title, h4, .background-type-selector, .background-config-group-wrapper');


        settingsPanelContent.innerHTML = ''; // Clear panel
        if(mainTitle) settingsPanelContent.appendChild(mainTitle); // Re-add main title
        if(templateContainer) settingsPanelContent.appendChild(templateContainer); // Re-add template selector

        // Apply background settings from template
        currentBackgroundSettings.page = { ...(formTemplates['default'].pageBackground), ...(template.pageBackground || {}) };
        currentBackgroundSettings.form = { ...(formTemplates['default'].formBackground), ...(template.formBackground || {}) };

        updateBackground(pageBody, currentBackgroundSettings.page);
        updateBackground(formCanvas, currentBackgroundSettings.form); // This will also apply form specific styles like border-radius

        // Re-populate background settings UI to reflect template
        populateBackgroundSettings(); // Call this after template container is re-added.

        // Load elements from template
        template.elements.forEach(elementConfig => {
            const newElementWrapper = createFormElementFromConfig(elementConfig.type, elementConfig);
            if(newElementWrapper) {
                formCanvas.appendChild(newElementWrapper);
                makeElementResizableAndDraggable(newElementWrapper);
            }
        });

        document.getElementById('template-select').value = templateKey; // Ensure dropdown shows current template
        console.log(`Applied template: ${template.name}`);
    }

    function createFormElementFromConfig(elementTypeKey, config) {
        const baseConfig = formElementsConfig[elementTypeKey];
        if (!baseConfig) { console.warn(`Unknown element type key: ${elementTypeKey}`); return null; }

        const newElementWrapper = document.createElement('div');
        newElementWrapper.classList.add('dropped-element-wrapper');
        if (config.wrapperStyles) Object.assign(newElementWrapper.style, config.wrapperStyles);

        const actualElement = document.createElement(baseConfig.tag);
        actualElement.classList.add('dropped-form-element');

        if (baseConfig.type) actualElement.setAttribute('type', baseConfig.type);
        actualElement.setAttribute('placeholder', config.placeholder || baseConfig.placeholder || '');

        if (baseConfig.tag === 'button') actualElement.textContent = config.text || baseConfig.text || 'Button';
        else if (baseConfig.tag === 'label') actualElement.textContent = config.text || baseConfig.text || 'Label';
        else if (baseConfig.tag === 'textarea') actualElement.value = config.text || ''; // For textarea, text is value

        if (config.styles) Object.assign(actualElement.style, config.styles);
        if (config.styles && config.styles['placeholder-color'] && actualElement.style.setProperty) { // Custom property for placeholder color
            actualElement.style.setProperty('--placeholder-color', config.styles['placeholder-color']);
        }


        if (baseConfig.tag === 'input' && (baseConfig.type === 'checkbox' || baseConfig.type === 'radio')) {
            const labelElement = document.createElement('label'); // Changed variable name
            const span = document.createElement('span');
            span.textContent = " " + (config.label || baseConfig.label || elementTypeKey);
            if (config.styles && config.styles.color) span.style.color = config.styles.color;

            labelElement.appendChild(actualElement); labelElement.appendChild(span);
            if (baseConfig.name && baseConfig.type === 'radio') actualElement.setAttribute('name', (config.name || baseConfig.name) + '-' + Date.now());
            newElementWrapper.appendChild(labelElement);
        } else {
            newElementWrapper.appendChild(actualElement);
        }
        return newElementWrapper;
    }

    function getStyle(element, property) { if(!element)return'';return window.getComputedStyle(element)[property]; }

    function addSettingInput(idSuffix, labelText, initialValue, type = 'text', onChangeCallback, readOnly = false, parent = settingsPanelContent) {
        const settingId = `setting-${idSuffix}-${selectedElementWrapper ? (selectedElementWrapper.dataset.uuid || Math.random().toString(36).substr(2,9)) : (parent.id || 'global_' + Math.random().toString(36).substr(2,9))}`;
        const labelEl = document.createElement('label'); labelEl.setAttribute('for', settingId); labelEl.textContent = labelText;
        const inputEl = document.createElement(type === 'textarea' ? 'textarea' : 'input');
        if (type !== 'textarea') inputEl.setAttribute('type', type);
        inputEl.setAttribute('id', settingId);

        if (type === 'color') { inputEl.value = initialValue && initialValue !== 'rgba(0, 0, 0, 0)' && initialValue !== 'transparent' ? initialValue : '#ffffff'; }
        else if (type === 'number' && (initialValue === null || initialValue === undefined || initialValue === '' || isNaN(parseInt(initialValue)))) { inputEl.value = 0; }
        else { inputEl.value = initialValue || ''; } // Ensure empty string if null/undefined for text types

        if (readOnly) inputEl.setAttribute('readonly', true);
        inputEl.addEventListener('input', (e) => { if(onChangeCallback) onChangeCallback(e.target.value); });
        if (type === 'color' || type === 'radio') { inputEl.addEventListener('change', (e) => { if(onChangeCallback) onChangeCallback(e.target.value); });}

        parent.appendChild(labelEl); parent.appendChild(inputEl);
    }

    formCanvas.addEventListener('click', (event) => {
        const clickedWrapper=event.target.closest('.dropped-element-wrapper');
        if(clickedWrapper&&formCanvas.contains(clickedWrapper)){if(selectedElementWrapper===clickedWrapper&&settingsPanelContent.querySelector('h2').textContent.includes('Element Settings'))return;populateElementSettings(clickedWrapper);}
        else { // Clicked outside a specific element or on canvas itself
            if (selectedElementWrapper && !event.target.closest('.settings-panel')) {
                if (selectedElementWrapper) selectedElementWrapper.classList.remove('selected');
                clearSettingsPanel();
            } else if (!selectedElementWrapper && !event.target.closest('.settings-panel')) {
                 clearSettingsPanel();
            }
        }
    });

    applyTemplate('default'); // Apply default template on load

    if (!document.getElementById('dynamic-styles')) {
        const styleSheet = document.createElement("style"); styleSheet.id = 'dynamic-styles'; styleSheet.type = "text/css";
        styleSheet.innerText = `
            .form-element.dragging-clone { opacity:0.7; background-color:#007bff; color:white; z-index:1000; pointer-events:none; border-radius:4px; padding:10px; font-size:0.9em; }
            .login-form-canvas.drop-active { background-color:#e8f0fe !important; }
            .login-form-canvas.drop-target { border-color:#007bff !important; background-color:#d0e3ff !important; }
            .form-element.can-drop { outline:2px dashed #28a745; }
            .dropped-element-wrapper { position:relative; /*padding:5px;*/ margin:5px 0; border:1px dashed transparent; cursor:grab; box-sizing:border-box; min-height:30px; }
            .dropped-element-wrapper:hover:not(.selected) { border-color:#7bbdff; }
            .dropped-element-wrapper.selected { border:2px solid #007bff !important; box-shadow:0 0 5px rgba(0,123,255,0.5); }
            .dropped-form-element { background-color:#fff; display:block; width:100%; height:100%; box-sizing:border-box; pointer-events:none; }
            .dropped-form-element::placeholder { color: var(--placeholder-color, #aaa); } /* For custom placeholder color */
            .dropped-element-wrapper input, .dropped-element-wrapper button, .dropped-element-wrapper textarea, .dropped-element-wrapper label, .dropped-element-wrapper select, .dropped-element-wrapper span { pointer-events:auto; cursor:default; }
            .dropped-element-wrapper button.dropped-form-element, .dropped-element-wrapper input[type="submit"].dropped-form-element, .dropped-element-wrapper input[type="button"].dropped-form-element { padding:10px 15px; cursor:pointer; }
            .dropped-element-wrapper label { display:flex; align-items:center; padding:5px 0; cursor:default; }
            .dropped-element-wrapper label .dropped-form-element[type="checkbox"], .dropped-element-wrapper label .dropped-form-element[type="radio"] { width:auto; height:auto; margin-right:8px; display:inline-block; vertical-align:middle; cursor:pointer; }
            .dropped-element-wrapper label span { vertical-align:middle; flex-grow:1; cursor:text; }
            .sortable-ghost { opacity:0.4; background-color:#c8ebfb; border:1px dashed #007bff; }
            .settings-panel .background-settings-title { margin-top:25px; margin-bottom:15px; font-size:1.1em; color:#222; border-top:1px solid #ddd; padding-top:15px; }
            .settings-panel .background-type-selector label { display:inline-block; margin-right:10px; font-size:0.85em; cursor:pointer; }
            .settings-panel .background-type-selector input[type="radio"] { margin-right:3px; vertical-align:middle; cursor:pointer; }
            .background-config-section { border:1px solid #eee; padding:10px; margin-top:10px; border-radius:4px; }
            .hidden-section { display:none; }
            .resize-handle { position:absolute; width:10px; height:10px; background:#007bff; border:1px solid white; box-sizing:border-box; z-index:10; }
            .resize-handle.resize-left { left:-5px; top:calc(50% - 5px); cursor:ew-resize; }
            .resize-handle.resize-right { right:-5px; top:calc(50% - 5px); cursor:ew-resize; }
            .resize-handle.resize-top { top:-5px; left:calc(50% - 5px); cursor:ns-resize; }
            .resize-handle.resize-bottom { bottom:-5px; left:calc(50% - 5px); cursor:ns-resize; }
            .resize-handle.resize-top-left { top:-5px; left:-5px; cursor:nwse-resize; }
            .resize-handle.resize-top-right { top:-5px; right:-5px; cursor:nesw-resize; }
            .resize-handle.resize-bottom-left { bottom:-5px; left:-5px; cursor:nesw-resize; }
            .resize-handle.resize-bottom-right { bottom:-5px; right:-5px; cursor:nwse-resize; }
            /* Template Selector Styles from CSS file, also added here for completeness */
            .settings-panel .template-settings-title { margin-top:15px; margin-bottom:10px; font-size:1.1em; color:#222; border-top:1px solid #ddd; padding-top:15px; }
            .settings-panel .template-selector-label { display:block; margin-bottom:8px; font-size:0.9em; color:#555; }
            .settings-panel #template-select { width:calc(100% - 16px); padding:8px; margin-bottom:15px; border:1px solid #ccc; border-radius:4px; box-sizing:border-box; font-size:0.9em; background-color:white; }
        `;
        document.head.appendChild(styleSheet);
    }
});
