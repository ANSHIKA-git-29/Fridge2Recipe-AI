const key='f2r-recipes'; export const getRecipes=()=>{try{return JSON.parse(localStorage.getItem(key))||[]}catch{return[]}}; export const saveRecipes=(v)=>localStorage.setItem(key,JSON.stringify(v));
