export interface Page {
    items: Item[];
  }
  
  export interface Item {
    class: 'top' | 'bottom' | 'full' | 'shoes' | 'accessory',
    type: Top | Bottom | Full | Shoes | Accessory,
    name: string,
    colors: string[],
    date: number,
    uses: number,
    laundry: number,
    photoURI: string,
    note?: string,
    brand?: string,
    size?: number,
    price?: number
}

export type Top = 'blazer' | 'blouse' | 'cardigan' | 'coat' | 'dress shirt' | 'hoodie' | 'jacket' | 'polo' | 'shirt' | 'sweatshirt' | 't-shirt' | 'tank top' | 'vest';

export type Bottom = "capri's" | 'dress pants' | 'jeans' | 'joggers' | 'leggings' | 'shorts' | 'skirt' | 'sweatpants' | 'trousers' | 'yoga pants';

export type Full = 'dress' | 'jumpsuit' | 'overalls' | 'romper';

export type Shoes = 'boots' | 'clogs' | 'dress shoes' | 'heels' | 'moccasin' | 'running shoes' | 'sandals' | 'slides' | 'slip-ons' | 'sneakers';

export type Accessory = 'bag' | 'belt' | 'bow tie' | 'bracelet' | 'glasses' | 'gloves' | 'hat' | 'scarf' | 'shawl' | 'socks' | 'tie';

export const Classes = {
  top: ['blazer', 'blouse', 'cardigan', 'coat', 'dress shirt', 'hoodie', 'jacket', 'polo', 'shirt', 'sweatshirt', 't-shirt', 'tank top', 'vest'],

  bottom: ["capri's", 'dress pants', 'jeans', 'joggers', 'leggings', 'shorts', 'skirt', 'sweatpants', 'trousers', 'yoga pants'],

  "full body": ['dress', 'jumpsuit', 'overalls', 'romper'],

  shoes: ['boots', 'clogs', 'dress shoes', 'heels', 'moccasin', 'running shoes', 'sandals', 'slides', 'slip-ons', 'sneakers'],

  accessory: ['bag', 'belt', 'bow tie', 'bracelet', 'glasses', 'gloves', 'hat', 'scarf', 'shawl', 'socks', 'tie'],
}

export interface DefineNavigationProps {
    uri: string
}