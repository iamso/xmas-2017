/*!
 * xmas-2017
 *
 * Made with ❤ by Steve Ottoz <so@dev.so>
 *
 * Copyright (c) 2017 Steve Ottoz
 */
'use strict';

// current script src dir
var src = [].slice.call(document.querySelectorAll('script'), 0).pop().src.replace(/\/[^\/]+$/, '');

// demonstrate javascript support
var html = document.documentElement;
html.classList.remove('no-js');
html.classList.add('js');

// check for Promise support
!!window.Promise || document.write('<script src="' + src + '/vendor/promise.min.js"></script>');

// check for Object.assign support
!!window.Object.assign || document.write('<script src="' + src + '/vendor/object.assign.js"></script>');