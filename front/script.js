// Debounce utility function
function debounce(func, delay) {
    let timeoutId;
    const debounced = function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
    debounced.flush = function(...args) {
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

    // --- Start of Replacement Block for Global Objects ---
    const formElementsConfig = {
        'text-input': { name: 'ورودی متن', tag: 'input', type: 'text', placeholder: 'متن را وارد کنید' },
        'email-input': { name: 'ورودی ایمیل', tag: 'input', type: 'email', placeholder: 'ایمیل را وارد کنید' },
        'password-input': { name: 'ورودی رمز عبور', tag: 'input', type: 'password', placeholder: 'رمز عبور را وارد کنید' },
        'submit-button': { name: 'دکمه ارسال', tag: 'button', type: 'submit', text: 'ارسال' },
        'label': { name: 'لیبل', tag: 'label', text: 'متن لیبل' },
        'checkbox': { name: 'چک‌باکس', tag: 'input', type: 'checkbox', label: 'گزینه چک‌باکس' },
        'radio': { name: 'دکمه رادیویی', tag: 'input', type: 'radio', label: 'گزینه رادیویی', name: 'radio-group' },
        'textarea': { name: 'ناحیه متنی', tag: 'textarea', placeholder: 'متن خود را اینجا وارد کنید' }
    };

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

    const formTemplates = {
        'default': {
            name: 'پیش‌فرض خالی',
            pageBackground: { type: 'solid', color: '#f4f6f8' },
            formBackground: { type: 'solid', color: '#fdfdfd', styles: {'padding':'20px'} },
            elements: []
        },
        'classic-login': {
            name: 'لاگین کلاسیک',
            pageBackground: { type: 'solid', color: '#e9ecef' },
            formBackground: { type: 'solid', color: '#ffffff', styles: { 'border-radius': '8px', 'box-shadow': 'var(--shadow-md)', 'padding':'25px'} },
            elements: [
                { type: 'label', text: 'خوش آمدید!', wrapperStyles: { 'margin-bottom': '5px'}, styles: { 'font-size': 'var(--font-size-xl)', 'font-weight': '700', color: 'var(--text-color-primary)', 'text-align': 'center', display:'block', width:'100%'} },
                { type: 'label', text: 'برای ادامه وارد شوید', wrapperStyles: { 'margin-bottom': '20px'}, styles: { 'font-size': 'var(--font-size-base)', color: 'var(--text-color-secondary)', 'text-align': 'center', display:'block', width:'100%'} },
                { type: 'email-input', placeholder: 'آدرس ایمیل', wrapperStyles: {'margin-bottom':'10px'}, styles: {'padding':'10px'} },
                { type: 'password-input', placeholder: 'رمز عبور', wrapperStyles: {'margin-bottom':'15px'}, styles: {'padding':'10px'} },
                { type: 'submit-button', text: 'ورود', wrapperStyles: { 'margin-top': '10px' }, styles: { 'background-color': 'var(--primary-color)', color: 'var(--text-on-primary)', width: '100%', padding:'12px', 'border':'none', 'border-radius':'var(--radius-md)'} }
            ]
        },
        'dark-mode': {
            name: 'حالت تاریک',
            pageBackground: { type: 'solid', color: '#121212' },
            formBackground: { type: 'solid', color: '#1e1e1e', styles: { 'border-radius': 'var(--radius-lg)', border: '1px solid #333', 'padding': '25px' } },
            elements: [
                { type: 'label', text: 'ورود امن', wrapperStyles: {'margin-bottom':'20px'}, styles: { 'font-size': 'var(--font-size-lg)', color: '#e0e0e0', 'text-align': 'center', display:'block', width:'100%' } },
                { type: 'email-input', placeholder: 'ایمیل خود را وارد کنید', wrapperStyles: {'margin-bottom':'10px'}, styles: { 'background-color': '#2c2c2c', color: '#e0e0e0', 'border':'1px solid #444', 'padding':'10px', 'border-radius':'var(--radius-md)' } },
                { type: 'password-input', placeholder: 'رمز عبور خود را وارد کنید', wrapperStyles: {'margin-bottom':'20px'}, styles: { 'background-color': '#2c2c2c', color: '#e0e0e0', 'border':'1px solid #444', 'padding':'10px', 'border-radius':'var(--radius-md)' } },
                { type: 'submit-button', text: 'ورود به سیستم', wrapperStyles: {'margin-top':'10px'}, styles: { 'background-color': '#00acc1', color: 'var(--text-on-primary)', width: '100%', padding:'12px', 'border':'none', 'border-radius':'var(--radius-md)' } }
            ]
        },
        'minimal-transparent': {
            name: 'کمینه شفاف',
            pageBackground: { type: 'gradient', gradient: 'linear-gradient(to right, #ff7e5f, #feb47b)' },
            formBackground: { type: 'solid', color: 'rgba(255, 255, 255, 0.15)', styles: { 'backdrop-filter': 'blur(10px)', 'border-radius': 'var(--radius-lg)', 'padding': '30px', 'box-shadow': 'var(--shadow-lg)' } },
            elements: [
                { type: 'email-input', placeholder: 'ایمیل', wrapperStyles: {'margin-bottom':'15px'}, styles: { 'background-color': 'rgba(255,255,255,0.2)', 'border':'none', color:'white', 'border-radius':'var(--radius-md)', padding:'12px', 'placeholder-color':'rgba(255,255,255,0.7)'} },
                { type: 'password-input', placeholder: 'رمز عبور', wrapperStyles: {'margin-bottom':'20px'}, styles: { 'background-color': 'rgba(255,255,255,0.2)', 'border':'none', color:'white', 'border-radius':'var(--radius-md)', padding:'12px', 'placeholder-color':'rgba(255,255,255,0.7)' } },
                { type: 'submit-button', text: 'برو', wrapperStyles: {}, styles: { 'background-color': 'rgba(255,255,255,0.3)', color: 'white', 'border-radius':'var(--radius-md)', padding:'12px', width:'100%', 'font-weight':'700', 'border':'none' } }
            ]
        },
        'corporate-blue': {
            name: 'آبی شرکتی',
            pageBackground: { type: 'solid', color: '#f0f4f8' },
            formBackground: { type: 'solid', color: '#ffffff', styles: {'border-left': '5px solid var(--primary-color)', 'box-shadow': 'var(--shadow-md)', 'padding': '25px'} },
            elements: [
                { type: 'label', text: 'پورتال شرکت', wrapperStyles: {'margin-bottom':'25px'}, styles: { 'font-size': 'var(--font-size-lg)', color: 'var(--primary-color)', 'font-weight':'700' } },
                { type: 'text-input', placeholder: 'نام کاربری', wrapperStyles: {'margin-bottom':'10px'}, styles: {'border-radius':'var(--radius-sm)', 'border':'1px solid var(--border-color)', 'padding':'10px'} },
                { type: 'password-input', placeholder: 'رمز عبور', wrapperStyles: {'margin-bottom':'20px'}, styles: {'border-radius':'var(--radius-sm)', 'border':'1px solid var(--border-color)', 'padding':'10px'} },
                { type: 'submit-button', text: 'ورود', wrapperStyles: {}, styles: { 'background-color': 'var(--primary-color)', color: 'var(--text-on-primary)', 'border-radius':'var(--radius-sm)', padding:'10px', width:'100%', 'border':'none'} }
            ]
        }
    };
    // --- End of Verified Replacement Block for Global Objects ---

    let currentBackgroundSettings = {
        page: { type: 'solid', color: '#f4f6f8', gradient: '', image: '' },
        form: { type: 'solid', color: '#fdfdfd', gradient: '', image: '' }
    };
    let currentAppliedTemplate = 'default';
    let uploadedIcons = [];

    const LS_KEY = 'loginFormEditorState_v1';

    const debouncedSaveState = debounce(saveStateToLocalStorage, 500);

    // --- Start of Verified Replacement for saveStateToLocalStorage ---
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

            if (!elementTypeKey) { console.warn("[SAVE] Could not find config for element:", actualElement); return; }

            const data = {
                type: elementTypeKey,
                id: actualElement.id,
                wrapperStyles: wrapper.style.cssText,
                elementStyles: actualElement.style.cssText,
                text: undefined, placeholder: undefined, value: undefined, label: undefined, name: undefined
            };

            if (actualElement.tagName === 'BUTTON' || (actualElement.tagName === 'LABEL' && !actualElement.querySelector('input'))) {
                data.text = actualElement.textContent;
            } else if (actualElement.tagName === 'INPUT' && actualElement.type === 'submit') {
                data.text = actualElement.value;
            } else if (actualElement.tagName === 'TEXTAREA') {
                data.value = actualElement.value;
            }

            if (actualElement.placeholder !== undefined) data.placeholder = actualElement.placeholder;

            if (actualElement.tagName === 'INPUT' && !['submit', 'button', 'checkbox', 'radio'].includes(actualElement.type) ) {
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
        console.log('[SAVE] State actually saved now.');
    }
    // --- End of Verified Replacement for saveStateToLocalStorage ---

    // --- Start of Verified Replacement for loadStateFromLocalStorage ---
    function loadStateFromLocalStorage() {
        console.log('[LOAD] Attempting to load state from LocalStorage...');
        let savedState = localStorage.getItem(LS_KEY);

        if (!savedState) {
            console.log('[LOAD] No saved state found. Initializing with default template.');
            currentAppliedTemplate = 'default';
            try {
                applyTemplate(currentAppliedTemplate, false);
            } catch (e) {
                console.error('[LOAD] Error applying default template during fresh init:', e);
                formCanvas.innerHTML = '';
                uploadedIcons = [];
                currentBackgroundSettings = {
                    page: JSON.parse(JSON.stringify(formTemplates['default'].pageBackground)),
                    form: JSON.parse(JSON.stringify(formTemplates['default'].formBackground))
                };
            }
            clearSettingsPanel();
            updateBackground(pageBody, currentBackgroundSettings.page, true);
            updateBackground(formCanvas, currentBackgroundSettings.form, true);
            console.log('[LOAD] Default template applied and UI refreshed for fresh init.');
            return;
        }

        try {
            console.log('[LOAD] Parsing saved state...');
            const state = JSON.parse(savedState);
            console.log('[LOAD] Saved state parsed successfully.');

            console.log('[LOAD] Restoring background settings...');
            currentBackgroundSettings = {
                page: JSON.parse(JSON.stringify(formTemplates['default'].pageBackground)),
                form: JSON.parse(JSON.stringify(formTemplates['default'].formBackground))
            };
            if (state?.backgroundSettings?.page) {
                Object.assign(currentBackgroundSettings.page, state.backgroundSettings.page);
            }
            if (state?.backgroundSettings?.form) {
                Object.assign(currentBackgroundSettings.form, state.backgroundSettings.form);
                if (state.backgroundSettings.form.styles) {
                     currentBackgroundSettings.form.styles = { ...(currentBackgroundSettings.form.styles || {}), ...state.backgroundSettings.form.styles };
                }
            }
            console.log('[LOAD] Background settings restored.');

            currentAppliedTemplate = state?.template ?? 'default';
            console.log(`[LOAD] Current template set to: ${currentAppliedTemplate}`);

            if (state?.formCanvas) {
                console.log('[LOAD] Restoring form canvas dimensions and styles...');
                formCanvas.style.width = state.formCanvas.width || '';
                formCanvas.style.height = state.formCanvas.height || '';
                if (state.formCanvas.styles) {
                    formCanvas.style.cssText = state.formCanvas.styles;
                    console.log('[LOAD] Form canvas direct styles applied.');
                } else {
                    const formW = formCanvas.style.width;
                    const formH = formCanvas.style.height;
                    formCanvas.style.cssText = '';
                    if(formW) formCanvas.style.width = formW;
                    if(formH) formCanvas.style.height = formH;
                    const defaultPadding = formTemplates[currentAppliedTemplate]?.formBackground?.styles?.padding ?? formTemplates['default']?.formBackground?.styles?.padding;
                    if (defaultPadding) {
                        formCanvas.style.padding = defaultPadding;
                    }
                    console.log('[LOAD] Form canvas styles reset, default padding applied if any.');
                }
            } else {
                console.log('[LOAD] No formCanvas state found, applying default padding from template or absolute default.');
                const defaultPadding = formTemplates[currentAppliedTemplate]?.formBackground?.styles?.padding ?? formTemplates['default']?.formBackground?.styles?.padding;
                if (defaultPadding) {
                    formCanvas.style.padding = defaultPadding;
                }
            }

            formCanvas.innerHTML = '';
            console.log('[LOAD] Form canvas cleared for repopulation.');

            console.log('[LOAD] Restoring form elements...');
            if (state?.formElements && Array.isArray(state.formElements) && state.formElements.length > 0) {
                state.formElements.forEach((elementData, index) => {
                    try {
                        if (!elementData || !elementData.type || !formElementsConfig[elementData.type]) {
                            console.warn(`[LOAD] Skipping invalid or unknown element type at index ${index}:`, elementData);
                            return;
                        }
                        console.log(`[LOAD] Restoring element ${index + 1}/${state.formElements.length}: Type ${elementData.type}`);
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
                        } else {
                            console.warn(`[LOAD] Failed to create wrapper for element data at index ${index}:`, elementData);
                        }
                    } catch (e) {
                        console.error(`[LOAD] Error restoring individual form element at index ${index} with data:`, elementData, e);
                    }
                });
                console.log('[LOAD] Form elements restored.');
            } else if (formTemplates[currentAppliedTemplate]?.elements?.length > 0) {
                console.log(`[LOAD] No saved elements, but template '${currentAppliedTemplate}' has elements. Applying template elements.`);
                applyTemplate(currentAppliedTemplate, true);
            } else {
                console.log('[LOAD] No saved elements and template has no elements.');
            }

            console.log('[LOAD] Restoring icons...');
            uploadedIcons = Array.isArray(state?.icons) ? state.icons : [];
            const iconsToPlace = uploadedIcons.filter(iconData => iconData?.onPage);
            if (iconsToPlace.length > 0) {
                iconsToPlace.forEach((iconData, index) => {
                    try {
                        if (iconData && iconData.src && iconData.id) {
                            console.log(`[LOAD] Restoring on-page icon ${index + 1}/${iconsToPlace.length}: ID ${iconData.id}`);
                            placeIconOnPage(
                                iconData,
                                parseFloat(iconData.x) || 50,
                                parseFloat(iconData.y) || 50,
                                parseFloat(iconData.width) || 50,
                                parseFloat(iconData.height) || 50
                            );
                        } else {
                            console.warn(`[LOAD] Skipping invalid on-page icon data at index ${index}:`, iconData);
                        }
                    } catch (e) {
                        console.error(`[LOAD] Error restoring individual on-page icon at index ${index} with data:`, iconData, e);
                    }
                });
                console.log('[LOAD] On-page icons restored.');
            } else {
                console.log('[LOAD] No on-page icons to restore.');
            }

            console.log('[LOAD] State loaded successfully from LocalStorage.');

        } catch (error) {
            console.error('[LOAD] CRITICAL error loading state from LocalStorage or during initial parsing:', error);
            localStorage.removeItem(LS_KEY);

            uploadedIcons = [];
            currentBackgroundSettings = {
                page: JSON.parse(JSON.stringify(formTemplates['default'].pageBackground)),
                form: JSON.parse(JSON.stringify(formTemplates['default'].formBackground))
            };
            currentAppliedTemplate = 'default';
            formCanvas.innerHTML = '';

            try {
                console.log('[LOAD-FALLBACK] Applying default template after critical error.');
                applyTemplate('default', true);
            } catch (e) {
                console.error('[LOAD-FALLBACK] Error applying default template after critical error:', e);
            }
        } finally {
            console.log('[LOAD] Executing finally block: refreshing UI.');
            try {
                clearSettingsPanel();
                const templateSelect = document.getElementById('template-select');
                if(templateSelect) {
                    templateSelect.value = currentAppliedTemplate;
                }
                console.log('[LOAD] UI refreshed in finally block.');
            } catch (e) {
                console.error('[LOAD] Error in finally block during UI refresh:', e);
            }
        }
    }
    // --- End of Verified Replacement for loadStateFromLocalStorage ---

    // --- Start of Verified Replacement for applyTemplate ---
    function applyTemplate(templateKey, isLoadingState = false) {
        currentAppliedTemplate = templateKey;
        const template = formTemplates[templateKey];
        if (!template) {
            console.warn(`[TEMPLATE] Template key "${templateKey}" not found. Applying default.`);
            if (templateKey !== 'default') {
                applyTemplate('default', isLoadingState);
            }
            return;
        }

        console.log(`[TEMPLATE] Applying template: ${template.name}, isLoadingState: ${isLoadingState}`);
        formCanvas.innerHTML = '';
        if(selectedElementWrapper) {selectedElementWrapper.classList.remove('selected'); selectedElementWrapper = null;}
        if(selectedIconElement) {selectedIconElement.classList.remove('selected-icon'); selectedIconElement = null;}

        const mainSettingsTitle = settingsPanelContent.querySelector('h2');
        const templateContainer = document.getElementById('template-select-container');
        const iconContainer = document.getElementById('icon-settings-container');
        const saveBtn = document.getElementById('save-editor-state-button');
        const previewBtn = document.getElementById('preview-form-button');

        settingsPanelContent.innerHTML = '';
        if(mainSettingsTitle) settingsPanelContent.appendChild(mainSettingsTitle); else { const t = document.createElement('h2'); t.textContent = 'تنظیمات ویرایشگر'; settingsPanelContent.appendChild(t); }
        if(saveBtn) settingsPanelContent.appendChild(saveBtn);
        if(previewBtn) settingsPanelContent.appendChild(previewBtn);
        if(templateContainer) settingsPanelContent.appendChild(templateContainer); else populateTemplateSelector();
        if(iconContainer) settingsPanelContent.appendChild(iconContainer); else populateIconUploader();

        currentBackgroundSettings.page = JSON.parse(JSON.stringify(formTemplates['default'].pageBackground));
        if(template.pageBackground) Object.assign(currentBackgroundSettings.page, template.pageBackground);

        currentBackgroundSettings.form = JSON.parse(JSON.stringify(formTemplates['default'].formBackground));
        if(template.formBackground) {
            Object.assign(currentBackgroundSettings.form, template.formBackground);
            currentBackgroundSettings.form.styles = template.formBackground.styles ? JSON.parse(JSON.stringify(template.formBackground.styles)) : {};
        } else {
            currentBackgroundSettings.form.styles = {};
        }

        updateBackground(pageBody, currentBackgroundSettings.page, true);
        updateBackground(formCanvas, currentBackgroundSettings.form, true);

        populateBackgroundSettings();

        template.elements.forEach(elementConfig => {
            if (!elementConfig || !elementConfig.type || !formElementsConfig[elementConfig.type]) {
                console.warn('[TEMPLATE] Skipping invalid element config in template:', elementConfig);
                return;
            }
            const newElementWrapper = createFormElementFromConfig(elementConfig.type, elementConfig);
            if(newElementWrapper) {
                formCanvas.appendChild(newElementWrapper);
                makeElementResizableAndDraggable(newElementWrapper);
            }
        });

        const currentTemplateSelect = document.getElementById('template-select');
        if(currentTemplateSelect) currentTemplateSelect.value = templateKey;

        if(!isLoadingState) {
            console.log("[TEMPLATE] Calling debouncedSaveState after applying template.");
            debouncedSaveState();
        }
    }
    // --- End of Verified Replacement for applyTemplate ---

    // --- Start of Verified Replacement for createFormElementFromConfig ---
    function createFormElementFromConfig(elementTypeKey, config) {
        const baseConfig = formElementsConfig[elementTypeKey];
        if (!baseConfig) { console.warn(`[CREATE_ELEMENT] Unknown element type key: ${elementTypeKey}`); return null; }

        const newElementWrapper = document.createElement('div');
        newElementWrapper.classList.add('dropped-element-wrapper');
        if (config.wrapperStyles && typeof config.wrapperStyles === 'string') newElementWrapper.style.cssText = config.wrapperStyles;
        else if (config.wrapperStyles) Object.assign(newElementWrapper.style, config.wrapperStyles);

        const actualElement = document.createElement(baseConfig.tag);
        actualElement.classList.add('dropped-form-element');
        if (baseConfig.type) actualElement.setAttribute('type', baseConfig.type);

        actualElement.id = config.id ?? `el-${Date.now().toString(36)}-${Math.random().toString(36).substr(2,5)}`;
        actualElement.setAttribute('placeholder', config.placeholder ?? baseConfig.placeholder ?? '');

        if (baseConfig.tag === 'button') {
            actualElement.textContent = config.text ?? baseConfig.text ?? 'دکمه';
        } else if (baseConfig.tag === 'label' && !(baseConfig.type === 'checkbox' || baseConfig.type === 'radio')) {
            actualElement.textContent = config.text ?? baseConfig.text ?? 'لیبل';
        } else if (baseConfig.tag === 'textarea') {
            actualElement.value = config.value ?? config.text ?? '';
        } else if (actualElement.tagName === 'INPUT' && config.value !== undefined && !['checkbox', 'radio', 'submit', 'button'].includes(baseConfig.type)) {
            actualElement.value = config.value;
        } else if (actualElement.tagName === 'INPUT' && baseConfig.type === 'submit'){
             actualElement.value = config.text ?? baseConfig.text ?? 'ارسال';
        }

        if (config.name && actualElement.name !== undefined) actualElement.name = config.name;

        if (config.elementStyles && typeof config.elementStyles === 'string') actualElement.style.cssText = config.elementStyles;
        else if (config.styles) Object.assign(actualElement.style, config.styles);

        if (actualElement.style.getPropertyValue('--placeholder-color') && config.styles?.['placeholder-color']) {
            actualElement.style.setProperty('--placeholder-color', config.styles['placeholder-color']);
        }

        if (baseConfig.tag === 'input' && (baseConfig.type === 'checkbox' || baseConfig.type === 'radio')) {
            const labelElement = document.createElement('label');
            const span = document.createElement('span');
            span.textContent = " " + (config.label ?? baseConfig.label ?? elementTypeKey);
            if (actualElement.style.color) span.style.color = actualElement.style.color;

            labelElement.appendChild(actualElement);
            labelElement.appendChild(span);
            if (baseConfig.name && baseConfig.type === 'radio') {
                actualElement.setAttribute('name', (config.name ?? baseConfig.name ?? `radio-group-${Date.now()}`));
            }
            newElementWrapper.appendChild(labelElement);
        } else {
            newElementWrapper.appendChild(actualElement);
        }
        return newElementWrapper;
    }
    // --- End of Verified Replacement for createFormElementFromConfig ---

    // Populate Elements Panel
    for (const id in formElementsConfig) {
        const config = formElementsConfig[id];
        const elDiv = document.createElement('div');
        elDiv.classList.add('form-element');
        elDiv.setAttribute('data-element-type', id);

        const iconHTML = elementIconsSVG[id] || '<svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4zm0 6a2 2 0 110-4 2 2 0 010 4z"/></svg>';
        const nameSpan = document.createElement('span');
        nameSpan.textContent = config.name;

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
            saveStateToLocalStorage();
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

[end of front/script.js]

[end of front/script.js]

[start of front/style.css]
@font-face {
    font-family: 'IRANYekanWeb';
    font-style: normal;
    font-weight: 300; /* Light */
    src: local('IRANYekanWebFaNum-Light'),
         url('/fonts/woff2/IRANYekanWebFaNum-Light.woff2') format('woff2'),
         url('/fonts/woff/IRANYekanWebFaNum-Light.woff') format('woff');
    font-display: swap;
}

@font-face {
    font-family: 'IRANYekanWeb';
    font-style: normal;
    font-weight: 400; /* Regular */
    src: local('IRANYekanWebFaNum-Regular'),
         url('/fonts/woff2/IRANYekanWebFaNum-Regular.woff2') format('woff2'),
         url('/fonts/woff/IRANYekanWebFaNum-Regular.woff') format('woff');
    font-display: swap;
}

@font-face {
    font-family: 'IRANYekanWeb';
    font-style: normal;
    font-weight: 500; /* Medium */
    src: local('IRANYekanWebFaNum-Medium'),
         url('/fonts/woff2/IRANYekanWebFaNum-Medium.woff2') format('woff2'),
         url('/fonts/woff/IRANYekanWebFaNum-Medium.woff') format('woff');
    font-display: swap;
}

@font-face {
    font-family: 'IRANYekanWeb';
    font-style: normal;
    font-weight: 600; /* SemiBold/DemiBold */
    src: local('IRANYekanWebFaNum-DemiBold'),
         url('/fonts/woff2/IRANYekanWebFaNum-DemiBold.woff2') format('woff2'),
         url('/fonts/woff/IRANYekanWebFaNum-DemiBold.woff') format('woff');
    font-display: swap;
}

@font-face {
    font-family: 'IRANYekanWeb';
    font-style: normal;
    font-weight: 700; /* Bold */
    src: local('IRANYekanWebFaNum-Bold'),
         url('/fonts/woff2/IRANYekanWebFaNum-Bold.woff2') format('woff2'),
         url('/fonts/woff/IRANYekanWebFaNum-Bold.woff') format('woff');
    font-display: swap;
}

/* Reset basic styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

:root {
    /* Color Palette - Inspired by modern UI tools */
    --primary-color: #4A90E2; /* A modern, friendly blue */
    --primary-color-light: #7BAAF7;
    --primary-color-dark: #3A7BC8;
    --primary-color-light-rgb: 123, 170, 247; /* Added for box-shadow */

    --secondary-color: #F7F9FC; /* Light gray for panel backgrounds */
    --tertiary-color: #E4E8F0; /* Slightly darker gray for borders, inputs */

    --text-color-primary: #2D3748; /* Dark gray for primary text */
    --text-color-secondary: #4A5568; /* Medium gray for secondary text, labels */
    --text-color-light: #718096;   /* Lighter gray for placeholders, help text */
    --text-on-primary: #FFFFFF;    /* Text color on primary background */

    --accent-success: #48BB78;    /* Green for success messages */
    --accent-error: #F56565;      /* Red for error messages */
    --accent-warning: #ECC94B;   /* Yellow for warnings */

    --background-main: #FFFFFF;   /* Main workspace background (form canvas area) */
    --background-app: #EDF2F7;    /* Overall app background */
    --border-color: var(--tertiary-color); /* Default border color */
    --input-background: #FFFFFF;

    /* Shadows - subtle and layered */
    --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.04);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.07), 0 4px 6px -2px rgba(0, 0, 0, 0.03);

    /* Typography */
    --font-primary: 'IRANYekanWeb', 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    --font-secondary: 'IRANYekanWeb', 'Roboto', sans-serif;

    --font-size-base: 14px;
    --font-size-sm: 13px;
    --font-size-xs: 12px;
    --font-size-md: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-title: 24px;

    --line-height-base: 1.65; /* Updated */
    --line-height-tight: 1.45; /* Updated */

    /* Spacing */
    --space-1: 4px;
    --space-2: 8px;
    --space-3: 12px;
    --space-4: 16px;
    --space-5: 20px;
    --space-6: 24px;
    --space-8: 32px;
    --space-10: 40px;

    /* Border Radius */
    --radius-sm: 3px;
    --radius-md: 5px;
    --radius-lg: 8px;
}

