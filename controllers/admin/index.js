const { Router } = require("express");
const router = Router();
const ctrl = require("./admin.ctrl");
const jwt = require("jsonwebtoken");
const secretObj = process.env.JWT_SECRET;

function verify_token(req, res, next) {
  const token = req.headers.customer_t;

  if (!token) {
    return res.json({
      message: "empty token fail",
    });
  }

  jwt.verify(token, secretObj, (err, decoded) => {
    if (!decoded) {
      return res.json({
        message: "token error fail",
        err: err,
      });
    }
  });
  next();
}

// router.get('/', verify_token, testMiddleWare2, (req, res) => {
//     res.send('admin app');
// });
//

router
  .route("/farm_sensors")
  .get(ctrl.get_farm_sensors)
  .post(ctrl.post_farm_sensors);

router.route("/farm_sensors/var8/:id").get(ctrl.get_senser_data_by_var8);

//image 전송
router.get("/img", ctrl.get_img);

router.get("/img_thumbs/:filename", ctrl.get_img_thumbs);
router.get("/img_detailpage_upload/:filename", ctrl.get_img_detailpage_upload);
router.get("/img_product/:filename", ctrl.get_img_product);
router.get("/img_description/:filename", ctrl.get_img_description);

// app min version
router.get("/appinfos", ctrl.get_appinfos);
router.post("/appinfos", ctrl.post_appinfos);
// address map
//router.get("/kaka/:lat/:long", ctrl.get_address_map);
router.get("/kakao/:lat/:long", ctrl.get_address_map_kakao);
// streaming url
router.get("/streaming", ctrl.get_streaming);

//sensor
router.get("/sensors", ctrl.get_sensors);
router.post("/sensors", ctrl.post_sensors);

// admin apge
//productss
router.get("/admin_products", ctrl.get_admin_products);
router.get("/admin_products_write", ctrl.get_admin_products_write);
router.post("/admin_products_write", ctrl.post_admin_products_write);
router.get("/admin_products/detail/:id", ctrl.get_admin_products_detail);
router.get("/admin_products/edit/:id", ctrl.get_admin_products_edit);
router.post("/admin_products/edit/:id", ctrl.post_admin_products_edit);
router.get("/admin_products/delete/:id", ctrl.get_admin_products_delete);

//customers
router.get("/admin_customers", ctrl.get_admin_customers);
router.get("/admin_customers_write", ctrl.get_admin_customers_write);
router.post("/admin_customers_write", ctrl.post_admin_customers_write);
router.get("/admin_customers/detail/:id", ctrl.get_admin_customers_detail);
router.get("/admin_customers/edit/:id", ctrl.get_admin_customers_edit);
router.post("/admin_customers/edit/:id", ctrl.post_admin_customers_edit);
router.get("/admin_customers/delete/:id", ctrl.get_admin_customers_delete);

//inventories
router.get("/admin_inventories", ctrl.get_admin_inventories);
router.get("/admin_inventories_write", ctrl.get_admin_inventories_write);
router.post("/admin_inventories_write", ctrl.post_admin_inventories_write);
router.get("/admin_inventories/detail/:id", ctrl.get_admin_inventories_detail);
router.get("/admin_inventories/edit/:id", ctrl.get_admin_inventories_edit);
router.post("/admin_inventories/edit/:id", ctrl.post_admin_inventories_edit);
router.get("/admin_inventories/delete/:id", ctrl.get_admin_inventories_delete);

//orders
router.get("/admin_orders", ctrl.get_admin_orders);
router.get("/admin_cart_items/detail/:id", ctrl.get_admin_cart_items_detail);

// router.get("/admin_orders_write", ctrl.get_admin_orders_write);
// router.post("/admin_orders_write", ctrl.post_admin_orders_write);
// router.get("/admin_orders/detail/:id", ctrl.get_admin_orders_detail);
// router.get("/admin_orders/edit/:id", ctrl.get_admin_orders_edit);
// router.post("/admin_orders/edit/:id", ctrl.post_admin_orders_edit);
// router.get("/admin_orders/delete/:id", ctrl.get_admin_orders_delete);

