import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { MakeRequest } from './modules/http';
import '/src/modules/LogIn.ts'
import '/src/modules/Header.ts'
import { reloadProducts, reloadMainSwiper, setPage } from './modules/ui';
import { Product } from './modules/types';

const http = new MakeRequest()

let user = JSON.parse(localStorage.getItem('user') || '[]')
if (user.length === 0) {
    user = null
}


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
    window.scrollTo(0, 0);
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

let swiper_main_wrapper = document.querySelector('.swiper-wrapper') as HTMLDivElement
let top_rated_grid = document.querySelector('.top_rated_grid') as HTMLDivElement
let for_pc_grid = document.querySelector('.for_pc_grid') as HTMLDivElement
let furniture_grid = document.querySelector('.furniture_grid') as HTMLDivElement
let audio_grid = document.querySelector('.audio_grid') as HTMLDivElement

http.getData('/goods')
    .then(res => {
        let filtered: Array<Product> = []
        res.data.filter((elem: Product) => {
            if (elem.rating > 4.8) filtered.push(elem)
        })
        reloadMainSwiper({ arr: filtered, place: swiper_main_wrapper })
        reloadProducts({ arr: filtered.slice(0, 10), place: top_rated_grid })

        new Swiper('.swiper', {

            direction: 'horizontal',
            loop: true,
            autoplay: {
                delay: 4000
            },
        
            pagination: {
                el: '.swiper-pagination',
            },
        
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    })

    setPage()

http.getData('/goods?type=PC')
    .then(res => {
        reloadProducts({ arr: res.data, place: for_pc_grid })
    })
http.getData('/goods?type=furniture')
    .then(res => {
        reloadProducts({ arr: res.data, place: furniture_grid })
    })
http.getData('/goods?type=audio')
    .then(res => {
        reloadProducts({ arr: res.data, place: audio_grid })
    })