/* Base transitions for interactive elements */
button,
input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="file"],
input[type="color"],
input[type="url"],
select,
textarea,
.form-element,
.palette-icon,
.draggable-icon {
    transition: background-color 0.2s ease-out,
                border-color 0.2s ease-out,
                color 0.2s ease-out,
                box-shadow 0.2s ease-out,
                opacity 0.2s ease-out,
                transform 0.15s ease-out;
}

.settings-panel .background-config-section {
    transition: opacity 0.3s ease-out, transform 0.3s ease-out, max-height 0.3s ease-out;
    overflow: hidden;
}
.settings-panel .background-config-section.hidden-section {
    opacity: 0;
    transform: translateY(-10px);
    max-height: 0px !important;
    pointer-events: none;
}


body {
    font-family: var(--font-primary);
    font-size: var(--font-size-base);
    line-height: var(--line-height-base);
    color: var(--text-color-primary);
    background-color: var(--background-app);
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    overflow: hidden;
    text-align: right;
    font-weight: 400;
}

.editor-container {
    display: flex;
    width: 95vw;
    height: 90vh;
    max-width: 1800px;
    max-height: 1000px;
    background-color: var(--background-main);
    box-shadow: var(--shadow-lg);
    border-radius: var(--radius-lg);
    overflow: hidden;
    border: 1px solid var(--border-color);
}

