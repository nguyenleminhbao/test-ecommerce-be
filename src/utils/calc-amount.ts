import { CartItem } from '@prisma/client';

export const calcAmount = (cartItems: CartItem[]) => {
  let amount = 0;

  cartItems.forEach((cartItem) => {
    amount += cartItem.price * cartItem.quantity;
  });
  return amount;
};
