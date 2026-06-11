export type CartLine={productId:string;quantity:number}; const key='murgdur-cart';
export function readCart():CartLine[]{if(typeof window==='undefined')return[];return JSON.parse(window.localStorage.getItem(key)||'[]') as CartLine[]}
export function writeCart(lines:CartLine[]){if(typeof window!=='undefined')window.localStorage.setItem(key,JSON.stringify(lines))}