.settings-panel, .elements-panel {
    width: 280px;
    padding: var(--space-5);
    background-color: var(--secondary-color);
    box-sizing: border-box;
    overflow-y: auto;
    border: none;
}

.settings-panel {
    border-left: 1px solid var(--border-color);
}

.elements-panel {
    border-right: 1px solid var(--border-color);
}

.form-preview-area {
    flex-grow: 1;
    padding: var(--space-5);
    background-color: var(--background-main);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    overflow: auto;
    box-sizing: border-box;
}

.login-form-canvas {
    width: 100%;
    max-width: 450px;
    min-height: 300px;
    padding: var(--space-6);
    border: 1px dashed var(--tertiary-color);
    box-sizing: border-box;
    position: relative;
    margin-top: var(--space-5);
    transition: background-color 0.2s ease-out, border-color 0.2s ease-out;
}
.login-form-canvas.drop-active {
    background-color: var(--primary-color-light) !important;
    border-color: var(--primary-color) !important;
}
.login-form-canvas.drop-target {
    border-color: var(--primary-color-dark) !important;
    background-color: var(--primary-color-light) !important;
    box-shadow: inset 0 0 10px rgba(0,0,0,0.1);
}

.settings-panel h2, .elements-panel h2, .form-preview-area h2 {
    font-size: var(--font-size-lg);
    color: var(--text-color-primary);
    margin-top: 0;
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--border-color);
    font-weight: 700;
    text-align: right;
}

