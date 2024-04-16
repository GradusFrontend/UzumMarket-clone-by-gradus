export function toaster(text:any, type:string) {
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