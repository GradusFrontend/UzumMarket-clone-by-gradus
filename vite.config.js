import {
    resolve
} from 'path'
import {
    defineConfig
} from 'vite'

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                product: resolve(__dirname, 'pages/product/index.html'),
                wishes: resolve(__dirname, 'pages/wishes/index.html'),
                cart: resolve(__dirname, 'pages/cart/index.html'),
                profile: resolve(__dirname, 'pages/profile/index.html'),
                search: resolve(__dirname, 'pages/search/index.html'),
            },
        },
    },
})