.settings-panel h3,
.settings-panel .background-settings-title,
.settings-panel .template-settings-title,
.settings-panel .icon-settings-title {
    font-size: var(--font-size-md);
    color: var(--text-color-primary);
    font-weight: 600;
    margin-top: var(--space-6);
    margin-bottom: var(--space-3);
    padding-bottom: var(--space-2);
    border-bottom: 1px solid var(--tertiary-color);
    text-align: right;
}
.settings-panel h4 {
    font-size: var(--font-size-base);
    color: var(--text-color-secondary);
    font-weight: 600;
    margin-bottom: var(--space-3);
    text-align: right;
}

/* Settings Panel Controls Styling */
.settings-panel label,
.settings-panel .template-selector-label,
.settings-panel .icon-settings-container label[for="icon-upload-input"] {
    display: block;
    font-weight: 500;
    color: var(--text-color-secondary);
    font-size: var(--font-size-sm);
    margin-bottom: var(--space-2);
    line-height: var(--line-height-tight);
    text-align: right;
}

.settings-panel .background-type-selector label {
    display: inline-flex;
    align-items: center;
    margin-left: var(--space-3);
    font-size: var(--font-size-sm);
    font-weight: 400;
    color: var(--text-color-secondary);
    cursor: pointer;
}
.settings-panel .background-type-selector input[type="radio"] {
    margin-left: var(--space-1);
    cursor: pointer;
    accent-color: var(--primary-color);
}

