import express from 'express';

import authAllUsers from '../middlewhare/auth';
import checkPresence from '../middlewhare/checkPresence';

import currencyFuncs from '../modules/currency';
import twilioFuncs from '../modules/twilio';
import userFuncs from '../modules/user';
import stockAllFuncs from '../modules/stockAll';
import stockBrandFuncs from '../modules/stockBrand';
import supplierFuns from '../modules/supplier';
import storeFuncs from '../modules/store/index';
import projectFuncs from '../modules/project';
import versionFuncs from '../modules/version';
import roomFuncs from '../modules/room';
import productFuncs from '../modules/product';
import itemRadiatorFuncs from '../modules/itemRadiator';
import itemAccessoryFuncs from '../modules/itemAccessory';
import offerFuncs from '../modules/offer';
import ozonFuncs from '../modules/ozon';
import kktFuncs from '../modules/kkt';
import emailFuncs from '../modules/email';
import kradFuncs from '../modules/kradiator';
import moyskladFunc from '../modules/moysklad';
import webasystFunc from '../modules/webasyst';
import tubogFunc from '../modules/tubogshop';
import omoikiriFunc from '../modules/omoikiri';
import supplierEmailFuncs from '../modules/supplierEmails';

const router = express.Router();

router.post('/currency/arbonia', currencyFuncs.arbonia);
router.post('/currency', currencyFuncs.update);
router.get('/currency/:name', currencyFuncs.get);
router.patch(
  '/currency',
  authAllUsers,
  checkPresence(['name', 'rate']),
  currencyFuncs.updateCustom
);

router.patch('/stockall', authAllUsers, stockAllFuncs.stockAllUpdate);
router.get('/stockall', authAllUsers, stockAllFuncs.stockAllGet);
router.patch('/stockbrand', authAllUsers, stockBrandFuncs.stockBrandUpdate);
router.get('/stockbrand', authAllUsers, stockBrandFuncs.stockBrandGet);
router.get('/supplier', authAllUsers, supplierFuns.getSupplierList);
router.get('/store', authAllUsers, storeFuncs.getStoreList);

router.get('/user/checktoken', authAllUsers, userFuncs.checkToken);
router.get('/user', authAllUsers, userFuncs.getList);

router.post(
  '/twilio',
  authAllUsers,
  checkPresence(['storeCode', 'phoneTo', 'message']),
  twilioFuncs.sendWhastAppMsg
);
router.get('/twilio', authAllUsers, twilioFuncs.getMsgList);

router.patch('/product', authAllUsers, productFuncs.productUpdateAll);
router.get('/product', authAllUsers, productFuncs.get);
router.get('/product/:projectid', authAllUsers, productFuncs.get);
router.post(
  '/product/',
  authAllUsers,
  checkPresence(['type', 'title', 'currency', 'priceBase', 'projectId']),
  productFuncs.createCustom
);
router.patch(
  '/productcustom/',
  authAllUsers,
  checkPresence(['type', 'title', 'currency', 'priceBase', 'id']),
  productFuncs.updateCustom
);

router.post(
  '/project',
  authAllUsers,
  checkPresence(['title']),
  projectFuncs.projectCreate
);
router.patch(
  '/project',
  authAllUsers,
  checkPresence(['id', 'updates']),
  projectFuncs.projectUpdate
);
router.get('/project/', authAllUsers, projectFuncs.getList);
router.get('/project/:id', authAllUsers, projectFuncs.get);

router.post(
  '/version',
  authAllUsers,
  checkPresence(['projectId']),
  versionFuncs.versionCreate
);
router.patch(
  '/version',
  authAllUsers,
  checkPresence(['id', 'updates']),
  versionFuncs.versionUpdate
);
router.delete(
  '/version',
  authAllUsers,
  checkPresence(['id']),
  versionFuncs.versionDelete
);
router.get('/version/:id', authAllUsers, versionFuncs.get);
router.post(
  '/versioncopy',
  authAllUsers,
  checkPresence(['id', 'mode']),
  versionFuncs.copy
);

