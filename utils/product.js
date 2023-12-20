exports.toProductViewModel = (productDoc) => {
  return {
    id: productDoc._id,
    name: productDoc.name,
    price: productDoc.price,
    imageUrl: productDoc.imageUrl,
    description: productDoc.description,
  };
};
