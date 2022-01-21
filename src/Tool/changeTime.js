export default function changeTime(t) {
    let time = Math.round((new Date().getTime() - new Date(t).getTime()) / 1000);
    if (time < 60) {
        return '刚刚'
    } else if (time / 60 < 60) {
        return parseInt(time / 60) + '分钟前'
    } else if (time / 60 / 60 < 24) {
        return parseInt(time / 60 / 60) + '小时前'
    } else if (time / 60 / 60 / 24 < 30) {
        return parseInt(time / 60 / 60 / 24) + '天前'
    } else if (time / 60 / 60 / 24 / 30 < 12) {
        return parseInt(time / 60 / 60 / 24 / 30) + '月前'
    } else if (time / 60 / 60 / 24 / 30 / 12 > 1) {
        return parseInt(time / 60 / 60 / 24 / 365) + '年前'
    }
}