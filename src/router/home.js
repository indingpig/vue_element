
import addMenu from '../public/view/home/addMenu.vue'
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