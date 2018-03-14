
const routers = [
    {
        path: 'home',
        name: 'home',
        component (resolve) {
            require.ensure(
                ['../public/view/Home.vue'],
                () => {
                    resolve(require('../public/view/Home.vue'))
                }
            )
        }
    }
]

export default routers