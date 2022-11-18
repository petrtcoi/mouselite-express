import StockAllItem from '../../models/stockAllItem.models'

export const stockAllRawItems: StockAllItem[] = [
    { "quantity": "Петербург", "sku": "Номенклатура", "title": "Номенклатура", "supplierCode": "select_spb" },
    { "quantity": "1", "sku": "Радиатор Zehnder Charleston Completto 2050/14 подключение V001, RAL 9016", "title": "Радиатор Zehnder Charleston Completto 2050/14 подключение V001, RAL 9016", "supplierCode": "select_spb" },
    { "quantity": "2", "sku": "Радиатор Zehnder Charleston Completto 2050/16 подключение V001, RAL 9016", "title": "Радиатор Zehnder Charleston Completto 2050/16 подключение V001, RAL 9016", "supplierCode": "select_spb" },
    { "quantity": "1", "sku": "Радиатор Zehnder Charleston Completto 2056/10 подключение V002,  RAL9016", "title": "Радиатор Zehnder Charleston Completto 2056/10 подключение V002,  RAL9016", "supplierCode": "select_spb" }
]

export const stockAllRawItemsWithTwoErrors = [
    { "quantity": "Петербург", "title": "Номенклатура", "supplierCode": "select_spb" },
    { "quantity": 1, "sku": "Радиатор Zehnder Charleston Completto 2050/14 подключение V001, RAL 9016", "title": "Радиатор Zehnder Charleston Completto 2050/14 подключение V001, RAL 9016", "supplierCode": "select_spb" },
    { "sku": "Радиатор Zehnder Charleston Completto 2050/16 подключение V001, RAL 9016", "title": "Радиатор Zehnder Charleston Completto 2050/16 подключение V001, RAL 9016", "supplierCode": "select_spb" },
    { "quantity": "1", "sku": "Радиатор Zehnder Charleston Completto 2056/10 подключение V002,  RAL9016", "title": "Радиатор Zehnder Charleston Completto 2056/10 подключение V002,  RAL9016", "supplierCode": "select_spb" }
]