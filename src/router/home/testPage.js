
const routers = [
    {
        path: 'testPage',
        name: 'testPage',
        component (resolve) {
            require.ensure(
                ['../../public/view/home/testPage.vue'],
                () => {
                    resolve(require('../../public/view/home/testPage.vue'))
                }
            )
        }
    }
]

export default routers