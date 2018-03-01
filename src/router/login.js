
const routers = [
    {
        path: '/login',
        name: 'login',
        component (resolve) {
            require.ensure(
                ['../public/view/login.vue'],
                () => {
                    resolve(require('../public/view/login.vue'))
                }
            )
        }
    }
]

export default routers