import { Reload } from "./types";
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
        <h3>${item.salePercentage ? (item.price - (item.price / 100 * item.salePercentage)).toFixed(0).toLocaleString() : item.price.toLocaleString('ru')} сум</h3>
        <p>${item.description}</p>
    </a>
    </div>
    `
  }
}

export function reloadProducts({ arr, place }: Reload) {
  place.innerHTML = ''
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

    if (user) {
      http.getData(`/wishes?user_id=${user.id}&product_id=${item.id}`)
        .then((res: any) => {
          if (res.data.length === 0) {
            likeImg.src = '/public/icons/like-white.svg'
          } else if (res.data.length === 1) {
            likeBtn.classList.add('liked')
            likeImg.src = '/public/icons/like-purple.svg'
          }
        })

      http.getData(`/carts?user_id=${user.id}&product_id=${item.id}`)
        .then((res: any) => {
          if (res.data.length === 1) {
            cartBtn.classList.add('inCart')
          }
        })
    } else {
      likeImg.src = '/public/icons/like-white.svg'
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
    prodPrice.innerHTML = `${item.salePercentage ? (item.price - (item.price / 100 * item.salePercentage)).toFixed(0).toLocaleString() : item.price.toLocaleString('ru')} сум`

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
              }
            })

        } else {
          http.getData(`/wishes?user_id=${user.id}&product_id=${item.id}`)
            .then((res: any) => {
              http.deleteData(`/wishes/${res.data[0].id}`)
                .then(() => {
                  likeBtn.classList.remove('liked')
                  likeImg.src = '/public/icons/like-white.svg'
                })
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
                cartBtn.classList.add('inCart')
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
  }
}

export function reloadCatalog(arr: Array<any>, place: HTMLDivElement) {
  place.innerHTML = ''

  for (let item of arr) {
    place.innerHTML += `
    <a href="/pages/search/?category=${item}" class="category_link">
      ${item}
      <span>товаров 10</span>
    </a>
    `
  }
}

export function reloadProdResults({ arr, place }: Reload) {
  place.innerHTML = ''

  for (let item of arr) {
    place.innerHTML += `
    <a href="/pages/product/?id=${item.id}" class="product_res">
      <img src="/public/icons/search_icon.svg" alt="">
      <h4 class="prod_res_name">${item.title.length > 35 ? item.title.slice(0, 35) + '...' : item.title}</h4>
    </a>
    `
  }
}
export function reloadCategResults({ arr, place }: Reload) {
  place.innerHTML = ''

  for (let item of arr) {
    place.innerHTML += `
    <a href="/pages/product/?id=${item.id}" class="product_res">
      <img src="/public/icons/search_icon.svg" alt="">
      <h4 class="prod_res_name">${item.title.length > 35 ? item.title.slice(0, 35) + '...' : item.title}</h4>
    </a>
    `
  }
}

export function reloadSwiperImages(arr: Array<any>, place: HTMLDivElement) {
  place.innerHTML = ''

  for (let item of arr) {
    place.innerHTML += `
    <div class="swiper-slide">
        <img src="${item}" alt="">
    </div>
    `
  }
}

export function reloadCart(arr: Array<any>, place: HTMLDivElement) {
  place.innerHTML = ''

  const checkout_total_price = document.querySelector('.checkout_total_price') as HTMLHeadingElement
  const total_discount_span = document.querySelector('.total_discount_span') as HTMLSpanElement
  const cart_length_span = document.querySelector('.cart_length_span') as any
  const mobile_order_total = document.querySelector('.mobile_order_total') as HTMLHeadingElement

  let totalDiscount = 0
  let totalPrice = 0
  let cart_length = 0

  for (let item of arr) {
    const cartItem = document.createElement('div')
    const cart_img_wrap = document.createElement('a')
    const cartImg = document.createElement('img')
    const cart_item_info = document.createElement('div')
    const cart_item_name = document.createElement('h3')
    const cart_item_price = document.createElement('h4')
    const cart_item_counter = document.createElement('div')
    const decrease_btn = document.createElement('button')
    const cart_item_count = document.createElement('span')
    const increase_btn = document.createElement('button')
    const cart_item_delete = document.createElement('button')

    cartItem.classList.add('cart_item')
    cart_img_wrap.classList.add('cart_img_wrap')
    cart_item_info.classList.add('cart_item_info')
    cart_item_name.classList.add('cart_item_name')
    cart_item_price.classList.add('cart_item_price')
    cart_item_counter.classList.add('cart_item_counter')
    decrease_btn.classList.add('decrease_btn')
    cart_item_count.classList.add('cart_item_count')
    increase_btn.classList.add('increase_btn')
    cart_item_delete.classList.add('cart_item_delete')

    cartImg.src = item.product.media[0]
    cartImg.alt = item.product.title
    cart_img_wrap.href = '/pages/product/?id=' + item.product_id

    cart_item_name.innerHTML = item.product.title
    cart_item_price.innerHTML = `${item.product.salePercentage ? Number(((item.product.price - (item.product.price / 100 * item.product.salePercentage)) * item.count).toFixed()).toLocaleString() : Number(((item.product.price * item.count).toFixed()))} сум`
    decrease_btn.innerHTML = '-'
    increase_btn.innerHTML = '+'
    cart_item_count.innerHTML = item.count
    cart_item_delete.innerHTML = 'Удалить'

    place.append(cartItem)
    cartItem.append(cart_img_wrap, cart_item_info)
    cart_img_wrap.append(cartImg)
    cart_item_info.append(cart_item_name, cart_item_price, cart_item_counter, cart_item_delete)
    cart_item_counter.append(decrease_btn, cart_item_count, increase_btn)

    // funcs

    totalDiscount += item.product.salePercentage ? (item.product.price / 100 * item.product.salePercentage) * item.count : 0
    totalPrice += item.product.salePercentage ? (item.product.price - (item.product.price / 100 * item.product.salePercentage)) * item.count : item.product.price * item.count
    cart_length = arr.length

    cart_length_span.innerHTML = cart_length
    checkout_total_price.innerHTML = Number(totalPrice.toFixed()).toLocaleString() + ' сум'
    mobile_order_total.innerHTML = Number(totalPrice.toFixed()).toLocaleString() + ' сум'
    total_discount_span.innerHTML = Number(totalDiscount.toFixed()).toLocaleString() + ' сум'

    cart_item_delete.onclick = () => {
      http.deleteData('/carts/' + item.id)
      cartItem.remove()

      totalPrice = totalPrice - (item.product.salePercentage ? (item.product.price - (item.product.price / 100 * item.product.salePercentage)) : item.product.price)
      totalDiscount = totalDiscount - (item.product.salePercentage ? (item.product.price / 100 * item.product.salePercentage) : 0)
      cart_length--
      cart_length_span.innerHTML = cart_length

      checkout_total_price.innerHTML = Number(totalPrice.toFixed()).toLocaleString() + ' сум'
      mobile_order_total.innerHTML = Number(totalPrice.toFixed()).toLocaleString() + ' сум'
      total_discount_span.innerHTML = Number(totalDiscount.toFixed()).toLocaleString() + ' сум'
    }
    // counter

    let count = item.count

    decrease_btn.onclick = () => {
      if (count > 1) {
        count--
        cart_item_count.innerHTML = count

        totalDiscount -= item.product.salePercentage ? (item.product.price / 100 * item.product.salePercentage) : 0
        totalPrice -= item.product.salePercentage ? (item.product.price - (item.product.price / 100 * item.product.salePercentage)) : item.product.price

        setPriceAndPatch()
      }
    }


    increase_btn.onclick = () => {
      if (count < 100) {
        count++
        cart_item_count.innerHTML = count

        totalDiscount += item.product.salePercentage ? (item.product.price / 100 * item.product.salePercentage) : 0
        totalPrice += item.product.salePercentage ? (item.product.price - (item.product.price / 100 * item.product.salePercentage)) : item.product.price

        setPriceAndPatch()
      }
    }


    function setPriceAndPatch() {
      checkout_total_price.innerHTML = Number(totalPrice.toFixed()).toLocaleString() + ' сум'
      mobile_order_total.innerHTML = Number(totalPrice.toFixed()).toLocaleString() + ' сум'
      total_discount_span.innerHTML = Number(totalDiscount.toFixed()).toLocaleString() + ' сум'
      cart_item_price.innerHTML = `${item.product.salePercentage ? Number(((item.product.price - (item.product.price / 100 * item.product.salePercentage)) * count).toFixed()).toLocaleString() : Number(((item.product.price * count).toFixed()))} сум`

      http.patchData('/carts/' + item.id, { count: count })
    }
  }
}