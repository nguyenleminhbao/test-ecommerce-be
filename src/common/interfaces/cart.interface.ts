export interface ICart {
  id?: number;
  userId?: number;
  cartItems: ICartItem[];
}

export interface ICartItem {
  id?: string;
  cartId?: number;
  variantId: number;
  quantity: number;
  image: string;
  price: number;
  title: string;
  productType?: string;
  shopId?: string;
  shopName?: string;
}

export interface IShopCart {
  shopId: string;
  variantIds: number[];
}
