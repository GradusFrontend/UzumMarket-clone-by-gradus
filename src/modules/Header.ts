import { MakeRequest } from "./http"
import { reloadCatalog } from "./ui"

const http = new MakeRequest()

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



