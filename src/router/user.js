const routers = [
    {
        path: '/user',
        name: 'user',
        component (resolve) {
            require.ensure(
                ['../components/User.vue'],
                () => {
                    resolve(require('../components/User.vue'))
                }
            )
        }
    }
]

export default routers