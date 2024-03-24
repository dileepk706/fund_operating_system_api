export type Sortby =
  | "updatedOn"
  | "createdOn"
  | "buyingPrice"
  | "profit"
  | "loss"
  | "returnOnInvestment"
  | "holdingPeriodInDays"
  | "invested"
  | "totalProfit";

export const changeStringToNumber = (value: any): number => {
  const number = typeof value === "string" ? parseInt(value) : 0;
  return number;
};

export type getSortingObjectType = {
  sortBy?: Sortby;
  orderBy?: "asc" | "des";
};
export const getSortingObject = ({ orderBy, sortBy }: getSortingObjectType) => {
  let orderby = -1;
  let sortObt: any = {};
  orderby = orderBy === "asc" ? 1 : -1;
  sortObt[sortBy || "updatedOn"] = orderby;
  return sortObt;
};

export const isValidURL = (url: string): boolean => {
  const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
  return urlPattern.test(url);
};


export const getFilterObject = (filterObt: any) => {
  let filterObject = {}

  const strikeTarget = {
    $expr: {
      $and: [
        { $gte: ["$target", "$buyingPrice"] },
        { $gte: ["$ltd", "$target"] },
      ],
    },
  };

  const strikeSl = {
    $expr: {
      $and: [{ $lte: ["$sl", "$buyingPrice"] }, { $lte: ["$ltd", "$sl"] }],
    },
  };

  const inProfit = {
    tradeInLoss: false,
  };
  const inLoss = {
    tradeInLoss: true,
  };
  const sector = {
    sector: filterObt.sector,
  };
  const stock = {
    stock: filterObt.stock,
  };

  if (filterObt.stock) {
    filterObject = {...filterObject, ...stock };
  }
  if (filterObt.sector) {
    filterObject = {...filterObject, ...sector };
  }
  if (filterObt.profit) {
    filterObject = {...filterObject, ...inProfit };
  }
  if (filterObt.loss) {
    filterObject = {...filterObject, ...inLoss };
  }
  if (filterObt.strikeTarget) {
    filterObject = {...filterObject, ...strikeTarget };
  }
  if (filterObt.strikeSl) {
    filterObject = {...filterObject, ...strikeSl };
  }

  return filterObject;
};