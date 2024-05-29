import express from "express"
import { getAllProducts, getAllSalesMonthProducts, getBarChartProducts, getPichartProducts } from "../controllers/transactions.js";

const router = express.Router();

router.get("/products", getAllProducts);

router.get('/salesMonth', getAllSalesMonthProducts)

router.get("/barChart", getBarChartProducts);

router.get("/piechart", getPichartProducts)

export default router