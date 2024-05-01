import { MakeRequest } from '../../src/modules/http'
import '/src/modules/LogIn.ts'
import '/src/modules/Header.ts'
import { reloadCart, setPage } from '../../src/modules/ui'
import { Product } from '../../src/modules/types'
import moment from 'moment';

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

setPage()

const cart_wrap = document.querySelector('.cart') as HTMLDivElement
const make_order_btns = document.querySelectorAll('.make_order_btn') as NodeList
const cart_section = document.querySelector('.cart_section') as HTMLDivElement
const cart_sum = document.querySelector('.cart_sum') as HTMLDivElement
const empty_cart = document.querySelector('.empty_cart') as HTMLDivElement
const order_accept_modal = document.querySelector('.order_accept_modal') as HTMLDivElement

if (user) {
    http.getData('/carts?user_id=' + user.id)
        .then((res: any) => {
            if (res.data.length > 0) {
                cart_section.classList.remove('hiden')
                cart_sum.classList.remove('hiden')
                empty_cart.classList.add('hiden')
                reloadCart(res.data, cart_wrap)
            } else {
                cart_section.classList.add('hiden')
                cart_sum.classList.add('hiden')
                empty_cart.classList.remove('hiden')
            }
        })

    make_order_btns.forEach((btn: any) => {
        btn.onclick = () => {
            http.getData('/carts?user_id=' + user.id)
                .then(res => {
                    let totalPrice = 0
                    let productsCount = res.data.length
                    let products: Array<object> = []
                    res.data.forEach((item: any) => {
                        totalPrice += item.product.salePercentage ? ((item.product.price - (item.product.price / 100 * item.product.salePercentage)) * item.count) : item.product.price * item.count
                        products.push({
                            count: item.count,
                            total_price: item.product.salePercentage ? Math.round((item.product.price - (item.product.price / 100 * item.product.salePercentage)) * item.count) : item.product.price * item.count,
                            product: item.product
                        })
                    })
                    totalPrice = Math.round(totalPrice)

                    http.postData('/orders', {
                        user_id: user.id,
                        orderPrice: totalPrice,
                        order_count: productsCount,
                        order_date: moment().format('dddd, D MMM YYYY [г.] B HH:mm'),
                        products: products
                    })
                        .then(res2 => {
                            if (res2.status === 200 || res2.status === 201) {
                                res.data.forEach((prod: any) => {
                                    http.deleteData('/carts/' + prod.id)
                                        .then(res => {
                                            order_accept_modal.classList.remove('hiden')
                                        })
                                })
                            }
                        })
                })
        }
    })
} else {
    cart_section.classList.add('hiden')
    cart_sum.classList.add('hiden')
    empty_cart.classList.remove('hiden')
}