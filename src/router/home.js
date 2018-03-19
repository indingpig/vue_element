
import addMenu from './home/addMenu'
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
        },
        children: [
            ...addMenu
        ]
    }
]

export default routers