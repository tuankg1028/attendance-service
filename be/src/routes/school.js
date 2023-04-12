import express from "express";

import schoolController from "../controllers/school";

const router = express.Router();

router.get("/", schoolController.getSchools);

module.exports = router;
