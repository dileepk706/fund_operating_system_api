export const changeStringToNumber = (value: any): number => {
  const number = typeof value === "string" ? parseInt(value) : 0;
  return number;
};

export const getSortingObject = (value: string) => {
  if (value === "totalBuyingPrice") {
    return { totalBuyingPrice: -1 };
  } else if (value === "qty") {
    return { qty: -1 };
  } else {
    return { updatedOn: -1 };
  }
};

