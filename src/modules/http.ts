import axios from 'axios'
import { toaster } from './ui'

export class MakeRequest {
    baseURL = import.meta.env.VITE_BASE_URL

    async getData(path:string) {
        try {
            const res = await axios.get(this.baseURL + path)

            if(res.status === 200 || res.status === 201) {
                return res
            } 
        } catch(e:any) {
            toaster(e.message, 'error')
            return e
        }
    }
    async postData(path:string, body: any) {
        try {
            const res = await axios.post(this.baseURL + path, body)

            if(res.status === 200 || res.status === 201) {
                return res
            }
        } catch(e:any) {
            toaster(e.message, 'error')
            return e
        }
    }
    async patchData(path:string, body: any) {
        try {
            const res = await axios.patch(this.baseURL + path, body)

            if(res.status === 200 || res.status === 201) {
                return res
            }
        } catch(e:any) {
            toaster(e.message, 'error')
            return e
        }
    }
    async deleteData(path:string) {
        try {
            const res = await axios.delete(this.baseURL + path)
            if(res.status === 200 || res.status === 201) {
                return res.data
            }
        } catch(e:any) {
            toaster(e.message, 'error')
            return e
        }
    }
}