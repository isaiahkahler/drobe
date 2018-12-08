import React from 'react';
import { AsyncStorage } from 'react-native';
import { number } from 'prop-types';
import { FileSystem } from 'expo';
import Color from 'color';

export interface Page {
  // full: boolean;
  items: Item[];
}

export interface Item {
  class: 'top' | 'bottom' | 'full' | 'shoes' | 'accessory';
  // type: Top | Bottom | Full | Shoes | Accessory;'
  type: string;
  name: string;
  colors: string[];
  date: number;
  uses: number;
  laundry: number;
  photoURI: string;
  grey?: {
    message: {title: string, body: string}, 
    action?: {
      label: string, action: Function
    }
  }
}

export interface Score {
  overall: number,
  colors: number,
}

export interface Outfit {
  items: {
    top: Item | undefined;
    bottom: Item | undefined;
    full: Item | undefined,
    shoes: Item | undefined,
    layers: Item[] | undefined, 
    accessories: Item[] | undefined,
  };
  score: Score;
}

export interface Filter {
  filter: 
  { 
    class?: string, 
    type?: string, 
    cover?: number, 
    date?: number,
  }[];
  message?: string,
  action?: {title: string, action: Function},
}

//review: this doesn't work ! when you loop through each filter and key,
//the values of the key doesn't correspond with item values... ? solution??
//is this an issue? if you think about it will you ever need to grey out
//items by laundry? 

//thoughts: 
//filter interface should be split? keep hide, allowed, disallowed but priority is something completely different?
// export interface Filter {
//   keys: {
//     class: 'top' | 'bottom' | 'full' | 'shoes' | 'accessory';
//     type: string;
//     name: string;
//     colors: string[]; //review: want to ever filter by color combo?
//     date: number;
//     uses: number;
//     laundry: number;
//     photoURI: string;
//   };
//   type: 'priority' | 'hide' | 'allowed' | 'disallowed' ;
//   message?: string;
//   action?: {title: string, action: Function};
// }

/* 
example: 
{
  keys: {
    class: "top",
    id: 203493820432
  },
  type: "hide"
}
*/

//perhaps make this a class with different functions for each key
export interface Priority {
  things: {
    class?: 'top' | 'bottom' | 'full' | 'shoes' | 'accessory',
    name?: string,
    id?: number,
    color?: string,
    type?: string,
    date?: 'ascending' | 'descending',
    laundry?: 'ascending' | 'descending',
    uses?: 'ascending' | 'descending'
  };
  // compare: ;
}

