
const isPro = Object.is(process.env.NODE_ENV, 'production')

module.exports = {
    baseUrl: isPro ? 'https://news-at.zhihu.com/' : '/api/'
}
