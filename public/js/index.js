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

    const handleTableSearch = () => {
        const search = $('.search-input');
        
        if(search) {
            const submit = $('.search-submit');

            if(window.localStorage && localStorage.getItem('search-input')) {
                search.value = localStorage.getItem('search-input');
            }

            search.on('keyup', (e) => {
                if(e.keyCode == 13 || e.key == 'Enter') {
                    submit.click();
                } 
            })
            
            submit.on('click', (e) => {
                
                const url = search.getAttribute('data-url');
                $('.search-submit').setAttribute('href', `${url}search=${search.value}`)
                if(window.localStorage)
                    localStorage.setItem('search-input', search.value);
            })
        }   
    }

    handleTableSearch();

    
    const ioCheckboxHandler = () => {
        const checkboxes = $$('.io-checkbox');

        if(checkboxes) {
            checkboxes.forEach(checkbox => {
                checkbox.on('change', () => {
                    checkbox.value = +checkbox.checked;
                })
            });
        }
    }

    ioCheckboxHandler();

    const handleTagForm = () => {
        const tagSelect = $('.tag-select');
        tagSelect.on('input', (e) => {
            const val = e.target.value
            if(val === 'new-tag') {
                // $('.tag-select__wrapper').style.display = 'none';
                $('.tag-color').style.display = 'block';
                $('.tag-name').style.display = 'block';
            } else {
                $('.tag-color').style.display = 'none';
                $('.tag-name').style.display = 'none';
            }
            
        });
    }
    
    handleTagForm();

    window.on('resize', () => {
        adjustPhotoGridHeight();
    })
}