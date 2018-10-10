export interface Library {
  clothes: Array<Item>;
}

export interface Item {
  class: "top" | "bottom" | "full body" | "shoes" | "accessory";
  name: string;
  type: Top | Bottom | Full | Shoes | Accessory;
  color: string;
  date: number;
  uses: number;
  laundry: number;
  cover: boolean;
}

export const ItemDefinitions = {
  classes: ['top', 'bottom', 'full', 'shoes', 'accessory'],
  types: {
    top: ["blazer", "blouse", "cardigan", "coat", "dress shirt", "hoodie", "jacket", "polo", "shirt", "sweatshirt", "t-shirt", "vest"],
    bottom: ["capri's", "dress pants", "jeans", "joggers", "leggings", "shorts", "skirt", "sweatpants", "trousers", "yoga pants"],
    fullBodies: ["dress", "jumpsuit", "overalls", "poncho", "robe", "romper", "tall coat"],
    shoes: ["boots", "clogs", "dress shoes", "heels", "moccasin", "running shoes", "sandals", "slides", "slip-ons", "sneakers"],
    accessories: ["bag", "belt", "bow tie", "bracelet", "glasses", "gloves", "hat", "scarf", "shawl", "socks", "tie"]
  }
};

// export interface Type {
//   top?: "t-shirt" | "coat" | "";
//   bottom?: "jeans";
//   shoes?: "sneakers" | "running shoes" | "boots" | "sandals" | "";
//   full?: "dress"
//   accessory?: "hat" | "tie" | "belt" | "glove" | "bracelet" | "socks" ;
// }

export interface Top {
  type: "blazer" | "blouse" | "cardigan" | "coat" | "dress shirt" | "hoodie" | "jacket" | "polo" | "shirt" | "sweatshirt" | "t-shirt" | "vest";
}
export interface Bottom {
  type: "capri's" | "dress pants" | "jeans" | "joggers" | "leggings" | "shorts" | "skirt" | "sweatpants" | "trousers" | "yoga pants";
}
export interface Full {
  type: "dress" | "jumpsuit" | "overalls" | "poncho" |  "robe" | "romper" | "tall coat";
}
export interface Shoes {
  type: "boots" | "clogs" | "dress shoes" | "heels" | "moccasin" | "running shoes" | "sandals" | "slides" | "slip-ons" | "sneakers";
}
export interface Accessory {
  type: "bag" | "belt" | "bow tie" | "bracelet" | "glasses" | "gloves" | "hat" | "scarf" | "shawl" | "socks" | "tie";
}

export const Formality_1 = [];
export const Formality_2 = [];
export const Formality_3 = [];
export const Formality_4 = [];

export function getFormality(item: Item) {
  let type = item.type.type;
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