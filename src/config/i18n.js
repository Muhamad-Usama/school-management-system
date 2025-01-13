const i18next = require("i18next");
const middleware = require("i18next-http-middleware");
const Backend = require("i18next-fs-backend");
const path = require("path");

i18next
    .use(Backend)                     // Connects the file system backend
    .use(middleware.LanguageDetector) // Enables automatic language detection
    .init({
        backend: {
            loadPath: path.join(process.cwd(), 'src/locales', '{{lng}}', '{{ns}}.json'), // Path to translation files
        }, detection: {
            order: ['querystring', 'cookie'], // Priority: URL query string first, then cookies
            caches: ['cookie'],               // Cache detected language in cookies
        }, fallbackLng: 'en',                   // Default language when no language is detected
        preload: ['en', 'ru'],                 // Default namespace
        saveMissing: true, // Save missing keys to the translation files

    }).then(r => console.log("i18n initialized successfully")).catch(e => console.error(e));

module.exports = {
    i18nMiddleware: middleware.handle(i18next)
};
