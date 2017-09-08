import '../sass/style.scss';

import {$, $$} from './bling';


window.onload = function() {

    document.body.scrollTop = document.documentElement.scrollTop = 0;

    /**
     * Removes flash wrapper on 
     * flash message click by ID
     */
    const removeFlashMessage = () => {
        if($('.flash__wrapper')) {
            const flashRemoves = $$('.flash__remove');
            flashRemoves.forEach(remove => {
                remove.on('click', (e) => {
                    const id = e.target.getAttribute('data-flash');
                    $(`.flash__wrapper--${id}`).remove();
                });
            });
        }
    }
    removeFlashMessage();
}