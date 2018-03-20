
const routers = [
    {
        path: 'addShop',
        name: 'addShop',
        component (resolve) {
            require.ensure(
                ['../../public/view/home/addShop.vue'],
                () => {
                    resolve(require('../../public/view/home/addShop.vue'))
                }
            )
        }
    }
]

export default routers