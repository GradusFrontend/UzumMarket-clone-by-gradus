import '/src/modules/LogIn.ts'
import '/src/modules/Header.ts'
import { MakeRequest } from '../../src/modules/http.ts';
import { reloadProducts } from '../../src/modules/ui.ts';
import { Product } from '../../src/modules/types.ts';

const http = new MakeRequest()

const query: any = location.search


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

const query_name_text = document.querySelector('.query_name_text') as any
const results = document.querySelector('.results') as HTMLDivElement
const results_wrap = document.querySelector('.results_wrap') as HTMLDivElement
const empty_results = document.querySelector('.empty_results') as HTMLDivElement
const filterForm = document.forms.namedItem('filter') as HTMLFormElement
const form_colors = document.forms.namedItem('form_colors') as HTMLFormElement

let query_sliced: any = query.split('=').at(-1)
let filtered: Array<Product> = []

if (query.startsWith('?category')) {
    query_name_text.innerHTML = query_sliced

    http.getData('/goods?type=' + query_sliced)
        .then(res => {
            reloadProducts({ arr: res.data, place: results })
            filtered = res.data
        })
} else if (query.startsWith('?query')) {
    query_name_text.innerHTML = 'Поиск: ' + query_sliced

    http.getData('/goods?')
        .then(res => {
            filtered = res.data.filter((elem: Product) => elem.title.toLowerCase().includes(query_sliced.toLowerCase()))
            reloadProducts({ arr: filtered, place: results })
            if (filtered.length === 0) {
                empty_results.classList.remove('hiden')
                results_wrap.classList.add('hiden')
            } else {
                empty_results.classList.add('hiden')
                results_wrap.classList.remove('hiden')
            }
        })
}


filterForm.onchange = () => {
    if (filtered.length > 0) {
        priceFilter()
    }
}



form_colors.onchange = () => {
    let colorsArr: any = []
    let fm = new FormData(form_colors)

    fm.forEach((val: any, key: any) => {
        colorsArr.push(key)
    })

    let colorFiltered: Array<Product> = []
    filtered.forEach((item: Product) => {   
        colorsArr.forEach((color: any) => {
            if(item.colors.includes(color)) {colorFiltered.push(item)}
        })
    })
    reloadProducts({ arr: colorFiltered, place: results })
    if (colorFiltered.length === 0) {
        empty_results.classList.remove('hiden')
        results_wrap.classList.add('hiden')
    } else {
        empty_results.classList.add('hiden')
        results_wrap.classList.remove('hiden')
    }
}


function priceFilter() {
    let fm = new FormData(filterForm)
    let filters: any = {
        min: fm.get('filter_range_min'),
        max: fm.get('filter_range_max'),
    }

    let { min, max } = filters

    let priceFiltered: Array<Product> = []
    priceFiltered = filtered.filter((elem: any) => (elem.salePercentage ? (elem.price - (elem.price / 100 * elem.salePercentage)) : elem.price) > +min && (elem.salePercentage ? (elem.price - (elem.price / 100 * elem.salePercentage)) : elem.price) < +max)

    if (priceFiltered.length === 0) {
        empty_results.classList.remove('hiden')
        results_wrap.classList.add('hiden')
    } else {
        empty_results.classList.add('hiden')
        results_wrap.classList.remove('hiden')
    }
    reloadProducts({ arr: priceFiltered, place: results })
}