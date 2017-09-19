const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

Node.prototype.on = window.on = function(name, fn) {
    this.addEventListener(name, fn);
}

NodeList.prototype.__proto__ = Array.prototype;

NodeList.prototype.on = NodeList.prototype.addEventListener = function(name, fn) {
    this.forEach((el) => {
        el.on(name, fn);
    });
}

export {$, $$};
