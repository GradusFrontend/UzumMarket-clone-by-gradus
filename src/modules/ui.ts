import { Reload } from "./types";
import { Product } from "./types"
import { MakeRequest } from "./http";
let http: any

setTimeout(() => {
  http = new MakeRequest()
}, 0)

let user = JSON.parse(localStorage.getItem('user') || '[]')
if (user.length === 0) {
  user = null
}

export function toaster(text: any, type: string) {
  const custom_alert = document.createElement('div')
  const time_bar = document.createElement('div')

  custom_alert.classList.add('toaster', `toaster_${type}`)
  custom_alert.classList.add('toaster-anim')
  time_bar.classList.add('time_bar')
  custom_alert.innerHTML = text

  custom_alert.append(time_bar)

  document.body.append(custom_alert)

  setTimeout(() => {
    custom_alert.remove()
  }, 5000)
}

export function reloadMainSwiper({ arr, place }: Reload) {
  place.innerHTML = ''

  for (let item of arr) {
    place.innerHTML += `
    <div class="swiper-slide">
    <a href="/pages/product/?id=${item.id}">
        <h1>${item.title}</h1>
        <h3>${item.salePercentage ? (item.price - (item.price / 100 * item.salePercentage)).toFixed(2).toLocaleString() : item.price.toLocaleString('ru')} сум</h3>
        <p>${item.description}</p>
    </a>
    </div>
    `
  }
}

export function reloadProducts({ arr, place }: Reload) {
  place.innerHTML = ''
  let wishesIds: Array<number> = []
  let cartIds: Array<number> = []

  if (user) {
    http.getData('/wishes?user_id=' + user.id)
      .then((res: { data: { product_id: number; }[]; }) => {
        res.data.forEach(async (prod: { product_id: number; }) => wishesIds.push(prod.product_id))
      })
    http.getData('/carts?user_id=' + user.id)
      .then((res: { data: { product_id: number; }[]; }) => {
        res.data.forEach((prod: { product_id: number; }) => cartIds.push(prod.product_id))
      })

    console.log(wishesIds);
    console.log(cartIds);
  }

  for (let item of arr) {
    const product = document.createElement('div')
    const imgWrap = document.createElement('a')
    const prodImg = document.createElement('img')
    const likeBtn = document.createElement('button')
    const likeImg = document.createElement('img')
    const prodInfo = document.createElement('div')
    const prodName = document.createElement('a')
    const prodPrice = document.createElement('a')
    const cartBtn = document.createElement('button')
    const cartImg = document.createElement('img')

    product.classList.add('product_card')
    prodImg.classList.add('product_img')
    likeBtn.classList.add('product_like_btn')
    prodInfo.classList.add('product_info')
    prodName.classList.add('product_name')
    prodPrice.classList.add('product_price')
    cartBtn.classList.add('add_cart_btn')

    if (wishesIds.includes(item.id)) {
      likeBtn.classList.add('liked')
      likeImg.src = '/public/icons/like-purple.svg'
    } else {
      likeImg.src = '/public/icons/like-white.svg'
    }

    if (cartIds.includes(item.id)) {
      cartBtn.classList.add('inCart')
    }

    imgWrap.href = `/pages/product/?id=${item.id}`
    prodName.href = `/pages/product/?id=${item.id}`
    prodPrice.href = `/pages/product/?id=${item.id}`

    prodImg.src = item.media[0]
    cartImg.src = '/public/icons/add-to-cart.svg'

    prodImg.alt = item.title
    likeImg.alt = 'Лайк'
    cartImg.alt = 'Добавить в корзину'

    prodName.innerHTML = item.title
    prodPrice.innerHTML = `${item.salePercentage ? (item.price - (item.price / 100 * item.salePercentage)).toFixed(2).toLocaleString() : item.price.toLocaleString('ru')} сум`

    place.append(product)
    product.append(imgWrap, likeBtn, prodInfo)
    imgWrap.append(prodImg)
    likeBtn.append(likeImg)
    prodInfo.append(prodName, prodPrice, cartBtn)
    cartBtn.append(cartImg)

    likeBtn.onclick = () => {
      if (user) {

        if (!likeBtn.classList.contains('liked')) {
          http.postData('/wishes', {
            user_id: user.id,
            product_id: item.id,
            product: item
          })
            .then((res: { status: number; }) => {
              if (res.status === 200 || res.status === 201) {
                likeBtn.classList.add('liked')
                likeImg.src = '/public/icons/like-purple.svg'
              } else {
                toaster('Произошла ошибка!', 'error')
              }
            })

        } else {
          http.deleteData(`/wishes?user_id=${user.id}&product_id=${item.id}`)
            .then((res: { status: number; }) => {
              if (res.status === 200 || res.status === 201) {
                likeBtn.classList.remove('liked')
                likeImg.src = '/public/icons/like-white.svg'
              } else {
                toaster('Произошла ошибка!', 'error')
              }
            })
        }
      } else {
        toaster('Войдите в аккаунт!', 'error')
      }
    }

    cartBtn.onclick = () => {
      if (user) {

        if (!cartBtn.classList.contains('inCart')) {
          http.postData('/carts', {
            user_id: user.id,
            product_id: item.id,
            count: 1,
            product: item
          })
            .then((res: { status: number; }) => {
              if (res.status === 200 || res.status === 201) {
                toaster('Добавлено!', 'massage')
                cartBtn.classList.add('inCart')
              } else {
                toaster('Произошла ошибка!', 'error')
              }
            })
        } else {
          toaster('Уже в корзине!', 'error')
        }
      } else {
        toaster('Войдите в аккаунт!', 'error')
      }
    }
  }
}