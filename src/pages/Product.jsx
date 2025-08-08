import React, { useContext } from 'react'
import { ShopContext } from '../Context/ShopContext'
import { useParams } from 'react-router'
import Breadcrums from '../components/Breadcrums/Breadcrums'
import ProductDisplay from '../components/ProductDisplay/ProductDisplay'
import DescriptionBox from '../components/DescriptionBox/DescriptionBox'
import RelatedProducys from '../components/RelatedProducts/RelatedProducts'

const Product = () => {
  const { all_product } = useContext(ShopContext)
  const { productId } = useParams();
  const product = all_product.find((e)=>e.id === Number(productId))
  return (
    <div>
      <Breadcrums product={product} />
      <ProductDisplay product={product} />
      <DescriptionBox fullDescription={product.fullDescription} productId={product.id} />
      <RelatedProducys />
    </div>
  );
}

export default Product
