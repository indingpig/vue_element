
const routers = [
    {
        path: '/home',
        name: 'home',
        component (resolve) {
            require.ensure(
                ['../components/Home.vue'],
                () => {
                    resolve(require('../components/Home.vue'))
                }
            )
        }
    }
]

export default routers