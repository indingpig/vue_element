
import home from './home'
import user from './user'
const routers = [
    {
        path: '/main',
        name: 'main',
        component (resolve) {
            require.ensure(
                ['../public/view/main.vue'],
                () => {
                    resolve(require('../public/view/main.vue'))
                }
            )
        },
        children: [
            ...home,
            ...user
        ],
    }
]

export default routers
