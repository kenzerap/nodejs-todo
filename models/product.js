const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
    },
    description: {
      type: String,
    },
    //category
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
