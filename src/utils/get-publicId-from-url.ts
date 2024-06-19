export const getPublicIdFromUrl = (url: string) => {
  const regex = /https:\/\/storage\.googleapis\.com\/([^/]+)\/e-commerce\/(.*)/;
  const match = url.match(regex);
  return match ? 'e-commerce/' + match[2] : 'ecommerce/no';
};
