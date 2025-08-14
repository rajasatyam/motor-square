export const serializedCarData = (car, wishlisted = false) => {
  const data = car.toObject(); 

  return {
    ...data,
    price: data.price ? parseFloat(data.price.toString()) : 0,
    wishlisted,
  };
};


