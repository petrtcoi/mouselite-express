import moyskladHttp from "./moyskladHttp"

type Props = { name: string }
type Return = {
    href: string
}

const moyskaldProductCreate = async (props: Props): Promise<Return | null> => {

    const result = await moyskladHttp.post(
        'https://online.moysklad.ru/api/remap/1.2/entity/product',
        { name: props.name }
    )
    if (result.status === 200) return { href: result.data.meta.href }
    return null

}

export default moyskaldProductCreate