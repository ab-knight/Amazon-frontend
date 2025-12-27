import React, { useContext, useState } from 'react'
import LayOut from '../../Layout/LayOut'
import classes from './Payment.module.css'
import { DataContext } from '../../Components/DataProvider/DataProvider'
import ProductCard from '../../Components/Product/ProductCard'
// import { useStripe } from '@stripe/react-stripe-js'
import {useStripe, useElements,CardElement} from '@stripe/react-stripe-js';
import CurrencyFormat from '../../Components/CurrencyFormat/CurrencyFormat'
import { axiosInstance } from '../../Api/axios'
import { ClipLoader } from 'react-spinners'
import { db } from '../../Utility/firebase'
import { useNavigate } from 'react-router-dom'
import { Type } from '../../Utility/action.type'

function Payment() {
  const [{user,basket},dispatch] = useContext(DataContext)
  const [error,setError] = useState(null)
  const [processing,setProcessing] = useState(false)

  const totalItem = basket?.reduce((amount,item)=>{
    return item.amount + amount
  },0)
  
  const totalPrice = basket?.reduce((amount,item)=>{
    return item.price * item.amount + amount
  },0)


  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate()

  const handleChange = (e) => {
    // console.log(e)
    e?.error?.message && setError(e?.error?.message)
  }
  const handlePayment = async (e) => {
    e.preventDefault();

    // ✅ safety checks
    if (!stripe || !elements) {
      console.log("Stripe not ready");
      return;
    }

    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      setProcessing(true);

      // ✅ Stripe amount must be INTEGER
      const response = await axiosInstance.post(
        `/payment/create?total=${Math.round(totalPrice * 100)}`
      );

      console.log("payment page", response.data);

      const clientSecret = response.data.clientSecret;

      // ✅ confirm payment
      const { paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      console.log("Stripe success");

      // ✅ Firestore v8 write
      await db
        .collection("users")
        .doc(user.uid)
        .collection("orders")
        .doc(paymentIntent.id)
        .set({
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created,
        });

      console.log("Firestore success");

      // ✅ clear basket
      dispatch({ type: Type.EMPTY_BASKET });

      setProcessing(false);

      console.log("Redirecting to orders");

      // ✅ redirect
      navigate("/orders");
    } catch (error) {
      console.log("PAYMENT ERROR ❌", error);
      setProcessing(false);
    }
  };


    //1. backend || function ---> contact to the client secret


    //2. client side (react side confirmation )


    //3. after the confirmation --> order firbase save , clear basket 

    // console.log("payment")
    // const { error, paymentMethod } = await stripe.createPaymentMethod({

  
  return (
    <LayOut>
      {/* payment page */}
      <div className={classes.payment__header}>  checkout ({totalItem}) items    </div>

      <section className={classes.payment}>
        {/* address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>
          <div>
            <div>{user?.email}</div>
            <div>123 React Lane</div>
            <div>Chicago, IL</div>
          </div>
        </div>
        <hr />
        {/* product */}
        <div className={classes.flex}>
        <h3>Review items and delivery </h3>
          <div>
           { basket?.map((item)=> <ProductCard product={item} flex={true} renderAdd={true}/>)}
          </div>
        </div>
        <hr />
        {/* card form */}
        <div className={classes.flex}>
          <h3>Payment methods </h3>
          <div className={classes.payment__card__container}>
            <div className={classes.payment__details}>
              
              <form onSubmit={handlePayment}>
                {error && <small style={{color:"red"}}>{error}</small>}
                <CardElement onChange={handleChange}/>
                <div className={classes.payment__price}>
                  <div>
                    <span style={{display:"flex",justifyContent:"space-between",fontWeight:"bold"}}>
                      <p>Total Order</p> | <CurrencyFormat amount={totalPrice}/>
                    </span>
                  </div>
                  <button type='submit'>
                  {
              processing?(
              <div className={classes.loading}>
                <ClipLoader color='gray' size={15}/>
                <p>Please wait ...</p>
              </div>
              ):("Pay Now")
            }
                    </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  )
}

export default Payment
