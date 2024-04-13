import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

const body = document.body as HTMLBodyElement
const openCatalogBtn = document.querySelector('.catalog_btn') as HTMLButtonElement
const catalog = document.querySelector('.catalog_body') as HTMLDivElement
const backdrop = document.querySelector('.backdrop') as HTMLDivElement

openCatalogBtn.onclick = () => {
    if (!openCatalogBtn.classList.contains('active_catalog')) {
        openCatalogBtn.classList.add('active_catalog')
        backdrop.classList.remove('hiden')
        catalog.classList.remove('hiden')
        body.style.height = '100vh'
        body.style.overflowY = 'hidden'
    } else {
        openCatalogBtn.classList.remove('active_catalog')
        backdrop.classList.add('hiden')
        catalog.classList.add('hiden')
        body.style.height = '100%'
        body.style.overflowY = 'visible'
    }
}


new Swiper('.product_swiper', {

    direction: 'horizontal',
    loop: true,
    // autoplay: {
    //     delay: 4000
    // },

    pagination: {
        el: '.swiper-pagination',
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});


const appSearchInp = document.querySelector('#app_query') as HTMLInputElement
const app_search_active_wrap = document.querySelector('.search_active_wrap') as HTMLDivElement
const return_btn = document.querySelector('.return') as HTMLButtonElement
const catalog_tab = document.querySelector('.catalog_tab') as HTMLLinkElement


appSearchInp.onfocus = () => {
    return_btn.classList.remove('hiden')
    app_search_active_wrap.classList.remove('hiden')
    body.style.height = '100vh'
    body.style.overflowY = 'hidden'
}

catalog_tab.onclick = () => {
    catalog_tab.classList.add('active_tab')
    return_btn.classList.remove('hiden')
    app_search_active_wrap.classList.remove('hiden')
    body.style.height = '100vh'
    body.style.overflowY = 'hidden'
}

return_btn.onclick = () => {
    catalog_tab.classList.remove('active_tab')
    return_btn.classList.add('hiden')
    app_search_active_wrap.classList.add('hiden')
    body.style.height = '100%'
    body.style.overflowY = 'visible'
}

