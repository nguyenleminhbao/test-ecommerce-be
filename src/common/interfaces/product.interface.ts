export interface IProduct {
  id: string;
  shopId: string;
  title: string;
  body_html: string;
  vendor: string;
  product_type: string;
  created_at: string;
  handle: string;
  updated_at: string;
  published_at: string;
  template_suffix: string;
  published_scope: string;
  tags: string;
  status: string;
  admin_graphql_api_id: string;
  variants: IVariant[];
  options: IOption[];
  images: IImage[];
  image: IImage;
}

export interface IVariant {
  id: number;
  product_id: number;
  title: string;
  price: string;
  sku: string;
  position: number;
  inventory_policy: string;
  compare_at_price: any;
  fulfillment_service: string;
  inventory_management: string;
  option1: string;
  option2: any;
  option3: any;
  created_at: string;
  updated_at: string;
  taxable: boolean;
  barcode: string;
  grams: number;
  weight: number;
  weight_unit: string;
  inventory_item_id: number;
  inventory_quantity: number;
  old_inventory_quantity: number;
  requires_shipping: boolean;
  admin_graphql_api_id: string;
  image_id: number;
  variant_image: string;
}

export interface IOption {
  id: number;
  product_id: number;
  name: string;
  position: number;
  values: string[];
}

export interface IImage {
  id: number;
  alt: any;
  position: number;
  product_id: number;
  created_at: string;
  updated_at: string;
  admin_graphql_api_id: string;
  width: number;
  height: number;
  src: string;
  variant_ids: any[];
}
