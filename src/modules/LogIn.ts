const profile_tab = document.querySelector('.profile_tab')
const profile_btn = document.querySelector('.profile_btn')

let user = JSON.parse(localStorage.getItem('user') || '[]')
if(user.length === 0) {
    user = null
}

// if(user) {
//     profile_tab && profile_btn.onclick = () =>
// }