import { MakeRequest } from "./http"
import { reloadCatalog, reloadProdResults } from "./ui"
import { Product } from "./types"

const http = new MakeRequest()

let user = JSON.parse(localStorage.getItem('user') || '[]')
if (user.length === 0) {
    user = null
}

const catalog_wrap = document.querySelector('.catalog') as HTMLDivElement

http.getData('/goods')
    .then(res => {
        let categoriesTitles: any = []

        res.data.forEach((elem: { type: any }) => {
            if (!categoriesTitles.includes(elem.type)) {
                categoriesTitles.push(elem.type)
            }
        })
        
        reloadCatalog(categoriesTitles, catalog_wrap)
    })

const search_inp = document.querySelector('#search_inp') as HTMLInputElement
const search_btn = document.querySelector('.search_btn') as HTMLButtonElement
const app_query = document.querySelector('#app_query') as HTMLInputElement
const product_results = document.querySelector('.product_results') as HTMLDivElement

search_btn.onclick = () => {
    if(search_inp.value) {
        location.assign('/pages/search/?query=' + search_inp.value)
    }
}

app_query.onkeyup = (e: any) => {
    console.log(e.target.value);
    
    http.getData('/goods')
        .then((res: any) => {
            let filtered = res.data.filter((elem: Product) => elem.title.toLowerCase().includes(e.target.value.toLowerCase()))
            
            reloadProdResults({arr: filtered, place: product_results})
        })
}

const cart_count = document.querySelector('.cart_count') as HTMLSpanElement
const wishes_count = document.querySelector('.wishes_count') as HTMLSpanElement

http.getData('/wishes?user_id=' + user.id)
    .then(res => wishes_count.innerHTML = res.data.length)
http.getData('/carts?user_id=' + user.id)
    .then(res => cart_count.innerHTML = res.data.length)
