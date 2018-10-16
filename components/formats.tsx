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
    full: ["dress", "jumpsuit", "overalls", "poncho", "robe", "romper", "tall coat"],
    shoes: ["boots", "clogs", "dress shoes", "heels", "moccasin", "running shoes", "sandals", "slides", "slip-ons", "sneakers"],
    accessory: ["bag", "belt", "bow tie", "bracelet", "glasses", "gloves", "hat", "scarf", "shawl", "socks", "tie"]
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

  }

}

export function roundColor(colorRGB: {r: number, g: number, b: number}): string{
  const colors:Array<{r: number, b: number, g: number}> = [{r: 255, g: 0, b: 0}, {r: 0, g: 255, b: 0}, {r: 0, g:0, b:255}]
  const names:Array<string> = ["red", "green", "blue"]
  let smallestIndex = 0;
  let smallest = 10000;
  let index = 0;
  for(let color of colors){
    let distance = Math.sqrt(
      Math.pow((colorRGB.r - color.r), 2)
      +
      Math.pow((colorRGB.g - color.g), 2)
      +
      Math.pow((colorRGB.b - color.b), 2)
    );
    if(distance < smallest){
      smallest = distance;
      smallestIndex = index;
    }
    index++;
  }
  return names[smallestIndex];
}