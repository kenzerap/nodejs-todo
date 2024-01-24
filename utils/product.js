const { toCategoryViewModel } = require('./category');

exports.toProductViewModel = (productDoc) => {
  return {
    id: productDoc._id,
    name: productDoc.name,
    price: productDoc.price,
    imageUrls: productDoc.imageUrls,
    description: productDoc.description,
    category: productDoc.categoryId
      ? toCategoryViewModel(productDoc.categoryId)
      : null,
    soldCount: productDoc.soldCount,
    discountPercentage: productDoc.discountPercentage,
  };
};
