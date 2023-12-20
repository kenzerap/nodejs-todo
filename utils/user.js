exports.toUserViewModel = (userDoc) => {
  return {
    id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    phone: userDoc.phone,
    address: userDoc.address,
    status: userDoc.status,
  };
};
