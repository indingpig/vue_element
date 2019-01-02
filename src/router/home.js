
import addMenu from './home/addMenu';
import addShop from './home/addShop';
import testPage from './home/testPage';
import formComponent from './home/formComponent'
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
            ...addMenu,
            ...addShop,
            ...testPage,
            ...formComponent
        ]
    }
]

export default routers