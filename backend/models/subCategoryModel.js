import mongoose from 'mongoose';

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  {
    timestamps: true,
  }
);

const Subcategory = mongoose.model('Subcategory', subCategorySchema);

export default Subcategory;
