import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';
import { MakeRequest } from '../../src/modules/http';
import '/src/modules/LogIn.ts'
import '/src/modules/Header.ts'
import { reloadProducts, reloadSwiperImages, setPage, toaster } from '../../src/modules/ui';

const http = new MakeRequest()

let user = JSON.parse(localStorage.getItem('user') || '[]')
if (user.length === 0) {
    user = null
}

const prodSearch: any = location.search.split('=')
const prodId = prodSearch.at(-1)

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

new Swiper('.product_swiper', {

    direction: 'horizontal',
    loop: true,

    pagination: {
        el: '.swiper-pagination',
    },

    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
});

setPage()

const swiper_wrapper = document.querySelector('.swiper-wrapper') as HTMLDivElement
const product_title = document.querySelector('.product_title') as HTMLHeadingElement
const product_price_total = document.querySelector('.product_price_total') as HTMLHeadingElement
const product_price_first = document.querySelector('.product_price_first') as HTMLHeadingElement
const product_description = document.querySelector('.product_description') as HTMLParagraphElement
const full_desc_p = document.querySelector('.full_desc_p') as HTMLParagraphElement
const similar_wrap = document.querySelector('.similar_wrap') as HTMLDivElement
const add_to_cart_btn = document.querySelector('.add_to_cart_btn') as HTMLButtonElement
const add_to_wishes_btn = document.querySelector('.add_to_wishes_btn') as HTMLButtonElement
const decrease = document.querySelector('.decrease') as HTMLButtonElement
const increase = document.querySelector('.increase') as HTMLButtonElement
const count_view = document.querySelector('#count') as HTMLSpanElement

http.getData('/goods/' + prodId)
    .then(res => {
        reloadSwiperImages(res.data.media, swiper_wrapper)
        product_title.innerHTML = res.data.title
        product_price_total.innerHTML = `${res.data.salePercentage ? Number((res.data.price - (res.data.price / 100 * res.data.salePercentage)).toFixed()).toLocaleString() : res.data.price.toLocaleString('ru')} сум`
        if (res.data.salePercentage) {
            product_price_first.classList.remove('hiden')
            product_price_first.innerHTML = res.data.price.toLocaleString() + ' сум'
        }
        product_description.innerHTML = res.data.description.slice(0, 300) + '...'
        full_desc_p.innerHTML = res.data.description

        let count: any = 1
        decrease.onclick = () => {
            if (count > 1) {
                count--
                count_view.innerHTML = count
            }
        }

        increase.onclick = () => {
            if (count < 100) {
                count++
                count_view.innerHTML = count
            }
        }

        if (user) {
            http.getData(`/wishes?user_id=${user.id}&product_id=${res.data.id}`)
                .then((res: any) => {
                    if (res.data.length === 1) {
                        add_to_wishes_btn.classList.add('liked')
                        add_to_wishes_btn.innerHTML = 'Удалить с избранного'
                    } else if (res.data.length === 0) {
                        add_to_wishes_btn.innerHTML = 'Добавить в избранное'
                    }
                })

            http.getData(`/carts?user_id=${user.id}&product_id=${res.data.id}`)
                .then((res: any) => {
                    if (res.data.length === 1) {
                        add_to_cart_btn.classList.add('inCart')
                    }
                })
        }

        add_to_wishes_btn.onclick = () => {
            if (user) {
                if (!add_to_wishes_btn.classList.contains('liked')) {
                    http.postData('/wishes', {
                        user_id: user.id,
                        product_id: res.data.id,
                        product: res.data
                    })
                        .then((res: { status: number; }) => {
                            if (res.status === 200 || res.status === 201) {
                                add_to_wishes_btn.classList.add('liked')
                                add_to_wishes_btn.innerHTML = 'Удалить с избранного'
                            }
                        })

                } else {
                    http.getData(`/wishes?user_id=${user.id}&product_id=${res.data.id}`)
                        .then((res: any) => {
                            http.deleteData(`/wishes/${res.data[0].id}`)
                                .then(() => {
                                    add_to_wishes_btn.classList.remove('liked')
                                    add_to_wishes_btn.innerHTML = 'Добавить в избранное'
                                })
                        })
                }

            } else {
                toaster('Войдите в аккаунт!', 'error')
            }
        }

        add_to_cart_btn.onclick = () => {
            if (user) {

                if (!add_to_cart_btn.classList.contains('inCart')) {
                    http.postData('/carts', {
                        user_id: user.id,
                        product_id: res.data.id,
                        count: count,
                        product: res.data
                    })
                        .then((res: { status: number; }) => {
                            if (res.status === 200 || res.status === 201) {
                                add_to_cart_btn.classList.add('inCart')
                                toaster('Добавлено!', 'massage')
                            }
                        })
                } else {
                    toaster('Уже в корзине!', 'error')
                }
            } else {
                toaster('Войдите в аккаунт!', 'error')
            }
        }

        http.getData('/goods?type=' + res.data.type)
            .then(res => reloadProducts({ arr: res.data, place: similar_wrap }))
    })