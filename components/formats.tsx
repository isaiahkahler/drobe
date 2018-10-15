import React from 'react';
import { AsyncStorage } from 'react-native';
import { number } from 'prop-types';

export interface Page {
  // full: boolean;
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
      if(typeof value === "string"){
        await AsyncStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, "***" + JSON.stringify(value));
      }
    } catch (error) {
      // Error saving data
    }
  };
  static _retrieveData = async (item: string) => {
    try {
      const value: any = await AsyncStorage.getItem(item);
      if (value !== null) {
        // We have data!!
        if(value.substr(0,3) === "***"){
          return JSON.parse(value.substring(3))
        } else {
          return value;
        }
      }
      return null;
    } catch (error) {
      // Error retrieving data
      return null;
    }
  };

  static _deleteData = async (item: string) => {
    AsyncStorage.removeItem(item);
  }

  // static storeItem(item: Item) {

  //   console.log('got here!')
  //   this._retrieveData('pages').then((numberOfPages: number) => {
  //     console.log("number of pages" , numberOfPages,  "page" + numberOfPages)
  //     if (numberOfPages === null){ //no pages stored
  //       this._storeData('pages', 1).then(() => { //number of pages is now 1
  //         let newPage: Page = {full: false, items: [item]}
  //         this._storeData('page1', newPage); //store item in a new page object saved to page1
  //       });
  //     } else { //there are pages in storage
  //       this._retrieveData('page' + numberOfPages).then((lastPage: Page) => { //get the last page
  //         if(lastPage.full){ //page is full
  //           this._storeData('pages', (numberOfPages + 1)).then(() => { //number of pages is one higher
  //             let newPage: Page = {full: false, items: [item]}
  //             this._storeData('page' + (numberOfPages + 1), newPage); //store item in a new page object saved to one higher than last
  //           })
  //         } else { //page has space for more
  //           let updatedPage: Page = {...lastPage, items: [...lastPage.items, item]}
  //           this._storeData('page' + numberOfPages, updatedPage); //sets the last page object to the one we grabbed but with new item
  //         }
  //       })

  //     }
  //   })

  // }

//review: does storing data need await?

  static async storeItem(item: Item) {

    let numberOfPages:number = await this._retrieveData('pages');
    if(!numberOfPages){ //if null
      await this._storeData('pages', 1); //pages = 1
      let newPage:Page = {items: [item]};
      await this._storeData('page1', newPage); //page1 = new page
    } else { //if pages exist
      let lastPage:Page = await this._retrieveData('page' + numberOfPages); //get last page
      if (lastPage.items.length < 5){ //last page not full
        lastPage.items.push(item); // add item to last page
        await this._storeData("page" + numberOfPages, lastPage); //store last page
      } else { //last page full
        let newLastPage:Page = {items: [item]};
        await this._storeData('page' + (numberOfPages + 1), newLastPage);
        await this._storeData('pages', numberOfPages + 1);
      }
    }
  }

  //review: if code is proven true & bug free, assertions can be commented out
  //page index starts at 1? good idea? no?
  static async DeleteItem(page: number, itemIndex: number){
    let numberOfPages:number = await this._retrieveData('pages');
    if(!numberOfPages) { 
      throw "no pages exist";
    }
    if(page > numberOfPages){ 
      throw "page doesn't exist";
    }
    let returnedPage:Page = await this._retrieveData('page' + page); //get page
    if(itemIndex > returnedPage.items.length - 1) {
      throw "item does not exist";
    }
    returnedPage.items.splice(itemIndex, 1); //delete item 

    await this._storeData('page' + page, returnedPage);

    
    //shift items on all pages down
    for(let i = page + 1; i <= numberOfPages; i++){
      let nextPage:Page = await this._retrieveData("page" + i) //get next page
      let currentPage:Page = await this._retrieveData('page' + (i - 1))
      //first item on next page
      let firstItem = nextPage.items[0];
      //delete first item
      nextPage.items.splice(0,1);
      //if next page empty, delete page
      if(nextPage.items.length === 0) {
        this._deleteData('page' + i);
        this._storeData('pages', numberOfPages-1);
      } else {
        await this._storeData('page' + i, nextPage);
      }
      //add item to current page

      currentPage.items.push(firstItem);
      //store current page
      await this._storeData('page' + (i - 1), currentPage);
    }




    // this._retrieveData('pages').then((numberOfPages: number) => { //get number of pages
    //   if(numberOfPages === null) {
    //     throw "no pages exist";
    //     return;
    //   }
      
    //   this._retrieveData('page' + page).then((returnedPage: Page) => { //get page with item to delete
    
    //     if(returnedPage === null) {
    //       throw "page does not exist";
    //       return;
    //     }

    //     let newPage:Page = {...returnedPage}

    //     if(!newPage.items[itemIndex]) {
    //       throw "item does not exist";
    //       return;
    //     }

    //     newPage.items.splice(itemIndex, 1);

    //     this._retrieveData('page' + numberOfPages).then((lastPage: Page) => { //get last page


    //       let lastItem = lastPage.items[lastPage.items.length - 1];
    //       let newLastPage = {...lastPage};
    //       newLastPage.items.splice(newLastPage.items.length - 1, 1);
    //       if(newLastPage.full){
    //         newLastPage.full = false;
    //       }
    //       this._storeData('page' + numberOfPages, newLastPage) //stores last page with removed item
    //       newPage.items.push(lastItem);
    //       this._storeData('page' + page, newPage) //stores page with the last item
    //     })
    //   })
    // })
  }

}