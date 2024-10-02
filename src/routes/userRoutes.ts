import { Router } from "express";
import { handleImageUpload } from "../configs/multer";
import { body } from "express-validator";
import validateId from "../middlewares/validateId";
import validate from "../middlewares/validate";

const router: Router = Router();

router.post(
  "/block/:id",
  validateId()
  //blockUser
);

router.patch(
  "/me",
  [
    body("firstName", "invalid firstName").optional().isString().trim(),
    body("lastName", "invalid lastName").optional().isString().trim(),
  ],
  validate
  //updateMe
);

router.put(
  "/profile-image",
  handleImageUpload
  //updateProfileImage
);

export default router;
