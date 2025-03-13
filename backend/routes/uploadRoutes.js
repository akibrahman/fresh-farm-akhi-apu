import express from "express";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import protectMiddleware from "../middleware/protectMiddleware.js";
import asyncHandler from "../middleware/asyncHandler.js";

const router = express.Router();
const storage = multer.memoryStorage();
const __dirname = path.resolve();

function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error("Images only!"), false);
  }
}

const upload = multer({ storage, fileFilter });
const uploadSingleImage = upload.single("image");

router.post("/user", (req, res) => {
  uploadSingleImage(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    const outputPath = `frontend/public/uploads/users/${
      req.file.fieldname
    }-${Date.now()}.png`;

    try {
      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("png")
        .png({ quality: 90 })
        .toFile(outputPath);
      const transformedPath = outputPath.replace("frontend/public/", "");
      res.status(200).send({
        message: "Image uploaded and resized successfully",
        image: `${transformedPath}`,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
});

router.post("/product", (req, res) => {
  uploadSingleImage(req, res, async function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }

    const outputPath = `frontend/public/uploads/products/${
      req.file.fieldname
    }-${Date.now()}.png`;

    try {
      await sharp(req.file.buffer)
        .resize(1200, 800)
        .toFormat("png")
        .png({ quality: 90 })
        .toFile(outputPath);

      const transformedPath = outputPath.replace("frontend/public/", "");

      res.status(200).send({
        message: "Image uploaded and resized successfully",
        image: `${transformedPath}`,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
});

router.use(protectMiddleware());

router.post(
  "/removeImage",
  asyncHandler(async (req, res) => {
    const imagePath = req.body.imagePath;

    if (!imagePath) {
      throw new Error("Image path is required");
    }

    if (
      !imagePath.startsWith("uploads/users") &&
      !imagePath.startsWith("uploads/products")
    ) {
      throw new Error(
        "Invalid image path. You can only delete product or user image"
      );
    }

    if (imagePath.startsWith("uploads/products")) {
      if (!req.user.isAdmin) {
        throw new Error("You are not allowed to delete product images");
      }
    }

    const newPath = `frontend/public/${imagePath}`;

    const fullPath = path.join(__dirname, newPath);

    await new Promise((resolve, reject) => {
      fs.access(fullPath, fs.constants.F_OK, (err) => {
        if (err) {
          return res
            .status(200)
            .json({ message: "Image Removed Successfully" });
        }
        resolve();
      });
    });

    await new Promise((resolve, reject) => {
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error("Error removing image:", err);
          return reject(new Error("Failed to remove image"));
        }
        resolve();
      });
    });

    res.status(200).json({ message: "Image removed successfully" });
  })
);

export default router;
