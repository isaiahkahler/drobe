export interface Library {
  clothes: Array<Item>;
}

export interface Item {
  class: "top" | "bottom" | "full" | "shoes" | "accessory";
  type: Type;
  color: string;
  date: Date;
  uses: number;
  laundry: number;
}

export interface Type {
  top?: "t-shirt" | "coat" | "";
  bottom?: "jeans";
  shoes?: "sneakers" | "running shoes" | "boots" | "sandals" | "";
  full?: "dress"
  accessory?: "hat" | "tie" | "belt" | "glove" | "bracelet" | "socks" ;
}

export const Formality_1 = [];
export const Formality_2 = [];
export const Formality_3 = [];
export const Formality_4 = [];

export function getFormality(item: Item) {
  let type = item.type[item.class];
  for(let check of Formality_1){
    if(check === type){
      return 1;
    }
  }
  for(let check of Formality_2){
    if(check === type){
      return 2;
    }
  }
  for(let check of Formality_3){
    if(check === type){
      return 3;
    }
  }
  for(let check of Formality_4){
    if(check === type){
      return 4;
    }
  }
  return new Error(`oh that shouldn't have happened.`);
}