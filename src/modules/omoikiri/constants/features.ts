export const GENERAL_FEATURES: { [key: string]: string } = {
    'артикул': 'sku',
    'товарная группа': 'group',
    'наименование': 'name',
    'бренд': 'brandName',
    'страна бренда': 'brandCountry',
    'страна производства': 'brandManufacturerCountry',
    'цвет': 'color',
    'описание': 'description',
    'ррц': 'price',
    'фото': 'imageUrl',
    'схема': 'schemaUrl',
    'ролики': 'youtubeUrl',
    'материал': 'material',
    'гарантия': 'guarantee',
    'Комплектация': 'equipment'
}


export const SIZE_FEATURES: { [key: string]: string } = {
    'длина, мм': 'length',
    'глубина, мм': 'depth',
    'ширина, мм': 'width',
    'высота, мм': 'height',
    'глубина чаши, мм': 'bowlDepth',
    'длина чаши': 'bowlLength',
    'ширина чаши': 'bowlWidth',
    'база, см': 'baseSizeSm',
    'высота излива, мм': 'spoutHeight'
}


export const TRANSPORT_FEATURES: { [key: string]: string } = {
    'штриход': 'barcode',
    'вес нетто': 'weightNetto',
    'вес брутто': 'weightBrutto',
    'объем': 'volume',
    'высота упаковки': 'packageHeight',
    'длина упаковки': 'packageLength',
    'ширина упаковки': 'packageWidth',
    'материал упаковки': 'packageMaterial'
}

export const OTHER_FEATURES: { [key: string]: string } = {
    'количество чаш': 'bowlsQnty',
    'крыло': 'sinkWing',
    'расположение крыла': 'sinkWingPosition',
    'монтаж': 'montage',
    'готовое отверстие под смеситель': 'sinkHoleForTap',
    'возможность подключения фильтра': 'tapFilter',
    'выдвижной/гибкий излив': 'spoutFlex',
    'форма': 'shape'
}