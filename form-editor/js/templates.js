// Defines available form templates

const templates = {
    simpleLogin: {
        name: "ورود ساده",
        id: "simpleLogin",
        html: `
            <div class="form-template" id="simple-login-form">
                <h3>فرم ورود ساده</h3>
                <div class="form-group draggable-item" data-element-type="textInput" id="sl-email-group">
                    <label for="sl-email">ایمیل:</label>
                    <input type="email" id="sl-email" name="email" placeholder="ایمیل خود را وارد کنید">
                </div>
                <div class="form-group draggable-item" data-element-type="passwordInput" id="sl-password-group">
                    <label for="sl-password">رمز عبور:</label>
                    <input type="password" id="sl-password" name="password" placeholder="رمز عبور خود را وارد کنید">
                </div>
                <div class="form-group draggable-item" data-element-type="button" id="sl-button-group">
                    <button type="submit">ورود</button>
                </div>
            </div>
        `
    },
    modernMinimal: {
        name: "مدرن مینیمال",
        id: "modernMinimal",
        html: `
            <div class="form-template modern-minimal-theme" id="modern-minimal-form">
                <h3>ورود / ثبت نام</h3>
                <p class="tagline">به پلتفرم ما خوش آمدید</p>
                <div class="form-group draggable-item" data-element-type="textInput" id="mm-email-group">
                    {/* No direct <label>, placeholder serves this role. Property editor can add/edit <label> if desired. */}
                    <input type="email" id="mm-email" name="email" placeholder="آدرس ایمیل">
                </div>
                <div class="form-group draggable-item" data-element-type="passwordInput" id="mm-password-group">
                    <input type="password" id="mm-password" name="password" placeholder="رمز عبور">
                </div>
                <div class="form-group options" id="mm-options-group"> {/* Not draggable/editable as a single 'element' */}
                    <label class="checkbox-label"><input type="checkbox" name="remember"> مرا به خاطر بسپار</label>
                    <a href="#" class="forgot-password">فراموشی رمز؟</a>
                </div>
                <div class="form-group draggable-item" data-element-type="button" id="mm-submit-button-group">
                    <button type="submit" class="button-primary">ورود</button>
                </div>
                <div class="social-login" id="mm-social-group"> {/* Not draggable/editable */}
                    <p>یا ورود با</p>
                    <button type="button" class="social-button google">Google</button>
                    <button type="button" class="social-button facebook">Facebook</button>
                </div>
                <div class="form-footer" id="mm-footer-group">
                    حساب کاربری ندارید؟ <a href="#">ثبت نام کنید</a>
                </div>
            </div>
        `
    },
    imageFocus: {
        name: "با تاکید بر تصویر",
        id: "imageFocus",
        html: `
            <div class="form-template image-focus-theme" id="image-focus-form">
                <div class="image-side" id="if-image-side">
                    <h2>بهترین انتخاب شما</h2>
                    <p>با ما به اهداف خود برسید.</p>
                </div>
                <div class="form-side" id="if-form-side">
                    <h3>ورود به حساب</h3>
                    <div class="form-group draggable-item" data-element-type="textInput" id="if-email-group">
                        <label for="if-email">نام کاربری یا ایمیل</label>
                        <input type="text" id="if-email" name="username" placeholder="نام کاربری">
                    </div>
                    <div class="form-group draggable-item" data-element-type="passwordInput" id="if-password-group">
                        <label for="if-password">رمز عبور</label>
                        <input type="password" id="if-password" name="password" placeholder="رمز عبور">
                    </div>
                    <div class="form-group draggable-item" data-element-type="button" id="if-button-group">
                        <button type="submit" class="button-primary">ادامه</button>
                    </div>
                    <div class="form-footer" id="if-footer-group">
                        <a href="#">مشکل در ورود؟</a>
                    </div>
                </div>
            </div>
        `
    },
    darkSleek: {
        name: "تیره و شیک",
        id: "darkSleek",
        html: `
            <div class="form-template dark-sleek-theme" id="dark-sleek-form">
                <div class="form-header" id="ds-header-group">
                    <h2>خوش آمدید</h2>
                    <p>برای ادامه وارد شوید</p>
                </div>
                <div class="form-group draggable-item" data-element-type="textInput" id="ds-email-group">
                    {/* Placeholder acts as visual label. Property editor could add <label> for accessibility. */}
                    <input type="email" id="ds-email" name="email" placeholder="ایمیل">
                    <span class="input-icon">📧</span>
                </div>
                <div class="form-group draggable-item" data-element-type="passwordInput" id="ds-password-group">
                    <input type="password" id="ds-password" name="password" placeholder="رمز عبور">
                    <span class="input-icon">🔒</span>
                </div>
                {/* The action-group contains a button and a link. We make the whole group "button" type,
                    meaning property editor will target the <button> inside it primarily.
                    The link is auxiliary and not directly editable via current props. */}
                <div class="form-group action-group draggable-item" data-element-type="button" id="ds-action-group">
                    <button type="submit" class="button-primary">ورود</button>
                    <a href="#" class="link-button">ایجاد حساب جدید</a>
                </div>
            </div>
        `
    }
};
// console.log("js/templates.js reviewed and updated for editor compatibility."); // Reduced noise
