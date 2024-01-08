/* eslint-disable no-unused-vars */

export const qs = (selector, parent = document) => {
    return parent.querySelector(selector);
};

export const qsa = (selector, parent = document) => {
    return parent.querySelectorAll(selector);
};

export const gid = (id) => {
    return document.getElementById(id);
};

export const listen = (el, ev, fn) => {
    el.addEventListener(ev, fn, false);
};

// export const listenOnce = (el, ev, fn) => {
//     el.addEventListener(ev, function listener(e) {
//         e.target.removeEventListener(e.type, listener);
//         return fn.call(this, e);
//     }, {once: true});
// };

// export const listenAll = (el, s, fn) => {
//     s.split(',').forEach((e) => {
//         return el.addEventListener(e, fn, false);
//     });
// };

export const trigger = (el, event) => {
    el.dispatchEvent(event);
};

// export const triggerAll = (el, eventList = []) => {
//     eventList.forEach((event) => {
//         el.dispatchEvent(event);
//     });
// };

export const insertHTML = (el, html, p = 'beforeend') => {
    el.insertAdjacentHTML(p, html);
};

export const getAtt = (el, name) => {
    return el.getAttribute(name);
};

export const setAtt = (el, name, val) => {
    return el.setAttribute(name, val);
};

// export const getValByName = (el, name) => {
//     return getAtt(qs(`[name=${name}]`, el), 'value').trim();
// };

// export const prev = (el, selector) => {
//     const prevEl = el.previousElementSibling;
//     if (!selector || (prevEl && prevEl.matches(selector))) {
//         return prevEl;
//     }
//     return null;
// };

export const isDefined = (el) => {
    return ((Array.isArray(el)) && (el.length !== 0)) || ((typeof (el) !== 'undefined') && (el !== null));
};

export const simpleMerge = (a, b) => {
    return {...a, ...b};
};

// export const getSupportedPropertyName = (properties) => {
//     for (let i = 0; i < properties.length; i++) {
//         if (typeof document.body.style[properties[i]] !== 'undefined') {
//             return properties[i];
//         }
//     }
//     return null;
// };

// export const getRandomInt = (max) => {
//     return Math.floor(Math.random() * Math.floor(max));
// };

// export const detach = (el) => {
//     return el.parentElement.removeChild(el);
// };

// export const closest = (el, selector) => {
//     const matchesSelector = el.matches || el.mozMatchesSelector || el.msMatchesSelector;
//     while (el) {
//         if (matchesSelector.call(el, selector)) {
//             return el;
//         } else {
//             el = el.parentElement;
//         }
//     }
//     return null;
// };

// export const getScrollbarWidth = () => {
//     return window.innerWidth - document.documentElement.clientWidth;
// };

export const getCookie = (name) => {
    const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
    return v ? v[2] : null;
};

export const setCookie = (name, value, days) => {
    const d = new Date();
    d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
    document.cookie = name + '=' + value + ';path=/;expires=' + d.toGMTString();
};

export const deleteCookie = (name) => {
    setCookie(name, '', -1);
};

// export const getCssVariable = (name) => {
//     return getComputedStyle(document.documentElement).getPropertyValue(name);
// };

// export const isInViewport = (el) => {
//     const rect = el.getBoundingClientRect();
//     return (
//         rect.top >= 0 &&
//         rect.left >= 0 &&
//         rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
//         rect.right <= (window.innerWidth || document.documentElement.clientWidth)
//     );
// };

// export const isAboveViewport = (el) => {
//     return el.getBoundingClientRect().bottom > 0;
// };

// export const isBelowViewport = (el) => {
//     return el.getBoundingClientRect().bottom < 0;
// };

// export const throttle = (fn, delay = 600) => {
//     let time = Date.now();
//     return () => {
//         if ((time + delay - Date.now()) <= 0) {
//             fn();
//             time = Date.now();
//         }
//     };
// };

// export const debounce = (fn, wait = 600) => {
//     return () => {
//         let context = this;
//         let later = () => {
//             fn.apply(context, arguments);
//         };
//     };
// };

// export const setSameElementsHeight = (selectorsList = [], widthLimit = 992) => {
//     const {innerWidth} = window;
//     for (const selectors of selectorsList) {
//         const [elemA, elemB] = document.querySelectorAll(selectors); /* only two */
//         const max = Math.max(elemA.offsetHeight, elemB.offsetHeight);
//         const height = ((innerWidth < widthLimit) ? 'auto' : max + 'px');
//         elemA.style.height = height;
//         elemB.style.height = height;
//     }
// };

export const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
