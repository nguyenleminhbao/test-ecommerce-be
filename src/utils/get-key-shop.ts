export const getKeyShop = (shopKey: string) => {
  const splitKey = shopKey.split(':', 2);
  return splitKey.length > 1 ? splitKey[1] : undefined;
};
