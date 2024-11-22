import express from "express"
import { protectRoute } from "../middleware/protectRoutes.js";
import { changePassword, updateDetails, updateImage, user } from "../controllers/user.controllers.js";

const router = express.Router();

router.put("/update/image",protectRoute,updateImage);
router.post("/update/details",protectRoute,updateDetails);
router.post("/update/password",protectRoute,changePassword);
router.get("/",protectRoute,user);

export default router;