
import home from './home'
import user from './user'
const routers = [
    {
        path: '/main',
        name: 'main',
        component (resolve) {
            require.ensure(
                ['../public/view/Main.vue'],
                () => {
                    resolve(require('../public/view/Main.vue'))
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