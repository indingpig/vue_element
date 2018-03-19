
const routers = [
    {
        path: 'addMenu',
        name: 'addMenu',
        component (resolve) {
            require.ensure(
                ['../../public/view/home/addMenu.vue'],
                () => {
                    resolve(require('../../public/view/home/addMenu.vue'))
                }
            )
        }
    }
]

export default routers