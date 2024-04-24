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
        prodPrice.innerHTML = `${item.salePercentage ? Number((item.price - (item.price / 100 * item.salePercentage)).toFixed()).toLocaleString() : item.price.toLocaleString('ru')} сум`

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

            totalPrice = totalPrice - (item.product.salePercentage ? (item.product.price - (item.product.price / 100 * item.product.salePercentage)) * count : item.product.price * count)
            totalDiscount = totalDiscount - (item.product.salePercentage ? (item.product.price / 100 * item.product.salePercentage) * count : 0)
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

export function reloadOrders(arr: Array<any>, place: HTMLDivElement) {
    place.innerHTML = ''

    for (let item of arr) {
        const order = document.createElement('div')
        const orderIdBox = document.createElement('div')
        const orderInfo = document.createElement('div')

        const orderAccordeon = document.createElement('div')
        const accordTitle = document.createElement('div')
        const orderProdCount = document.createElement('h3')
        const orderAccordOpenBtn = document.createElement('button')
        const accordeon = document.createElement('div')

        order.classList.add('order')
        orderIdBox.classList.add('id_box')
        orderInfo.classList.add('order_info')
        orderAccordeon.classList.add('order_accordeon')
        accordTitle.classList.add('accord_title')
        orderProdCount.classList.add('order_product_count')
        orderAccordOpenBtn.classList.add('open_accord_btn')
        accordeon.classList.add('accordeon')

        orderIdBox.innerHTML = `<h3>ID заказа <span class="order_id_span">${item.id}</span></h3>`
        orderInfo.innerHTML = `
            <div class="order_row">
                <h4>Дата заказа:</h4>
                <h5>${item.order_date}</h5>
            </div>
        
            <div class="order_row">
                <h4>Количество товаров:</h4>
                <h5>${item.order_count}</h5>
            </div>
        
            <div class="order_row">
                <h4>Сумма заказа:</h4>
                <h5>${Number(item.orderPrice.toFixed()).toLocaleString()} сум</h5>
            </div>
        `

        orderProdCount.innerHTML = 'Товаров: ' + item.order_count
        orderAccordOpenBtn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="#1f2026" xmlns="http://www.w3.org/2000/svg" class="ui-icon  noselect"><path d="M12 16C12.3107 15.9911 12.5948 15.8748 12.8257 15.6243L18.4481 9.8071C18.6435 9.61029 18.75 9.3598 18.75 9.06458C18.75 8.47414 18.2883 8 17.7024 8C17.4183 8 17.143 8.1163 16.9388 8.32206L12.0089 13.4504L7.06116 8.32206C6.85696 8.12524 6.59061 8 6.29763 8C5.71167 8 5.25 8.47414 5.25 9.06458C5.25 9.3598 5.35654 9.61029 5.55186 9.8071L11.1832 15.6243C11.4229 15.8748 11.6893 16 12 16Z"></path></svg>'

        for (let prod of item.products) {
            accordeon.innerHTML += `
            <div class="order_item">
                <div class="image_wrap">
                    <img src="${prod.product.media[0]}" alt="${prod.product.title}">
                </div>
            
                <div class="order_item_info">
                    <div class="order_item_row">
                        <h4>Наименование:</h4>
                        <h5>${prod.product.title}</h5>
                    </div>
            
                    <div class="order_item_row">
                        <h4>Количество:</h4>
                        <h5>${prod.count}</h5>
                    </div>
            
                    <div class="order_item_row">
                        <h4>Стоимость:</h4>
                        <h5>${Number(prod.total_price.toFixed()).toLocaleString()} сум</h5>
                    </div>
                </div>
            </div>
            `
        }

        place.append(order)
        order.append(orderIdBox, orderInfo, orderAccordeon)
        orderAccordeon.append(accordTitle, accordeon)
        accordTitle.append(orderProdCount, orderAccordOpenBtn)

        orderAccordOpenBtn.onclick = () => {
            if(!accordeon.classList.contains('accordeon_active')) {
                accordeon.style.maxHeight = accordeon.scrollHeight + 'px'
            } else {
                accordeon.style.maxHeight = '0px'
            }
            accordeon.classList.toggle('accordeon_active')
            orderAccordOpenBtn.classList.toggle('accrod_open_active')
        }
    }
}
export function setPage() {
    const main_tab = document.querySelector('.main_tab') as HTMLAnchorElement
    const cart_tab = document.querySelector('.cart_tab') as HTMLAnchorElement
    const wishes_tab = document.querySelector('.wishes_tab') as HTMLAnchorElement
    const profile_tab = document.querySelector('.profile_tab') as HTMLAnchorElement

    let pages: any = {
        "/": main_tab,
        "cart": cart_tab,
        "wishes": wishes_tab,
        "profile": profile_tab
    }

    let page = location.pathname.split('/')[2]
    page = page ? page : "/"

    pages[page].classList.add('active_tab')
}