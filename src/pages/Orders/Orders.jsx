import React, { useContext, useEffect, useState } from "react";
import LayOut from "../../Layout/LayOut";
import { db } from "../../Utility/firebase";
import { DataContext } from "../../Components/DataProvider/DataProvider";
import classes from "./Orders.module.css";
import ProductCard from "../../Components/Product/ProductCard";
import moment from "moment";

function Orders() {
  const [{ user }] = useContext(DataContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      return;
    }

    const unsubscribe = db
      .collection("users")
      .doc(user.uid)
      .collection("orders")
      .orderBy("created", "desc")
      .onSnapshot((snapshot) => {
        setOrders(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
            amount: doc.data().amount,
            created: doc.data().created,
          }))
        );
      });

    return () => unsubscribe();
  }, [user]);

  return (
    <LayOut>
      <section className={classes.container}>
        <div className={classes.orders__container}>
          <h2 style={{ margin: "20px" }}>Your Orders</h2>

          {orders.length === 0 && (
            <div style={{ padding: "20px" }}>you don't have orders yet.</div>
          )}

          {orders.map((eachOrder) => (
            <div key={eachOrder.id}>
              <hr />
              <p>Order ID: {eachOrder.id}</p>
              <p>Total: ${eachOrder.amount}</p>
              <p>
                Date:{" "}
                {moment(eachOrder.created * 1000).format(
                  "dddd, MMM DD, YYYY h:mm A"
                )}
              </p>

              {eachOrder.data.basket.map((item) => (
                <ProductCard key={item.id} product={item} flex={true} />
              ))}
            </div>
          ))}
        </div>
      </section>
    </LayOut>
  );
}

export default Orders;
