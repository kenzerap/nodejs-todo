exports.toCategoryViewModel = (categoryDoc) => {
  return {
    id: categoryDoc._id,
    name: categoryDoc.name,
    code: categoryDoc.code,
    imageUrl: categoryDoc.imageUrl,
    description: categoryDoc.description,
  };
};
