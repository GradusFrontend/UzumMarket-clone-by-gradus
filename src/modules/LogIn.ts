import { MakeRequest } from "./http"
import moment from 'moment';
import { userType } from "./types";
import { toaster } from "./ui";

const http = new MakeRequest()

let user = JSON.parse(localStorage.getItem('user') || '[]')
if (user.length === 0) {
    user = null
}

const profile_tab = document.querySelector('.profile_tab') as HTMLLinkElement
const profile_btn = document.querySelector('.profile_btn') as HTMLLinkElement
const profile_btn_text: any = profile_btn.querySelector('h4')
const profile_tab_text: any = profile_tab.querySelector('h3')
const loginModal = document.querySelector('.signUp-signIn_modal') as HTMLDialogElement
const closeModalBtn = loginModal.querySelector('.closeModalBtn') as HTMLButtonElement
const signUp_wrap = loginModal.querySelector('.signUp_wrap') as HTMLDivElement
const signIn_wrap = loginModal.querySelector('.signIn_wrap') as HTMLDivElement
const openSignInForm = loginModal.querySelector('.openSignInForm') as HTMLButtonElement
const openSignUpForm = loginModal.querySelector('.openSignUpForm') as HTMLButtonElement

closeModalBtn.onclick = () => {
    loginModal.classList.replace('translateFade', 'translateFadeClose')

    setTimeout(() => {
        loginModal.classList.replace('translateFadeClose', 'translateFade')
        loginModal.close()
    }, 900)
}
openSignUpForm.onclick = () => {
    signUp_wrap.classList.remove('hiden')
    signIn_wrap.classList.add('hiden')
}
openSignInForm.onclick = () => {
    signIn_wrap.classList.remove('hiden')
    signUp_wrap.classList.add('hiden')
}


if (user) {
    profile_tab_text.innerHTML = user.name
    profile_btn_text.innerHTML = user.name
    profile_btn.onclick = () => profile_btn.href = '/pages/profile/'
    profile_tab.onclick = () => profile_tab.href = '/pages/profile/'
} else {
    profile_tab_text.innerHTML = "Войти"
    profile_btn_text.innerHTML = "Войти"

    profile_btn.onclick = () => loginModal.showModal()
    profile_tab.onclick = () => loginModal.showModal()
}

const signUp_form = document.forms.namedItem('signUp_form') as HTMLFormElement
const signIn_form = document.forms.namedItem('signIn_form') as HTMLFormElement

signUp_form.onsubmit = (e) => {
    e.preventDefault()

    let fm = new FormData(signUp_form)
    let user = {
        created_at: moment().format('dddd, D MMM YYYY [г.] B HH:mm'),
        updated_at: moment().format('dddd, D MMM YYYY [г.] B HH:mm'),
        name: fm.get('name'),
        surname: fm.get('surname'),
        email: fm.get('email'),
        password: fm.get('password')
    }

    http.getData('/users?email=' + user.email)
        .then(res => {
            if (res.data.length > 0) {
                toaster('Аккаунт уже существует', 'error')
                return
            }
            http.postData('/users', user)
                .then(res => {
                    if (res.status === 200 || res.status === 201) {
                        localStorage.setItem('user', JSON.stringify(user))
                        location.reload()
                    }
                })
        })
}
