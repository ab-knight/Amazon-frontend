import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from "axios"
import { ProductUrl } from '../../Api/endPoints'
import ProductCard from '../../Components/Product/ProductCard'
import Loader from '../../Components/Loader/Loader'
import LayOut from '../../Layout/LayOut'

function ProductDetail() {
  const { productId } = useParams()
  const [products ,setProduct] = useState([])
  const [isLoading,setIsLoading] = useState(false)
  console.log("poduct detail page called", useParams())
  useEffect(() => {
    setIsLoading(true)
    axios.get(`${ProductUrl}/products/${productId}`)
    .then((res)=>{
      setProduct(res.data)
      setIsLoading(false)
    }).catch((err)=> {
      console.log(err)
    setIsLoading(false)})
    
  },[])
 
  return (
    <LayOut>
    
    {
      isLoading ? (<Loader />):(<ProductCard key={products.id}  product = {products} flex = {true} desc={true}/>)
      
    }   
    </LayOut>
  )  
}

export default ProductDetail;
