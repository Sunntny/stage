import axios from 'axios'

function ApiGet(url, callback) {
    const token = localStorage.getItem('X-Token');
    axios.get(url, { headers: { 'X-Token': `${token}` } }).then(resp => {
        callback(resp)
    })
}

function ApiPost(url, data, callback) {
    const token = localStorage.getItem('X-Token');
    axios.post(url, data, { headers: { 'X-Token': `${token}` } }).then(resp => {
        callback(resp)
    })
}

export { ApiGet, ApiPost }