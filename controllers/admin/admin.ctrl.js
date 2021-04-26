const db = require("../../models");
const models = require("../../models");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { decode } = require("punycode");
const { Sequelize, sequelize } = require("../../models");
const products = require("../../models/products");
const secretObj = process.env.JWT_SECRET;
// future coonect
// customers table
function verify_token(req, res) {}

exports.get_senser_data_by_var8 = async (req, res) => {
  try {
    const var8 = req.params.id;
    const result = await models.farm_sensors.findAll({
      limit: 1,
      where: {
        var8,
      },
      order: [["createdAt", "DESC"]],
    });
    res.json({
      message: "success",
      result,
    });
  } catch (error) {
    console.error(err);
    res.json({
      message: "fail",
    });
  }
};
exports.get_farm_sensors = async (req, res) => {
  try {
    const result = await models.farm_sensors.findAll({});
    res.json({
      message: "success",
      result,
    });
  } catch (error) {
    console.error(err);
    res.json({
      message: "fail",
    });
  }
};

exports.post_farm_sensors = async (req, res) => {
  try {
    const result = await models.farm_sensors.create(req.body);
    res.json({
      message: "success",
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "fail",
    });
  }
};
exports.get_customers = (req, res) => {
  models.customers
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_customers = (req, res) => {
  models.customers
    .update(
      {
        name: req.body.name,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        birthdate: req.body.birthdate,
      },
      {
        where: {
          sns_id: req.body.sns_id,
          join_platform: req.body.join_platform,
        },
      }
    )
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_customers_edit = (req, res) => {
  models.customers
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_customers_edit = (req, res) => {
  models.customers
    .update(
      {
        //data
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        birthdate: req.body.birthdate,
        phone: req.body.phone,
        sns_id: req.body.sns_id,
        post_code: req.body.post_code,
        address: req.body.address,
        detailed_address: req.body.detailed_address,
        createdate: req.body.createdate,
      },
      {
        //condition
        where: {
          customer_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// carts table
exports.get_carts = (_, res) => {
  models.carts
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

//현재 싱크가 안맞습니다. (db포맷하면서 cart_id랑 amount랑 불일치 문제)수정한 내역 amount

exports.post_carts = async (req, res) => {
  try {
    const data = await models.carts.create(req.body);
    res.json({
      message: "success",
      result: data.cart_id,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "fail",
    });
  }

  // models.carts.count().then(amount => {
  //     models.carts.create(req.body).then(() => {
  //         console.log('body =' + req.body);
  //         res.json({
  //             message: 'success',
  //             result: amount + 1
  //         });
  //     });
  // }).catch(err => {

  //     console.error(err);
  //     res.json({
  //         message: 'fail'
  //     })
  // });
};
exports.get_carts_edit = (req, res) => {
  models.carts
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_recent_carts = (req, res) => {
  console.log("1");
  models.carts
    .findOne({
      attributes: ["cart_id"],
      where: {
        customer_id: req.body.customer_id,
        cart_status: req.body.cart_status,
      },
    })
    .then((cart) => {
      models.cart_lists
        .findAll({
          attributes: ["cart_item_id"],
          where: {
            [Sequelize.Op.or]: JSON.parse(JSON.stringify(cart)),
            // cart_id: JSON.parse(JSON.stringify(cart))
          },
        })
        .then((cart_list) => {
          console.log(new Date(new Date() - 24 * 60 * 60 * 3000));
          models.cart_items
            .findAll({
              where: {
                [Sequelize.Op.or]: JSON.parse(JSON.stringify(cart_list)),
                quantity: {
                  [Sequelize.Op.ne]: 0,
                },
                updatedAt: {
                  [Sequelize.Op.lt]: new Date(),
                  [Sequelize.Op.gt]: new Date(new Date() - 24 * 60 * 60 * 3000),
                },

                // cart_item_id: JSON.parse(JSON.stringify(cart_list))
              },
            })
            .then((result) => {
              res.json({
                message: "success",
                result,
              });
            });
        });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_recent_carts_items = (req, res) => {
  console.log("1");
  models.carts
    .findAll({
      attributes: ["cart_id"],
      where: {
        customer_id: req.body.customer_id,
        cart_status: req.body.cart_status,
      },
    })
    .then((cart) => {
      console.log(new Date(new Date() - 24 * 60 * 60 * 3000));
      models.cart_items
        .findAll({
          where: {
            [Sequelize.Op.or]: JSON.parse(JSON.stringify(cart)),
            quantity: {
              [Sequelize.Op.ne]: 0,
            },
            updatedAt: {
              [Sequelize.Op.lt]: new Date(),
              [Sequelize.Op.gt]: new Date(new Date() - 24 * 60 * 60 * 3000),
            },
          },
        })
        .then((result) => {
          res.json({
            message: "success",
            result,
          });
        });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.get_one_carts = (req, res) => {
  models.coupons
    .findAll({
      where: {
        customer_id: req.params.id,
      },
    })
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_carts_edit = (req, res) => {
  models.carts
    .update(
      {
        //data
        customer_id: req.body.customer_id,
        amount_price: req.body.amount_price,
        cart_status: req.body.cart_status,
      },
      {
        //condition
        where: {
          cart_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// cart_list table
exports.get_cart_lists = (_, res) => {
  models.cart_lists
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_cart_lists = (req, res) => {
  console.log("body =" + req.body);
  models.cart_lists
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_cart_lists_edit = (req, res) => {
  models.cart_lists
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_cart_lists_edit = (req, res) => {
  models.cart_lists
    .update(
      {
        //data
        cart_id: req.body.cart_id,
        cart_item_id: req.body.cart_item_id,
      },
      {
        //condition
        where: {
          cart_list_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// cart_items table
exports.get_cart_items = (_, res) => {
  models.cart_items
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};
exports.post_cart_items = async (req, res) => {
  try {
    const data = await models.cart_items.create(req.body);
    res.json({
      message: "success",
      result: data.cart_item_id,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "fail",
    });
  }
};
// exports.post_cart_items = (req, res) => {
//   console.log("body =" + req.body);
//   models.cart_items
//     .count()
//     .then((amount) => {
//       models.cart_items.create(req.body).then((lastone) => {
//         console.log("body =" + req.body);
//         res.json({
//           message: "success",
//           result: lastone,
//         });
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.json({
//         message: "fail",
//       });
//     });
// };
exports.get_cart_items_edit = (req, res) => {
  models.cart_items
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_cart_items_edit = (req, res) => {
  models.cart_items
    .update(
      {
        //data
        product_id: req.body.product_id,
        quantity: req.body.quantity,
        total_price: req.body.total_price,
      },
      {
        //condition
        where: {
          cart_item_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.get_cart_items_cartid_productid = (req, res) => {
  models.cart_items
    .findOne({
      where: {
        cart_id: req.params.cart_id,
        product_id: req.params.product_id,
      },
    })
    .then((cart_item) => {
      res.json({
        message: "success",
        result: cart_item.cart_item_id,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.get_cart_items_cartid = (req, res) => {
  console.log("get_cart_items_cartidget_cart_items_cartid");
  models.cart_items
    .findAll({
      where: {
        cart_id: req.params.cart_id,
      },
    })
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// purchases table
exports.get_purchases = (_, res) => {
  models.purchases
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};
exports.postPurchases = async (req, res) => {
  try {
    const data = await db.purchases.create(req.body);
    console.log("carts update success");
    await db.carts.update(
      {
        cart_status: 1,
      },
      {
        where: {
          cart_id: req.body.cart_id,
        },
      }
    );

    const products = await db.cart_items.findAll({
      raw: true,
      attributes: ["product_id", "quantity"],
      where: {
        cart_id: req.body.cart_id,
      },
    });

    console.log(products);
    for (product of products) {
      console.log(product);
      if (product.quantity != 0) {
        const inventory = await db.inventories.findOne({
          raw: true,
          attributes: ["quantity"],
          where: {
            product_id: product.product_id,
          },
        });

        await db.inventories.update(
          {
            quantity: inventory.quantity - product.quantity,
          },
          {
            where: {
              product_id: product.product_id,
            },
          }
        );
      }
    }
    res.json({
      message: "success",
      result: req.body.cart_id,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "fail",
    });
  }
};

// exports.post_purchases = (req, res) => {
//   console.log("body =" + req.body);
//   models.purchases
//     .create(req.body)
//     .then((result) => {
//       models.carts
//         .update(
//           {
//             cart_status: 1,
//           },
//           {
//             where: {
//               cart_id: req.body.cart_id,
//             },
//           }
//         )
//         .then(() => {
//           console.log("carts update success");

//           /* res.json({
//                 message: 'success',
//                 result: req.body.cart_id
//             }); */
//         })
//         .catch((err) => {
//           console.log("carts update fail");
//           console.err(err);
//           res.json({
//             message: "fail",
//             result: "carts update fail",
//           });
//         });

//       models.cart_items
//         .findAll({
//           raw: true,
//           attributes: ["product_id", "quantity"],
//           where: {
//             cart_id: req.body.cart_id,
//           },
//         })
//         .then((product) => {
//           models.inventories
//             .findAll({
//               raw: true,
//               attributes: ["quantity"],
//               where: {
//                 product_id: product[0]["product_id"],
//               },
//             })
//             .then((result) => {
//               models.inventories.update(
//                 {
//                   quantity: result[0]["quantity"] - product[0]["quantity"],
//                 },
//                 {
//                   where: {
//                     product_id: product[0]["product_id"],
//                   },
//                 }
//               );
//             })
//             .then(() => {
//               console.log("product update success");
//             });
//         })
//         .catch((err) => {
//           console.log("product update fail");

//           res.json({
//             message: "fail",
//             result: "product update fail",
//           });
//         });

//       res.json({
//         message: "success",
//         result: req.body.cart_id,
//       });
//     })
//     .catch((err) => {
//       console.error(err);
//       res.json({
//         message: "fail",
//       });
//     });
// };
exports.getPurchasedProducts = async (req, res) => {
  try {
    let purchasedLogWithProductsList = [];
    let data = await db.purchases.findAll({
      where: {
        customer_id: req.params.id,
      },
    });
    for (const log of data) {
      console.log(log);
      let purchasedLogWithProducts = Object.create(log);
      if (purchasedLogWithProducts.purchase_status === null) {
        continue;
      }

      const cart_item = await db.cart_items.findAll({
        where: {
          cart_id: log.dataValues.cart_id,
        },
      });
      let productList = [];
      cart_item.forEach((element) => {
        let purchasedProduct = {};
        purchasedProduct.product_id = element.dataValues.product_id;
        purchasedProduct.quantity = element.dataValues.quantity;
        if (element.dataValues.quantity != 0)
          productList.push(purchasedProduct);
      });
      console.log(productList);
      purchasedLogWithProducts.dataValues["product_list"] = productList;

      purchasedLogWithProductsList.push(purchasedLogWithProducts);
    }
    res.json({
      message: "success",
      result: purchasedLogWithProductsList,
    });
  } catch (error) {
    console.log(error);
    res.json({
      message: "fail",
    });
  }
};
exports.get_purchases_edit = (req, res) => {
  models.purchases
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_purchases_edit = (req, res) => {
  models.purchases
    .update(
      {
        //data
        cart_id: req.body.cart_id,
        customer_id: req.body.customer_id,
        delivery_address: req.body.delivery_address,
        delivery_option: req.body.delivery_option,
        purchase_status: req.body.purchase_status,
        order_timestamp: req.body.order_timestamp,
        delivery_timestamp: req.body.delivery_timestamp,
      },
      {
        //condition
        where: {
          purchase_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// customer_id로 purchase list가져오기
exports.get_purchases_customer = (req, res) => {
  models.purchases
    .findAll({
      where: {
        customer_id: req.params.customer_id,
      },
    })
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

// products table
exports.get_products = async (req, res) => {
  try {
    const result = await models.inventories.findAll({
      include: [
        {
          model: models.products,
        },
      ],
    });

    res.json({
      message: "success",
      result,
    });
  } catch (error) {
    console.error(err);
    res.json({
      message: "fail",
    });
  }
};

exports.post_products = (req, res) => {
  console.log("body =" + req.body);
  models.products
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_products_edit = (req, res) => {
  models.products
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_products_edit = (req, res) => {
  models.products
    .update(
      {
        //data
        category: req.body.category,
        name: req.body.name,
        retail_price: req.body.retail_price,
        location: req.body.location,
        description: req.body.description,
        img_path: req.body.img_path,
        provider_id: req.body.provider_id,
        sku: req.body.sku,
        name_eng: req.body.name_eng,
        type: req.body.type,
        intro: req.body.intro,
        measure_1: req.body.measure_1,
        measure_2: req.body.measure_2,
        storage_desc: req.body.storage_desc,
        recipe: req.body.recipe,
        nutrition: req.body.nutrition,
        desciption_img_path: req.body.description_img_path,
        weights: req.body.weights,
      },
      {
        //condition
        where: {
          product_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// notification_infos table
exports.get_notification_infos = (_, res) => {
  models.notification_infos
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_notification_infos = (req, res) => {
  console.log("body =" + req.body);
  models.notification_infos
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_notification_infos_edit = (req, res) => {
  models.notification_infos
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_notification_infos_edit = (req, res) => {
  models.notification_infos
    .update(
      {
        //data
        product_id: req.body.product_id,
        attr1: req.body.attr1,
        attr2: req.body.attr2,
      },
      {
        //condition
        where: {
          notification_info_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// hashtag_lists table
exports.get_hashtag_lists = (_, res) => {
  models.hashtag_lists
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_hashtag_lists = (req, res) => {
  console.log("body =" + req.body);
  models.hashtag_lists
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_hashtag_lists_edit = (req, res) => {
  models.hashtag_lists
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_hashtag_lists_edit = (req, res) => {
  models.hashtag_lists
    .update(
      {
        //data
        product_id: req.body.product_id,
        hashtag_id: req.body.hashtag_id,
      },
      {
        //condition
        where: {
          hashtag_list_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// hashtags table
exports.get_hashtags = (_, res) => {
  models.hashtags
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_hashtags = (req, res) => {
  console.log("body =" + req.body);
  models.hashtags
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_hashtags_edit = (req, res) => {
  models.hashtags
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_hashtags_edit = (req, res) => {
  models.hashtags
    .update(
      {
        //data
        hashtag: req.body.hashtag,
      },
      {
        //condition
        where: {
          hashtag_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// product_orders table
exports.get_product_orders = (_, res) => {
  models.product_orders.findAll({}).then((result) => {
    res.json({
      message: "success",
      result,
    });
  }); // 이곳으로 productList보내기
};

exports.post_product_orders = (req, res) => {
  console.log("body =" + req.body);
  models.product_orders
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_product_orders_edit = (req, res) => {
  models.product_orders
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_product_orders_edit = (req, res) => {
  models.product_orders
    .update(
      {
        //data
        provider_id: req.body.provider_id,
        product_id: req.body.product_id,
        quantity: req.body.quantity,
        amount_price: req.body.amount_price,
        order_timestamp: req.body.order_timestamp,
        stock_timestamp: req.body.stock_timestamp,
      },
      {
        //condition
        where: {
          product_order_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// providers table
exports.get_providers = (_, res) => {
  models.providers
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_providers = (req, res) => {
  console.log("body =" + req.body);
  models.providers
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_providers_edit = (req, res) => {
  models.providers
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_providers_edit = (req, res) => {
  models.providers
    .update(
      {
        //data
        phone: req.body.phone,
        address: req.body.address,
      },
      {
        //condition
        where: {
          provider_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// provider_handles table
exports.get_provider_handles = (_, res) => {
  models.provider_handles
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_provider_handles = (req, res) => {
  console.log("body =" + req.body);
  models.provider_handles
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_provider_handles_edit = (req, res) => {
  models.provider_handles
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_provider_handles_edit = (req, res) => {
  models.provider_handles
    .update(
      {
        //data
        provider_id: req.body.provider_id,
        product_id: req.body.product_id,
        prov_price: req.body.prov_price,
      },
      {
        //condition
        where: {
          provider_handle_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// customer_logs table
exports.get_customer_logs = (_, res) => {
  models.customer_logs
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_customer_logs = (req, res) => {
  console.log("body =" + req.body);
  models.customer_logs
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_customer_logs_edit = (req, res) => {
  models.customer_logs
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_customer_logs_edit = (req, res) => {
  models.customer_logs
    .update(
      {
        //data
        lat: req.body.lat,
        lng: req.body.lng,
        address: req.body.address,
        logincnt: req.body.logincnt,
        loginos: req.body.loginos,
        appversion: req.body.appversion,
        logindate: req.body.logindate,
        customer_id: req.body.customer_id,
      },
      {
        //condition
        where: {
          customer_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// reveiws
exports.get_reviews = (_, res) => {
  models.reviews
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_reviews = (req, res) => {
  console.log("body =" + req.body);
  models.reviews
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_reviews_edit = (req, res) => {
  models.reviews
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_reviews_edit = (req, res) => {
  models.reviews
    .update(
      {
        //data
        customer_id: req.body.customer_id,
        product_id: req.body.product_id,
        rating: req.body.rating,
        commment: req.body.commment,
        img_link: req.body.img_link,
      },
      {
        //condition
        where: {
          review_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.get_product_review = (req, res) => {
  models.reviews
    .findAll({
      where: {
        product_id: req.params.id,
      },
    })
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// coupons

exports.get_coupons = (_, res) => {
  models.coupons
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_coupons = (req, res) => {
  console.log("body =" + req.body);
  models.coupons
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_coupons_edit = (req, res) => {
  models.coupons
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_coupons_edit = (req, res) => {
  models.coupons
    .update(
      {
        used: 1,
      },
      {
        //condition
        where: {
          coupon_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.params.id,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// inventories

exports.get_inventories = (_, res) => {
  models.inventories
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_inventories = (req, res) => {
  models.inventories
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_inventories_edit = (req, res) => {
  models.inventories
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_inventories_edit = (req, res) => {
  models.inventories
    .update(
      {
        //data
        product_id: req.body.product_id,
        quantity: req.body.quantity,
      },
      {
        //condition
        where: {
          inventory_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.get_inventories_product = (req, res) => {
  models.inventories
    .findAll({
      where: {
        product_id: req.params.id,
      },
    })
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.get_coupon_customer = async (req, res) => {
  try {
    var now = new Date();

    let result = await models.coupons.findAll({
      where: {
        customer_id: req.params.id,
        used: 0,
      },
    });

    result = result.filter((el) => el.expire_date > now);

    res.json({
      message: "success",
      result,
    });
  } catch (error) {
    res.json({
      message: "fail",
    });
  }
};

// coupons

exports.get_temp_promos = (_, res) => {
  models.temp_promos
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_temp_promos = (req, res) => {
  console.log("body =" + req.body);
  models.temp_promos
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
exports.get_temp_promos_edit = (req, res) => {
  models.temp_promos
    .findByPk(req.params.id)
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

exports.post_temp_promos_create = (req, res) => {
  models.temp_promos
    .findOne({
      where: {
        promo_num: req.body.promo_num,
        used: 0,
      },
    })
    .then((promo) => {
      if (promo != null) {
        models.coupons
          .create({
            customer_id: req.body.customer_id,
            type: 1,
            value: 10000.0,
            expire_date: "9999/12/31",
            coupon_num: req.body.promo_num,
            description: "",
            used: 0,
          })
          .then(() => {
            console.log("body =" + req.body);
          })
          .catch((err) => {
            console.error(err);
            res.json({
              message: "fail",
            });
          });

        models.temp_promos
          .update(
            {
              used: 1,
            },
            {
              where: {
                promo_num: req.body.promo_num,
              },
            }
          )
          .then((result) => {
            res.json({
              message: "success",
              result: result,
            });
          })
          .catch((err) => {
            console.error(err);
            res.json({
              message: "fail",
            });
          });
      } else {
        res.json({
          message: "fail",
          result: "wrong num",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
        result: "wrong num2",
      });
    });
};

exports.post_temp_promos_edit = (req, res) => {
  models.temp_promos
    .update(
      {
        //data
        temp_promo_id: req.body.temp_promo_id,
        promo_num: req.body.promo_num,
        used: req.body.used,
      },
      {
        //condition
        where: {
          temp_promo_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
// sns_id

exports.get_customers_sns_edit = (req, res) => {
  models.customers
    .findOne({
      where: {
        sns_id: req.params.id,
      },
    })
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// version check

exports.get_version_check = (req, res) => {
  const maxVersion = "1.0";
  models.customer_logs
    .findOne({
      attributes: ["appversion"],
      where: {
        customer_id: req.params.id,
      },
    })
    .then((result) => {
      console.log(result);
      console.log(result.appversion);
      if (result.appversion == maxVersion) {
        res.json({
          message: "success",
          result: "maxVersion",
        });
      } else {
        res.json({
          message: "fail",
          result: "not maxVersion",
        });
      }
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
//return version
exports.get_ret_v = (req, res) => {
  res.json({
    message: "success",
    minversion: "1.0.5",
  });
};

// sensors

exports.get_sensors = (_, res) => {
  models.sensor_datas
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_sensors = (req, res) => {
  console.log("post try");
  console.log("body =" + req.body);
  models.sensor_datas
    .create(req.body)
    .then(() => {
      console.log("body =" + req.body);
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};

// cart_items table
exports.get_img = (req, res) => {
  fs.readFile("controllers/admin/onion.jpeg", function (err, data) {
    res.writeHead(200, { "Context-Type": "image/jpg" });
    //res.write(data);
    res.end(data); //클라이언트에게 응답을 전송한다
  });
};

exports.get_img_thumbs = (req, res) => {
  fs.readFile(
    "controllers/admin/img/thumb/" + req.params.filename,
    function (err, data) {
      console.log(req.params.filename);

      res.writeHead(200, {
        "Context-Type": "image/jpg",
      });
      res.end(data); //클라이언트에게 응답을 전송한다
    }
  );
};

exports.get_img_detailpage_upload = (req, res) => {
  fs.readFile(
    "controllers/admin/img/detailpage_upload/" + req.params.filename,
    function (err, data) {
      console.log(req.params.filename);

      res.writeHead(200, {
        "Context-Type": "image/jpg",
      });
      res.end(data); //클라이언트에게 응답을 전송한다
    }
  );
};

exports.get_img_product = (req, res) => {
  fs.readFile(
    "controllers/admin/img/products/" + req.params.filename,
    function (err, data) {
      console.log(req.params.filename);

      res.writeHead(200, {
        "Context-Type": "image/jpg",
      });
      res.end(data); //클라이언트에게 응답을 전송한다
    }
  );
};

exports.get_img_description = (req, res) => {
  fs.readFile(
    "controllers/admin/img/description/" + req.params.filename,
    function (err, data) {
      console.log(req.params.filename);

      res.writeHead(200, {
        "Context-Type": "image/jpg",
      });
      res.end(data); //클라이언트에게 응답을 전송한다
    }
  );
};

// app min verstion

// inventories

exports.get_appinfos = (_, res) => {
  models.appinfos
    .findAll({})
    .then((result) => {
      res.json({
        message: "success",
        result,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    }); // 이곳으로 productList보내기
};

exports.post_appinfos = (req, res) => {
  models.appinfos
    .update(
      {
        //data
        min_version: req.body.min_version,
      },
      {
        //condition
        where: {
          id: 1,
        },
      }
    )
    .then(() => {
      res.json({
        message: "success",
        result: req.body,
      });
    })
    .catch((err) => {
      console.error(err);
      res.json({
        message: "fail",
      });
    });
};
// get address map

exports.get_address_map_kakao = (req, res) => {
  res.render("admin/kakao_map.html", {
    lat: req.params.lat,
    long: req.params.long,
  });
};

// get streming
exports.get_streaming = (req, res) => {
  //res.sendFile("controllers/aadmin/streaming/testStreaming/streaming.html")
  res.render("admin/streaming.html");
};

/*
ADMIN PAGE
*/

exports.get_admin_products = (_, res) => {
  models.products.findAll({}).then((products) => {
    res.render("admin/products.html", {
      products: products,
    });
  }); // 이곳으로 productList보내기
};

exports.get_admin_products_write = (_, res) => {
  res.render("admin/product_write.html");
};

exports.post_admin_products_write = (req, res) => {
  console.log(req.body);
  // insert하는 두가지 방법
  models.products
    .create({
      category: req.body.category,
      name: req.body.name,
      retail_price: req.body.retail_price,
      location: req.body.location,
      description: req.body.description,
      img_path: req.body.img_path,
      provider_id: req.body.provider_id,
      sku: req.body.sku,
      name_eng: req.body.name_eng,
      type: req.body.type,
      intro: req.body.intro,
      measure_1: req.body.measure_1,
      measure_2: req.body.measure_2,
      storage_desc: req.body.storage_desc,
      recipe: req.body.recipe,
      nutrition: req.body.nutrition,
      description_img_path: req.body.description_img_path,
    })
    .then(() => {
      res.redirect("/admin/admin_products");
    });
};

exports.get_admin_products_detail = (req, res) => {
  models.products.findByPk(req.params.id).then((product) => {
    //res.send(product);
    res.render("admin/detail.html", {
      product: product,
    });
  });
};

exports.get_admin_products_delete = (req, res) => {
  console.log("delete function");
  models.products
    .destroy({
      where: {
        product_id: req.params.id,
      },
    })
    .then(() => {
      res.redirect("/admin/admin_products");
    });
};

exports.get_admin_products_edit = (req, res) => {
  models.products.findByPk(req.params.id).then((product) => {
    res.render("admin/product_write.html", {
      product,
    });
  });
};

exports.post_admin_products_edit = (req, res) => {
  models.products
    .update(
      {
        //data
        category: req.body.category,
        name: req.body.name,
        retail_price: req.body.retail_price,
        location: req.body.location,
        description: req.body.description,
        img_path: req.body.img_path,
        provider_id: req.body.provider_id,
        sku: req.body.sku,
        name_eng: req.body.name_eng,
        type: req.body.type,
        intro: req.body.intro,
        measure_1: req.body.measure_1,
        measure_2: req.body.measure_2,
        storage_desc: req.body.storage_desc,
        recipe: req.body.recipe,
        nutrition: req.body.nutrition,
      },
      {
        //condition
        where: {
          product_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.redirect("/admin/admin_products/detail/" + req.params.id);
    });
};

//customers
exports.get_admin_customers = (_, res) => {
  models.customers.findAll({}).then((customers) => {
    res.render("admin/customers.html", {
      customers: customers,
    });
  }); // 이곳으로 productList보내기
};

exports.get_admin_customers_write = (_, res) => {
  res.render("admin/customers_write.html");
};

exports.post_admin_customers_write = (req, res) => {
  console.log(req.body);
  // insert하는 두가지 방법
  models.customers
    .create({
      name: req.body.name,
      password: req.body.password,
      email: req.body.email,
      birthdate: req.body.birthdate,
      phone: req.body.phone,
      address: req.body.address,
      createdate: req.body.createdate,
      sns_id: req.body.sns_id,
      post_code: req.body.post_code,
      detailed_address: req.body.detailed_address,
    })
    .then(() => {
      res.redirect("/admin/admin_customers");
    });
};

exports.get_admin_customers_detail = (req, res) => {
  models.customers.findByPk(req.params.id).then((customers) => {
    //res.send(product);
    res.render("admin/customers_detail.html", {
      customers: customers,
    });
  });
};

exports.get_admin_customers_delete = (req, res) => {
  console.log("delete function");
  models.customers
    .destroy({
      where: {
        customer_id: req.params.id,
      },
    })
    .then(() => {
      res.redirect("/admin/admin_customers");
    });
};

exports.get_admin_customers_edit = (req, res) => {
  models.customers.findByPk(req.params.id).then((customers) => {
    res.render("admin/customers_write.html", {
      customers,
    });
  });
};

exports.post_admin_customers_edit = (req, res) => {
  models.customers
    .update(
      {
        //data
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        birthdate: req.body.birthdate,
        phone: req.body.phone,
        address: req.body.address,
        createdate: req.body.createdate,
        sns_id: req.body.sns_id,
        post_code: req.body.post_code,
        detailed_address: req.body.detailed_address,
      },
      {
        //condition
        where: {
          customer_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.redirect("/admin/admin_customers/detail/" + req.params.id);
    });
};

// inventories
exports.get_admin_inventories = (_, res) => {
  models.inventories
    .findAll({
      include: [
        {
          model: models.products,
        },
      ],
    })
    .then((inventories) => {
      res.render("admin/inventories.html", {
        inventories: inventories,
      });
    }); // 이곳으로 productList보내기
};

exports.get_admin_inventories_write = (_, res) => {
  res.render("admin/inventory_write.html");
};

exports.post_admin_inventories_write = (req, res) => {
  console.log(req.body);
  // insert하는 두가지 방법
  models.inventories
    .create({
      quantity: req.body.quantity,
      product_id: req.body.product_id,
    })
    .then(() => {
      res.redirect("/admin/admin_inventories");
    });
};

exports.get_admin_inventories_detail = (req, res) => {
  models.inventories.findByPk(req.params.id).then((inventory) => {
    //res.send(product);
    res.render("admin/inventory_detail.html", {
      inventory: inventory,
    });
  });
};

exports.get_admin_inventories_delete = (req, res) => {
  console.log("delete function");
  models.inventories
    .destroy({
      where: {
        inventory_id: req.params.id,
      },
    })
    .then(() => {
      res.redirect("/admin/admin_inventories");
    });
};

exports.get_admin_inventories_edit = (req, res) => {
  models.inventories.findByPk(req.params.id).then((inventory) => {
    res.render("admin/inventory_write.html", {
      inventory,
    });
  });
};

exports.post_admin_inventories_edit = (req, res) => {
  console.log("ID: " + req.params.id);

  models.inventories
    .update(
      {
        //data

        quantity: req.body.quantity,
        product_id: req.body.product_id,
      },
      {
        //condition
        where: {
          inventory_id: req.params.id,
        },
      }
    )
    .then(() => {
      res.redirect("/admin/admin_inventories/detail/" + req.params.id);
    });
};

// orders
exports.get_admin_orders = (_, res) => {
  models.purchases
    .findAll({
      include: [{ model: models.carts }, { model: models.customers }],
    })
    .then((purchases) => {
      res.render("admin/orders.html", {
        orders: purchases,
      });
    }); // 이곳으로 productList보내기
};

// cart item detail
exports.get_admin_cart_items_detail = (req, res) => {
  models.cart_items
    .findAll({
      include: [
        {
          model: models.products,
        },
      ],
      where: {
        cart_id: req.params.id,
      },
    })
    .then((cart_items) => {
      console.log(cart_items);
      res.render("admin/cart_items_detail.html", {
        cart_items: cart_items,
      });
    });
};
exports.get_admin_orders_write = (_, res) => {};

exports.post_admin_orders_write = (req, res) => {
  console.log(req.body);
};

exports.get_admin_orders_detail = (req, res) => {};

exports.get_admin_orders_delete = (req, res) => {
  console.log("delete function");
};

exports.get_admin_orders_edit = (req, res) => {};

//login

exports.post_login = async (req, res) => {
  try {
    var token = jwt.sign(
      {
        sns_id: req.body.sns_id,
      },
      secretObj,
      {
        expiresIn: "1000d",
      }
    );

    const customer = await models.customers.findOne({
      where: {
        sns_id: req.body.sns_id,
        join_platform: req.body.join_platform,
      },
    });
    res.cookie("customer_t", token);
    res.header("customer_t", token);
    if (customer) {
      console.log("sns_id is duplicated");
      res.json({
        message: "success",
        existed: "y",
        token: token,
        result: customer,
      });
    } else {
      const newCustomer = await models.customers.create(req.body);
      var now = new Date();
      var oneMonthLater = new Date(now.setMonth(now.getMonth() + 1));
      await models.coupons.create({
        customer_id: newCustomer.customer_id,
        type: 1,
        value: 10000.0,
        expire_date: oneMonthLater,
        coupon_num: `${newCustomer.customer_id}${Date.now()}`,
        description: "가입 축하 쿠폰입니다.",
        used: 0,
      });
      res.json({
        message: "success",
        existed: "n",
        token: token,
        result: newCustomer,
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      message: "fail",
    });
  }
};
// old
/*
exports.get_products = ( _ , res) => {
    models.Products.findAll({

    }).then((producs)=>{
        res.render('admin/products.html', {producs: producs})
    }) // 이곳으로 productList보내기
}

exports.get_products_write = ( _ , res) => {
    res.render( 'admin/write.html');
}

exports.post_products_write = ( req , res ) => {
    //res.send(req.body);
    // insert하는 두가지 방법
    models.Products.create({
        name : req.body.name,
        price : req.body.price ,
        description : req.body.description
    }).then( () => {
        
    });
    models.Products.create(req.body).then( () => {
        
    });
    res.redirect('/admin/products');
    
} 

exports.get_products_detail = ( req, res ) => {
    models.Products.findByPk(req.params.id).then( (product) => {
        //res.send(product);
        res.render('admin/detail.html', { product: product });  
    });
};

exports.get_products_edit = (req, res) => {
    models.Products.findByPk(req.params.id).then((product)=>{
        res.render('admin/write.html', {product})
    })
}

exports.post_products_edit = (req, res) =>{
    models.Products.update({
        //data
        name: req.body.name,
        price: req.body.price,
        description: req.body.description
    },{
        //condition
        where: {id: req.params.id}
    }).then(()=>{
        res.redirect('/admin/products/detail/'+req.params.id);
    })
}

exports.get_products_delete = (req, res) => {
    models.Products.destroy({
        where:{
            id: req.params.id
        }
    }).then(()=>{
        res.redirect('/admin/products')
    })
}

*/
