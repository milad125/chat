// Defines draggable form elements
const formElements = {
    textInput: {
        name: "ورودی متن",
        type: "textInput",
        htmlRepresentation: '<div class="form-element-placeholder">ورودی متن</div>', // For palette
        getFormHtml: (id) => `<div class="form-group draggable-item" data-element-type="textInput"><label for="${id}">برچسب جدید:</label><input type="text" id="${id}" name="${id}" placeholder="مقدار ورودی"></div>`
    },
    passwordInput: {
        name: "ورودی رمز عبور",
        type: "passwordInput",
        htmlRepresentation: '<div class="form-element-placeholder">ورودی رمز عبور</div>', // For palette
        getFormHtml: (id) => `<div class="form-group draggable-item" data-element-type="passwordInput"><label for="${id}">رمز عبور:</label><input type="password" id="${id}" name="${id}" placeholder="رمز عبور"></div>`
    },
    button: {
        name: "دکمه",
        type: "button",
        htmlRepresentation: '<div class="form-element-placeholder">دکمه</div>', // For palette
        getFormHtml: (id) => `<div class="form-group draggable-item" data-element-type="button"><button type="button" id="${id}">دکمه جدید</button></div>`
    },
    label: {
        name: "برچسب",
        type: "label",
        htmlRepresentation: '<div class="form-element-placeholder">برچسب</div>', // For palette
        getFormHtml: (id) => `<div class="form-group draggable-item" data-element-type="label"><label id="${id}">متن برچسب</label></div>`
    }
    // More elements can be added later
};

// Make formElements available (similar to templates.js)
// For now, app.js will access this 'formElements' variable.
