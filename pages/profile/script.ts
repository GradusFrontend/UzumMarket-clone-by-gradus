import '/src/modules/Header.ts'
import '/src/modules/LogIn.ts'
import { MakeRequest } from '../../src/modules/http.ts';
import { reloadOrders } from '../../src/modules/ui.ts';

const http = new MakeRequest()

let user = JSON.parse(localStorage.getItem('user') || '[]')
if (user.length === 0) {
    user = null
}

if(!user) {
    location.assign('/')
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

const orders_wrap = document.querySelector('.orders') as HTMLDivElement
const user_section = document.querySelector('.user_section') as any
const empty_orders = document.querySelector('.empty_orders') as HTMLDivElement

http.getData('/orders?user_id' + user.id)
    .then((res: any) => {
        if(res.data.length > 0) {
            reloadOrders(res.data, orders_wrap)
        } else {
            user_section.classList.add('hiden')
            empty_orders.classList.remove('hiden')
        }
    })

const editUserModal = document.querySelector('.editUserModal') as HTMLDialogElement
const closeEditModalBtn = document.querySelector('.closeEditModalBtn') as HTMLButtonElement
const changeUserDataBtn = document.querySelector('.changeUserDataBtn') as HTMLButtonElement
const edit_user_form = document.forms.namedItem('edit_user_form') as HTMLFormElement

const name_inp = edit_user_form.querySelector('#editName') as HTMLInputElement
const surname_inp = edit_user_form.querySelector('#editSurname') as HTMLInputElement
const email_inp = edit_user_form.querySelector('#editEmail') as HTMLInputElement
const password_inp = edit_user_form.querySelector('#editPassword') as HTMLInputElement

changeUserDataBtn.onclick = () => editUserModal.showModal()

closeEditModalBtn.onclick = () => {
    editUserModal.classList.replace('translateFade', 'translateFadeClose')

    setTimeout(() => {
        editUserModal.classList.replace('translateFadeClose', 'translateFade')
        editUserModal.close()
    }, 900)
}

name_inp.value = user.name
surname_inp.value = user.surname
email_inp.value = user.email