router.post(
  '/room',
  authAllUsers,
  checkPresence(['versionId']),
  roomFuncs.roomCreate
);
router.patch(
  '/room',
  authAllUsers,
  checkPresence(['id', 'updates']),
  roomFuncs.roomUpdate
);
router.delete(
  '/room',
  authAllUsers,
  checkPresence(['id']),
  roomFuncs.roomDelete
);
router.get('/room/:id', authAllUsers, roomFuncs.get);

router.get('/itemradiator/:id', authAllUsers, itemRadiatorFuncs.get);
router.post(
  '/itemradiator',
  authAllUsers,
  checkPresence(['roomId', 'modelId']),
  itemRadiatorFuncs.itemRadiartorCreate
);
router.patch(
  '/itemradiator',
  authAllUsers,
  checkPresence(['id', 'updates']),
  itemRadiatorFuncs.itemRadiartorUpdate
);
router.delete(
  '/itemradiator',
  authAllUsers,
  checkPresence(['id']),
  itemRadiatorFuncs.itemRadiartorDelete
);

router.get('/itemaccessory/:id', authAllUsers, itemAccessoryFuncs.get);
router.post(
  '/itemaccessory',
  authAllUsers,
  checkPresence(['roomId', 'accessoryId']),
  itemAccessoryFuncs.itemAccessoryCreate
);
router.patch(
  '/itemaccessory',
  authAllUsers,
  checkPresence(['id', 'updates']),
  itemAccessoryFuncs.itemAccessoryUpdate
);
router.delete(
  '/itemaccessory',
  authAllUsers,
  checkPresence(['id']),
  itemAccessoryFuncs.itemAccessoryDelete
);

router.post(
  '/offer',
  authAllUsers,
  checkPresence(['jsonString', 'projectId']),
  offerFuncs.create
);
router.get('/offer/:id', offerFuncs.get);
router.get('/offerlist/:projectId', offerFuncs.getList);

router.post('/ozon/oventrop', ozonFuncs.updateStockOventrop);
router.post('/ozon/arbonia', ozonFuncs.updateStockArbonia);

router.post(
  '/kkt/checkout',
  authAllUsers,
  checkPresence(['orderName', 'client', 'receipt']),
  kktFuncs.checkout
);
router.get('/kkt/order/:orderName', authAllUsers, kktFuncs.getOrder);

router.post('/email', emailFuncs.sendEmail);

router.post('/krad', authAllUsers, kradFuncs.updateDb);
router.post('/krad/site', authAllUsers, kradFuncs.updateSiteDb);
router.get(
  '/krad',
  // authAllUsers,
  kradFuncs.get
);
router.get('/krad/site/:model', kradFuncs.getSiteModel);

router.post(
  '/moysklad/order',
  authAllUsers,
  checkPresence(['versionId']),
  moyskladFunc.createOrder
);
router.post('/moysklad/helper', authAllUsers, moyskladFunc.helper);

router.post(
  '/webasyst/moysklad/order',
  authAllUsers,
  checkPresence(['orderName', 'waStore']),
  webasystFunc.createMoyskladOrder
);

router.post('/tubog/db', authAllUsers, tubogFunc.updateDb);
router.get('/tubog/model/:model', tubogFunc.getModel);
router.get('/tubog/connection/:connection', tubogFunc.getConnection);
router.get('/tubog/model/', tubogFunc.getAllModels);
router.get('/tubog/connection/', tubogFunc.getAllConnections);

router.post(
  '/omoikiri/csvparse',
  authAllUsers,
  omoikiriFunc.omoikiriParseGoogle
);
router.get('/omoikiri/skus', authAllUsers, omoikiriFunc.getAllSkus);
router.get('/omoikiri/sku/:sku', omoikiriFunc.getBySku);

router.post('/supplieremails/', supplierEmailFuncs.addData);
router.get(
  '/supplieremails/:orderId',
  authAllUsers,
  supplierEmailFuncs.getByOrderId
);
router.get(
  '/supplieremails/',
  authAllUsers,
  supplierEmailFuncs.getByOrderIdsList
);

export default router;