//review: DISCONTINUITY! is it FULL or FULL BODY?
export const ItemDefinitions: 
{ 
  classes: string[], 
  types: { top: string[], bottom: string[], full: string[], shoes: string[], accessory: string[] }, 
  items: { type: string, formality: number, temperature: number, cover: number }[], 
  getFormality: Function,
  getTemperature: (type: string) => number,
  getCover: (type: string) => number,
} = {
  classes: ['top', 'bottom', 'full', 'shoes', 'accessory'],
  types: {
    top: [
      'blazer',
      'blouse',
      'cardigan',
      'coat',
      'dress shirt',
      'hoodie',
      'jacket',
      'polo',
      'shirt',
      'sweatshirt',
      't-shirt',
      'tank top',
      'vest'
    ],
    bottom: [
      "capri's",
      'dress pants',
      'jeans',
      'joggers',
      'leggings',
      'shorts',
      'skirt',
      'sweatpants',
      'trousers',
      'yoga pants'
    ],
    // full: ['dress', 'jumpsuit', 'overalls', 'poncho', 'robe', 'romper', 'tall coat'],
    full: ['dress', 'jumpsuit', 'overalls', 'romper'],
    shoes: [
      'boots',
      'clogs',
      'dress shoes',
      'heels',
      'moccasin',
      'running shoes',
      'sandals',
      'slides',
      'slip-ons',
      'sneakers'
    ],
    accessory: [
      'bag',
      'belt',
      'bow tie',
      'bracelet',
      'glasses',
      'gloves',
      'hat',
      'scarf',
      'shawl',
      'socks',
      'tie'
    ]
  },
  items:
    [
      // { type: '', formality: , temperature: , cover: },
      //tops
      { type: 'blazer', formality: 4, temperature: 3, cover: 3 },
      { type: 'blouse', formality: 3, temperature: 2, cover: 2 },
      { type: 'cardigan', formality: 2, temperature: 3, cover: 3 },
      { type: 'coat', formality: 2, temperature: 4, cover: 3 },
      { type: 'dress shirt', formality: 4, temperature: 2, cover: 2 },
      { type: 'hoodie', formality: 1, temperature: 3, cover: 2 },
      { type: 'jacket', formality: 2, temperature: 3, cover: 3 },
      { type: 'polo', formality: 3, temperature: 2, cover: 2 },
      { type: 'shirt', formality: 2, temperature: 2, cover: 2 },
      { type: 'sweatshirt', formality: 1, temperature: 3, cover: 2 },
      { type: 't-shirt', formality: 1, temperature: 1, cover: 2 },
      { type: 'tank top', formality: 1, temperature: 1, cover: 2 },
      { type: 'vest', formality: 3, temperature: 3, cover: 3 },
      //bottoms
      { type: "capri's", formality: 3, temperature: 2, cover: 1 },
      { type: 'dress pants', formality: 4, temperature: 2, cover: 1 },
      { type: 'jeans', formality: 2, temperature: 3, cover: 1 }, //2.5 temp
      { type: 'joggers', formality: 1, temperature: 2, cover: 1 },
      { type: 'leggings', formality: 2, temperature: 2, cover: 1 }, //2.5 temp
      { type: 'shorts', formality: 1, temperature: 1, cover: 1 },
      { type: 'skirt', formality: 2, temperature: 1, cover: 1 },
      { type: 'sweatpants', formality: 1, temperature: 3, cover: 1 },
      { type: 'trousers', formality: 3, temperature: 3, cover: 1 },
      { type: 'yoga pants', formality: 1, temperature: 2, cover: 1 },
      //full
      { type: 'dress', formality: 3, temperature: 2, cover: 2 },
      { type: 'jumpsuit', formality: 2, temperature: 2, cover: 2 },
      { type: 'overalls', formality: 2, temperature: 3, cover: 3 },
      // { type: 'poncho', formality: 2, temperature: 3, cover: 3 },
      // { type: 'robe', formality: 1, temperature: 2, cover: 3 },
      { type: 'romper', formality: 2, temperature: 1, cover: 2 },
      // { type: 'tall coat', formality: 3, temperature: 4, cover: 1 },
      //shoes
      { type: 'boots', formality: 3, temperature: 3, cover: 1 },
      { type: 'clogs', formality: 1, temperature: 2, cover: 1 },
      { type: 'dress shoes', formality: 4, temperature: 2, cover: 1 },
      { type: 'heels', formality: 4, temperature: 2, cover: 1 },
      { type: 'moccasin', formality: 1, temperature: 3, cover: 1 },
      { type: 'running shoes', formality: 2, temperature: 2, cover: 1 }, //2.5 temp
      { type: 'sandals', formality: 1, temperature: 1, cover: 1 },
      { type: 'slides', formality: 1, temperature: 1, cover: 1 },
      { type: 'slip-ons', formality: 2, temperature: 2, cover: 1 },//2.5 temp
      { type: 'sneakers', formality: 2, temperature: 2, cover: 1 },//2.5 temp
      // accessories 

      { type: 'bag', formality: -1, temperature: -1, cover: -1 },
      { type: 'belt', formality: -1, temperature: -1, cover: -1 },
      { type: 'bow tie', formality: -1, temperature: -1, cover: -1 },
      { type: 'bracelet', formality: -1, temperature: -1, cover: -1 },
      { type: 'glasses', formality: -1, temperature: -1, cover: -1 },
      { type: 'gloves', formality: -1, temperature: -1, cover: -1 },
      { type: 'hat', formality: -1, temperature: -1, cover: -1 },
      { type: 'scarf', formality: -1, temperature: -1, cover: -1 },
      { type: 'shawl', formality: -1, temperature: -1, cover: -1 },
      { type: 'socks', formality: -1, temperature: -1, cover: -1 },
      { type: 'tie', formality: -1, temperature: -1, cover: -1 },
    ],
    getFormality: function(type) {
      return this.items.find((e) => e.type === type).formality;
    },
    /**
     * 1 - worn in hot weather
     * 2 - worn in warm weather
     * 3 - worn in chilly weather
     * 4 - worn in cold weather
     * @param type 
     */
    getTemperature: function(type) {
      return this.items.find((e) => e.type === type).temperature;

    },
    getCover: function(type) {
      return this.items.find((e) => e.type === type).cover;

    },
};

export interface Top {
  type:
  | 'blazer'
  | 'blouse'
  | 'cardigan'
  | 'coat'
  | 'dress shirt'
  | 'hoodie'
  | 'jacket'
  | 'polo'
  | 'shirt'
  | 'sweatshirt'
  | 't-shirt'
  | 'tank top'
  | 'vest';
}
export interface Bottom {
  type:
  | "capri's"
  | 'dress pants'
  | 'jeans'
  | 'joggers'
  | 'leggings'
  | 'shorts'
  | 'skirt'
  | 'sweatpants'
  | 'trousers'
  | 'yoga pants';
}
export interface Full {
  // type: 'dress' | 'jumpsuit' | 'overalls' | 'poncho' | 'robe' | 'romper' | 'tall coat';
  type: 'dress' | 'jumpsuit' | 'overalls' | 'romper';
}
export interface Shoes {
  type:
  | 'boots'
  | 'clogs'
  | 'dress shoes'
  | 'heels'
  | 'moccasin'
  | 'running shoes'
  | 'sandals'
  | 'slides'
  | 'slip-ons'
  | 'sneakers';
}
export interface Accessory {
  type:
  | 'bag'
  | 'belt'
  | 'bow tie'
  | 'bracelet'
  | 'glasses'
  | 'gloves'
  | 'hat'
  | 'scarf'
  | 'shawl'
  | 'socks'
  | 'tie';
}

export interface SortFilter {
  type: "hide" | "show" | "order",
  name: "date" | "type" | "color" | "formality" | "temperature",
  value: string
}

//review: change the question marks to {everything working} | {working: false}
export interface Weather {
  working: boolean, 
  f?: number, 
  c?: number, 
  isUS?: boolean, 
  city?: string, 
  temp?: "hot" | "warm" | "chilly" | "cold" 
} 

export interface HSV {
  h: number;
  s: number;
  v: number;
}

export interface RGB {
  r: number,
  b: number,
  g: number
}