// future connect app API Route

//route for login function.

////CUSTOMER
router.route("/customers").get(ctrl.get_customers).post(ctrl.post_customers);
router
  .route("/customers/:id")
  .get(ctrl.get_customers_edit)
  .post(ctrl.post_customers_edit);
// login구현
router.post("/login", ctrl.post_login);
////PRODUCT
router.route("/products").get(ctrl.get_products).post(ctrl.post_products);
router
  .route("/products/:id")
  .get(ctrl.get_products_edit)
  .post(ctrl.post_products_edit);
//version return
router.get("/ret_v", ctrl.get_ret_v);
router.post("/temp_promos_create", ctrl.post_temp_promos_create);
//Below function should be secured by JWT token
//TEST token eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzbnNfaWQiOiIxNTQzOTM4MTg4IiwiaWF0IjoxNjEyNDAzMzY3LCJleHAiOjE2OTg4MDMzNjd9.ZY2Ss_TnubFNuun_Q7t04_YLpCP11zMyq7ZPLdpCQNQ
router.use(verify_token);

//// CART
/*
USER_FLOW
1. When login or connect to app, post data to recent cart endpoint
*/
//쓰지않는 엔드포인트 입니다.
// router.route("/carts_recent").post(ctrl.post_recent_carts);
router.post("/carts_recent_items", ctrl.post_recent_carts_items);
/*
2. if there is no cart item in inital res there should be no connected cart. 
Thus, when the first item add to inital cart without connected cart, there should be post req for cart.
TEST ACCOUT : weplant.corp@gmail.com
*/
//3. Cart post and get cart ID
router.route("/carts").get(ctrl.get_carts).post(ctrl.post_carts);
//4. Post cart_items by retrieved cartID(edited)
router.route("/cart_items").get(ctrl.get_cart_items).post(ctrl.post_cart_items);
router.route("/carts/:id").get(ctrl.get_carts_edit).post(ctrl.post_carts_edit);

router
  .route("/cart_items/:id")
  .get(ctrl.get_cart_items_edit)
  .post(ctrl.post_cart_items_edit);

//쿠폰관련 컨트롤러.
router.get("/carts_recent/:id", ctrl.get_one_carts);

// router.get("/cart_lists", verify_token, ctrl.get_cart_lists);
// router.post("/cart_lists", verify_token, ctrl.post_cart_lists);
// router.get("/cart_lists/:id", verify_token, ctrl.get_cart_lists_edit);
// router.post("/cart_lists/:id", verify_token, ctrl.post_cart_lists_edit);

////PURCHASE
/*
1. When user decide to purchase, purchase data will be post on post endpoint
2. Patch CART
3. Create purchase data 
4. Reduce amout of inventory.
TEST완료
*/
router.get("/purchases", verify_token, ctrl.get_purchases);
router.post("/purchases", verify_token, ctrl.postPurchases);
router.get("/purchases/:id", verify_token, ctrl.get_purchases_edit);
router.post("/purchases/:id", verify_token, ctrl.post_purchases_edit);
//Purchased Card
router.get(
  "/purchases/customer/:customer_id",
  verify_token,
  ctrl.get_purchases_customer
);

/*
Get PURCHASED PRODUCT
TEST완료
 */
router.route("/purchased_product/:id").get(ctrl.getPurchasedProducts);

// cart_id, product_id로 cart_item_id return
// router.get(
//   "/cart_items/:cart_id/:product_id",
//   verify_token,
//   ctrl.get_cart_items_cartid_productid
// );
// router.get("/cart_items_cart/:cart_id", ctrl.get_cart_items_cartid);

//customer id 로 구매내역 가져오기

router.get("/notification_infos", verify_token, ctrl.get_notification_infos);
router.post("/notification_infos", verify_token, ctrl.post_notification_infos);
router.get(
  "/notification_infos/:id",
  verify_token,
  ctrl.get_notification_infos_edit
);
router.post(
  "/notification_infos/:id",
  verify_token,
  ctrl.post_notification_infos_edit
);