.settings-panel input[type="text"],
.settings-panel input[type="number"],
.settings-panel input[type="email"],
.settings-panel input[type="password"],
.settings-panel input[type="url"],
.settings-panel textarea,
.settings-panel select,
.settings-panel #template-select {
    width: 100%;
    padding: var(--space-2) var(--space-3);
    background-color: var(--input-background);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-color-primary);
    font-size: var(--font-size-sm);
    line-height: var(--line-height-base);
    margin-bottom: var(--space-4);
}
.settings-panel input[type="text"]:focus,
.settings-panel input[type="number"]:focus,
.settings-panel input[type="email"]:focus,
.settings-panel input[type="password"]:focus,
.settings-panel input[type="url"]:focus,
.settings-panel textarea:focus,
.settings-panel select:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 2px rgba(var(--primary-color-light-rgb), 0.35);
}

.settings-panel input[type="color"] {
    width: 100%;
    padding: var(--space-1);
    height: calc(var(--font-size-sm) * var(--line-height-base) + (2 * var(--space-2)) + 2px + (2 * var(--space-1)));
    min-height: 38px;
    cursor: pointer;
    margin-bottom: var(--space-4);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-color);
    background-color: var(--input-background);
}
.settings-panel input[type="color"]::-webkit-color-swatch-wrapper {
    padding: 0;
}
.settings-panel input[type="color"]::-webkit-color-swatch {
    border: none;
    border-radius: calc(var(--radius-sm) - 1px);
}
.settings-panel input[type="color"]::-moz-color-swatch {
    border: none;
    border-radius: calc(var(--radius-sm) - 1px);
}

