const express = require("express");

const {
  AddNewOrder,
  GetAllOrders,
  GetOrderByIdHotel,
  GetOrderByIdUser,
  GetOrderById,
  UpdateOrder,
  DeleteOrder,
  UpdateReview,
  UpdateStatus,
  GetOrderByDate,
  GetOrderByQuarter
} = require("../controllers/orderController");

const router = express.Router();

router.get("/getallorders", GetAllOrders);
router.get("/hotel/:id_hotel", GetOrderByIdHotel);
router.get("/user/:id", GetOrderByIdUser);
router.get("/:id", GetOrderById);
router.post("/getbyquarter", GetOrderByQuarter);
router.post("/addneworder", AddNewOrder);
router.post("/getbydate", GetOrderByDate);
router.put("/update/:id", UpdateOrder);
router.put("/reviewd/:id", UpdateReview);
router.put("/status/:id", UpdateStatus);
router.delete("/delete/:id", DeleteOrder);

module.exports = router;
