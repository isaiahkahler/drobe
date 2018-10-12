import React from 'react';
import { AsyncStorage } from 'react-native';

export interface Page {
  full: boolean;
  items: Array<Item>;
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
  photoURI: string;
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

export class Storage {

  static _storeData = async (key: string, value: any) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      // Error saving data
    }
  };
  static _retrieveData = async (item: string) => {
    try {
      const value: any = await AsyncStorage.getItem(item);
      if (value !== null) {
        // We have data!!
        return value;
      }
      return null;
    } catch (error) {
      // Error retrieving data
      return null;
    }
  };



  static storeItem(item: Item) {
    this._retrieveData('pages').then((numberOfPages: number) => {
      if (numberOfPages === null){ //no pages stored
        this._storeData('pages', 1).then(() => { //number of pages is now 1
          let newPage: Page = {full: false, items: [item]}
          this._storeData('page1', newPage); //store item in a new page object saved to page1
        });
      } else { //there are pages in storage
        this._retrieveData('page' + numberOfPages).then((lastPage: Page) => { //get the last page
          if(lastPage.full){ //page is full
            this._storeData('pages', (numberOfPages + 1)).then(() => { //number of pages is one higher
              let newPage: Page = {full: false, items: [item]}
              this._storeData('page' + (numberOfPages + 1), newPage); //store item in a new page object saved to one higher than last
            })
          } else { //page has space for more
            let updatedPage: Page = {...lastPage, items: [...lastPage.items, item]}
            this._storeData('page' + numberOfPages, updatedPage); //sets the last page object to the one we grabbed but with new item
          }
        })

      }
    })

  }

  static DeleteItem(page: number, itemIndex: number){
    this._retrieveData('pages').then((numberOfPages: number) => { //get number of pages
      this._retrieveData('page' + page).then((returnedPage: Page) => { //get page with item to delete
        
        let newPage:Page = {...returnedPage}
        newPage.items.splice(itemIndex, 1);

        this._retrieveData('page' + numberOfPages).then((lastPage: Page) => { //get last page
          let lastItem = lastPage.items[lastPage.items.length - 1];
          let newLastPage = {...lastPage};
          newLastPage.items.splice(newLastPage.items.length - 1, 1);
          if(newLastPage.full){
            newLastPage.full = false;
          }
          this._storeData('page' + numberOfPages, newLastPage) //stores last page with removed item
          newPage.items.push(lastItem);
          this._storeData('page' + page, newPage) //stores page with the last item
        })
      })
    })
  }

}