.settings-panel input[type="file"] {
    padding: var(--space-2);
    font-size: var(--font-size-xs);
    margin-bottom: var(--space-4);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    width: 100%;
}
.settings-panel input[type="file"]::file-selector-button {
    font-family: var(--font-primary);
    font-size: var(--font-size-xs);
    font-weight: 500;
    color: var(--text-on-primary);
    background-color: var(--primary-color);
    border: none;
    padding: var(--space-2) var(--space-3);
    border-radius: var(--radius-sm);
    margin-left: var(--space-3);
    cursor: pointer;
}
.settings-panel input[type="file"]::file-selector-button:hover {
    background-color: var(--primary-color-dark);
}

.settings-panel textarea {
    min-height: 80px;
    resize: vertical;
}

.settings-panel button,
.settings-panel .remove-button {
    display: block;
    width: 100%;
    padding: var(--space-3) var(--space-4);
    font-family: var(--font-primary);
    font-size: var(--font-size-sm);
    font-weight: 600;
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    text-align: center;
    margin-top: var(--space-3);
    margin-bottom: var(--space-4);
}

.settings-panel button {
    background-color: var(--primary-color);
    color: var(--text-on-primary);
}
.settings-panel button:hover {
    background-color: var(--primary-color-dark);
}
.settings-panel button:active {
    transform: translateY(1px);
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

.settings-panel .remove-button {
    background-color: var(--accent-error);
    color: var(--text-on-primary);
}
.settings-panel .remove-button:hover {
    background-color: #D32F2F;
}
.settings-panel .remove-button:active {
    transform: translateY(1px);
    box-shadow: inset 0 1px 2px rgba(0,0,0,0.1);
}

/* Elements Panel Items */
.elements-panel .form-element {
    display: flex;
    align-items: center;
    padding: var(--space-2) var(--space-3);
    background-color: var(--input-background);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    color: var(--text-color-secondary);
    font-weight: 500;
    font-size: var(--font-size-sm);
    cursor: grab;
    margin-bottom: var(--space-2);
    text-align: right;
    box-shadow: var(--shadow-xs);
}
.elements-panel .form-element:hover {
    border-color: var(--primary-color);
    background-color: var(--tertiary-color);
    color: var(--primary-color);
    box-shadow: var(--shadow-sm);
}
.elements-panel .form-element:active {
    cursor: grabbing;
    background-color: var(--primary-color-light);
    color: var(--text-on-primary);
    border-color: var(--primary-color-dark);
}
.elements-panel .form-element svg {
    width: 18px;
    height: 18px;
    margin-right: var(--space-2);
    flex-shrink: 0;
}
html[dir="rtl"] .elements-panel .form-element svg {
    margin-left: var(--space-2);
    margin-right: 0;
}


/* Dropped Elements on Canvas */
.dropped-element-wrapper {
    position: relative;
    margin: var(--space-2) 0;
    border: 1px dashed transparent;
    cursor: move;
    box-sizing: border-box;
    min-height: 30px;
}
.dropped-element-wrapper:hover:not(.selected) {
    border-color: var(--primary-color-light) !important;
    box-shadow: var(--shadow-xs);
}
.dropped-element-wrapper.selected {
    border-color: var(--primary-color) !important;
    box-shadow: var(--shadow-sm), 0 0 0 2px rgba(var(--primary-color-light-rgb), 0.35);
}

.dropped-form-element {
    background-color: var(--input-background);
    display: block;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    pointer-events: none;
    color: var(--text-color-primary);
    font-family: var(--font-primary);
    font-size: var(--font-size-base);
    line-height: var(--line-height-base);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding-top: calc(var(--space-2) + 2px);
    padding-bottom: calc(var(--space-2) + 2px);
    padding-left: var(--space-3);
    padding-right: var(--space-3);
    font-weight: 400;
}
.dropped-element-wrapper input,
.dropped-element-wrapper button,
.dropped-element-wrapper textarea,
.dropped-element-wrapper label,
.dropped-element-wrapper select,
.dropped-element-wrapper span {
    pointer-events: auto;
    cursor: default;
}
input.dropped-form-element::placeholder,
textarea.dropped-form-element::placeholder {
    color: var(--text-color-light);
    opacity: 0.8;
}

select.dropped-form-element {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2016%2016%22%20fill%3D%22currentColor%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20d%3D%22M8%2011.03a.75.75%200%200%201-.53-.22l-4-4a.75.75%200%200%201%201.06-1.06L8%209.19l3.47-3.47a.75.75%200%200%201%201.06%201.06l-4%204a.75.75%200%200%201-.53.22Z%22%20clip-rule%3D%22evenodd%22%2F%3E%3C%2Fsvg%3E');
    background-repeat: no-repeat;
    background-position: left var(--space-3) center;
    background-size: 1em auto;
    padding-left: calc(var(--space-3) + 1.2em + var(--space-3));
    padding-right: var(--space-3);
}

button.dropped-form-element,
.dropped-form-element[type="submit"],
.dropped-form-element[type="button"] {
    background-color: var(--primary-color);
    color: var(--text-on-primary);
    border: none;
    font-weight: 600;
    cursor: pointer;
    text-align: center;
    padding: var(--space-2) var(--space-4);
}
button.dropped-form-element:hover,
.dropped-form-element[type="submit"]:hover,
.dropped-form-element[type="button"]:hover {
    background-color: var(--primary-color-dark);
}

label.dropped-form-element {
    background-color: transparent;
    border: none;
    padding: var(--space-1) 0;
    pointer-events: auto;
    cursor: default;
    color: var(--text-color-primary);
    font-weight: 500;
}

.dropped-element-wrapper label .dropped-form-element[type="checkbox"],
.dropped-element-wrapper label .dropped-form-element[type="radio"] {
    width: auto;
    height: auto;
    margin-left: var(--space-2);
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    border: none;
    padding: 0;
    background-color: transparent;
    accent-color: var(--primary-color);
}
.dropped-element-wrapper label span {
    vertical-align: middle;
    color: var(--text-color-primary);
    font-size: var(--font-size-base);
    pointer-events: auto;
    cursor: pointer;
    /* line-height: var(--line-height-base); /* Ensure line height if needed */
}


/* Resize Handles (Interact.js) */
.interact-resize-handle {
    background-color: var(--primary-color);
    border: 1px solid var(--text-on-primary);
    border-radius: 50%;
    width: 10px;
    height: 10px;
    box-sizing: border-box;
    z-index: 101;
    opacity: 0.75;
}
.interact-resize-handle:hover {
    opacity: 1;
    transform: scale(1.2);
}


/* Styles that were previously more general or specific to settings panel, now scoped or adjusted */
.highlight-zone {
    border: 2px dashed var(--primary-color);
    background-color: rgba(var(--primary-color-light-rgb), 0.1);
}
.background-config-section {
    border: 1px solid var(--tertiary-color);
    padding: var(--space-3);
    margin-top: var(--space-3);
    border-radius: var(--radius-md);
}
.settings-panel #icon-upload-input {
    display: block;
    margin-bottom: var(--space-3);
    font-size: var(--font-size-sm);
}
#uploaded-icons-palette {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-2);
    padding: var(--space-2);
    background-color: var(--tertiary-color);
    border-radius: var(--radius-md);
    margin-top: var(--space-2);
    min-height: 50px;
    border: 1px solid var(--border-color);
    max-height: 200px;
    overflow-y: auto;
}
#uploaded-icons-palette .palette-icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    cursor: grab;
    border: 1px solid var(--border-color);
    background-color: var(--background-main);
    padding: var(--space-1);
    border-radius: var(--radius-sm);
}
.draggable-icon {
    position: absolute;
    cursor: move;
    z-index: 100;
    border: 1px dashed transparent;
    box-sizing: border-box;
}
.draggable-icon:hover, .draggable-icon.selected-icon {
    border-color: var(--primary-color);
    box-shadow: var(--shadow-sm), 0 0 0 2px rgba(var(--primary-color-light-rgb), 0.35);
}
.draggable-icon.selected-icon {
     border-color: var(--primary-color-dark) !important;
}
.draggable-icon img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    pointer-events: none;
}

.settings-panel .save-button.saved {
    background-color: var(--accent-success) !important;
}

/* Preview Mode Styles */
body.preview-mode .settings-panel,
body.preview-mode .elements-panel {
    display: none !important;
}

body.preview-mode .form-preview-area {
    width: 100% !important;
    max-width: 100% !important;
    height: 100vh !important;
    padding: var(--space-6) !important;
    justify-content: center;
}

body.preview-mode .login-form-canvas {
    margin-top: 0;
}

#exit-preview-button {
    position: fixed;
    top: var(--space-4);
    z-index: 1001;
    padding: var(--space-2) var(--space-4);
    background-color: var(--primary-color);
    color: var(--text-on-primary);
    border: none;
    border-radius: var(--radius-md);
    cursor: pointer;
    box-shadow: var(--shadow-md);
    display: none;
}

html[dir="ltr"] #exit-preview-button {
     right: var(--space-4);
}
html[dir="rtl"] #exit-preview-button {
     left: var(--space-4);
}

body.preview-mode #exit-preview-button {
    display: block;
}

[end of front/style.css]

[end of front/style.css]

[end of front/style.css]

[end of front/style.css]
