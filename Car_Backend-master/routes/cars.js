const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Car = require("../models/Car");

// @route   POST /api/cars
// @desc    Create a new car
// @access  Private

const { upload } = require("../middleware/multerFileUpload.js");
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

router.post(
  "/",
  auth,
  upload.fields([
    {
      name: "profileImage", // you can access this file inside controller using this name
      maxCount: 1,
    },

    // add multiple object inside this array to upload multiple file
    // this middleware will add a .file inside the req object
  ]),
  async (req, res) => {
    const { title, description, tags, images } = req.body;
    const updatedValues = req.body
    //get the current local path of the uploaded image
    // following gives the current local path where the file is uploaded
    let profileImageLocalPath = null; // image may not be uploaded
    if (req.files?.profileImage?.length) {
      // if the file is sent fromt the user side then upload it
      profileImageLocalPath = req.files?.profileImage[0]?.path;
      // upload the file on cloudinary
      const urls = await uploadOnCloudinary(profileImageLocalPath);

      console.log("updated image",urls);
      
    }

    console.log(req.files)
    try {
      const newCar = new Car({
        user: req.user.id,
        title,
        description,
        tags,
        images: images.map((image) => ({
          url: image.url,
          public_id: image.public_id,
        })),
      });

      const car = await newCar.save();
      res.json(car);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server error");
    }
  }
);

// @route   GET /api/cars
// @desc    Get all cars of the logged-in user with search
// @access  Private
router.get("/", auth, async (req, res) => {
  const { search } = req.query;
  let query = { user: req.user.id };

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { tags: { $in: [new RegExp(search, "i")] } },
    ];
  }

  try {
    const cars = await Car.find(query).sort({ createdAt: -1 });
    res.json({ cars });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   GET /api/cars/:id
// @desc    Get car by ID
// @access  Private
router.get("/:id", auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ msg: "Car not found" });
    }

    if (car.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    res.json({ car });
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Car not found" });
    }
    res.status(500).send("Server error");
  }
});

// @route   PUT /api/cars/:id
// @desc    Update a car
// @access  Private
router.put("/:id", auth, async (req, res) => {
  const { title, description, tags, images } = req.body;

  // Build car object
  const carFields = {};
  if (title) carFields.title = title;
  if (description) carFields.description = description;
  if (tags) carFields.tags = tags;
  if (images) {
    carFields.images = images.map((image) => ({
      url: image.url,
      public_id: image.public_id,
    }));
  }

  try {
    let car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ msg: "Car not found" });
    }

    if (car.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    car = await Car.findByIdAndUpdate(
      req.params.id,
      { $set: carFields },
      { new: true }
    );

    res.json({ car });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE /api/cars/:id
// @desc    Delete a car
// @access  Private
router.delete("/:id", auth, async (req, res) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) {
      return res.status(404).json({ msg: "Car not found" });
    }

    if (car.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "User not authorized" });
    }

    await car.deleteOne();
    res.json({ msg: "Car removed" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   DELETE /api/cars/image/:public_id
// @desc    Delete an image from Cloudinary
// @access  Private
router.delete("/image/:public_id", auth, async (req, res) => {
  try {
    // Note: You'll need to implement the actual Cloudinary deletion here
    // This is just the route handler structure
    res.json({ msg: "Image removed from Cloudinary" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
