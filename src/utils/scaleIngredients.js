export const scaleIngredients=(ingredients,from,to)=>ingredients.map(item=>({...item,quantity:Math.round((item.quantity*to/from)*100)/100}));
