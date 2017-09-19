import '../sass/style.scss';

import {$, $$} from './bling';


window.onload = function () {
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

    const appendFirstLetterToAvatarPlaceholder = () => {
        const placeholders = $$('.avatar--placeholder');
        if(placeholders) {
            placeholders.forEach(placeholder => {
                const firstLetter = placeholder.getAttribute('data-name').charAt(0);
                const firstLetterEl = document.createElement('span');
                firstLetterEl.classList.add('placeholder__letter');
                firstLetterEl.style.lineHeight = `${placeholder.clientHeight}px`;
                firstLetterEl.innerText = firstLetter.toUpperCase();
                placeholder.appendChild(firstLetterEl);
            });
        }
    };

    appendFirstLetterToAvatarPlaceholder();


    const adjustPhotoGridHeight = () => {
        const photos = $$('.photo-grid__photo');
        if(photos) {
            photos.forEach(photo => {
                const width = photo.clientWidth;
                photo.style.height = `${width}px`;
            });
        }
    }

    adjustPhotoGridHeight();

    const toggleNavPanel = () => {
        const toggle = $('.navbar-user-toggle');
        const navPanel = $('.navbar-user-panel');
        // console.log(toggle)
        let flag;
        if(toggle) {
            toggle.on('click', () => {
                flag = !flag;

                if(flag) 
                    navPanel.classList.add('active');
                else 
                    navPanel.classList.remove('active');
            });
        }
    }

    toggleNavPanel();
    
    window.on('resize', () => {
        adjustPhotoGridHeight();
    })
}