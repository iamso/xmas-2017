// current script src dir
const src = [].slice.call(document.querySelectorAll('script'), 0).pop().src.replace(/\/[^\/]+$/, '');

// demonstrate javascript support
const html = document.documentElement;
html.classList.remove('no-js');
html.classList.add('js');

// check for Promise support
!!window.Promise || document.write(`<script src="${src}/vendor/promise.min.js"><\/script>`);

// check for Object.assign support
!!window.Object.assign || document.write(`<script src="${src}/vendor/object.assign.js"><\/script>`);
