import { MakeRequest } from '../../src/modules/http'
import '/src/modules/LogIn.ts'
import '/src/modules/Header.ts'
import { reloadProducts, setPage } from '../../src/modules/ui'
import { Product } from '../../src/modules/types'

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

const wishes_wrap = document.querySelector('.wishes') as HTMLDivElement
const empty_orders = document.querySelector('.empty_orders') as HTMLDivElement
const wishes_section = document.querySelector('.wishes_wrap') as any

if (user) {
    http.getData('/wishes?user_id=' + user.id)
        .then((res: any) => {
            if (res.data.length > 0) {
                empty_orders.classList.add('hiden')
                wishes_section.classList.remove('hiden')
                let wishesArr: Array<Product> = []
                res.data.forEach((elem: any) => wishesArr.push(elem.product))
                reloadProducts({ arr: wishesArr, place: wishes_wrap })
            } else {
                empty_orders.classList.remove('hiden')
            }
        })
}