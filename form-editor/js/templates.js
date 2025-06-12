// Defines available form templates

const templates = {
    simpleLogin: {
        name: "ورود ساده",
        html: `
            <div class="form-template" id="simple-login-form">
                <h3>فرم ورود</h3>
                <div class="form-group">
                    <label for="email">ایمیل:</label>
                    <input type="email" id="email" name="email" placeholder="ایمیل خود را وارد کنید">
                </div>
                <div class="form-group">
                    <label for="password">رمز عبور:</label>
                    <input type="password" id="password" name="password" placeholder="رمز عبور خود را وارد کنید">
                </div>
                <div class="form-group">
                    <button type="submit">ورود</button>
                </div>
            </div>
        `
    }
    // Future templates can be added here
};

// Make templates available (e.g., by exporting or attaching to a global object if not using modules yet)
// For simplicity without a module bundler, we can attach it to window or have app.js expect it.
// Let's assume app.js will directly access this 'templates' variable for now,
// or we'll include this script before app.js in index.html.
// For the subtask, we'll modify app.js to use it.
