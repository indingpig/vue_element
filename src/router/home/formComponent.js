
const routers = [
    {
        path: 'form',
        name: 'formComponent',
        component (resolve) {
            require.ensure(
                ['../../public/view/home/formComponent.vue'],
                () => {
                    resolve(require('../../public/view/home/formComponent.vue'))
                }
            )
        }
    }
]

export default routers