router.get("/hashtag_lists", verify_token, ctrl.get_hashtag_lists);
router.post("/hashtag_lists", verify_token, ctrl.post_hashtag_lists);
router.get("/hashtag_lists/:id", verify_token, ctrl.get_hashtag_lists_edit);
router.post("/hashtag_lists/:id", verify_token, ctrl.post_hashtag_lists_edit);

router.get("/hashtags", verify_token, ctrl.get_hashtags);
router.post("/hashtags", verify_token, ctrl.post_hashtags);
router.get("/hashtags/:id", verify_token, ctrl.get_hashtags_edit);
router.post("/hashtags/:id", verify_token, ctrl.post_hashtags_edit);

router.get("/product_orders", verify_token, ctrl.get_product_orders);
router.post("/product_orders", verify_token, ctrl.post_product_orders);
router.get("/product_orders/:id", verify_token, ctrl.get_product_orders_edit);
router.post("/product_orders/:id", verify_token, ctrl.post_product_orders_edit);

router.get("/providers", verify_token, ctrl.get_providers);
router.post("/providers", verify_token, ctrl.post_providers);
router.get("/providers/:id", verify_token, ctrl.get_providers_edit);
router.post("/providers/:id", verify_token, ctrl.post_providers_edit);

router.get("/provider_handles", verify_token, ctrl.get_provider_handles);
router.post("/provider_handles", verify_token, ctrl.post_provider_handles);
router.get(
  "/provider_handles/:id",
  verify_token,
  ctrl.get_provider_handles_edit
);
router.post(
  "/provider_handles/:id",
  verify_token,
  ctrl.post_provider_handles_edit
);

router.get("/customer_logs", verify_token, ctrl.get_customer_logs);
router.post("/customer_logs", verify_token, ctrl.post_customer_logs);
router.get("/customer_logs/:id", verify_token, ctrl.get_customer_logs_edit);
router.post("/customer_logs/:id", verify_token, ctrl.post_customer_logs_edit);

router.get("/reviews", verify_token, ctrl.get_reviews);
router.post("/reviews", verify_token, ctrl.post_reviews);
router.get("/reviews/:id", verify_token, ctrl.get_reviews_edit);
router.post("/reviews/:id", verify_token, ctrl.post_reviews_edit);
router.get("/product_reviews/:id", verify_token, ctrl.get_product_review);

router.get("/coupons", verify_token, ctrl.get_coupons);
router.post("/coupons", verify_token, ctrl.post_coupons);
router.get("/coupons/:id", verify_token, ctrl.get_coupons_edit);
router.post("/coupons/:id", verify_token, ctrl.post_coupons_edit);
router.get("/coupon_customer/:id", verify_token, ctrl.get_coupon_customer);

router.get("/inventories", verify_token, ctrl.get_inventories);
router.post("/inventories", verify_token, ctrl.post_inventories);
router.get("/inventories/:id", verify_token, ctrl.get_inventories_edit);
router.post("/inventories/:id", verify_token, ctrl.post_inventories_edit);
router.get(
  "/inventories_product/:id",
  verify_token,
  ctrl.get_inventories_product
);

//temp_promos
router.get("/temp_promos", verify_token, ctrl.get_temp_promos);
router.post("/temp_promos", verify_token, ctrl.post_temp_promos);
router.get("/temp_promos/:id", verify_token, ctrl.get_temp_promos_edit);
router.post("/temp_promos/:id", verify_token, ctrl.post_temp_promos_edit);

//sns_id 구현
router.get("/customers/sns_id/:id", verify_token, ctrl.get_customers_sns_edit);

// version 확인
router.get("/version_check/:id", verify_token, ctrl.get_version_check);

// loading
module.exports = router;
console.log("Routing success");

//router.get('/products', ctrl.get_products );
/*
router.get('/products/write', ctrl.get_products_write );

router.post('/products/write', ctrl.post_products_write );

router.get('/products/detail/:id', ctrl.get_products_detail );

router.get('/products/edit/:id', ctrl.get_products_edit );

router.post('/products/edit/:id', ctrl.post_products_edit );

router.get('/products/delete/:id', ctrl.get_products_delete );
*/
