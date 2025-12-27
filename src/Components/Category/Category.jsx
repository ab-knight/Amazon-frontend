import React from 'react'
import { categoryInfos } from "./CategoryInfo";
import CategoryCard from './CategoryCard'
import classes from "./category.module.css"
function Category() {
  return (
    <section className={classes.category__container}>
      {categoryInfos.map((Info, index) => {
        return <CategoryCard key={index} data={Info} />;
      })}
    </section>
  );
}

export default Category
