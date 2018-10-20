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
  class: 'top' | 'bottom' | 'full body' | 'shoes' | 'accessory';
  type: Top | Bottom | Full | Shoes | Accessory;
  name: string;
  colors: string[];
  date: number;
  uses: number;
  laundry: number;
  // cover: boolean;
  photoURI: string;
}

export const ItemDefinitions = {
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
    full: ['dress', 'jumpsuit', 'overalls', 'poncho', 'robe', 'romper', 'tall coat'],
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
  }
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
  type: 'dress' | 'jumpsuit' | 'overalls' | 'poncho' | 'robe' | 'romper' | 'tall coat';
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

export const Formality_1 = [];
export const Formality_2 = [];
export const Formality_3 = [];
export const Formality_4 = [];

export function getFormality(item: Item) {
  let type = item.type.type;
  for (let check of Formality_1) {
    if (check === type) {
      return 1;
    }
  }
  for (let check of Formality_2) {
    if (check === type) {
      return 2;
    }
  }
  for (let check of Formality_3) {
    if (check === type) {
      return 3;
    }
  }
  for (let check of Formality_4) {
    if (check === type) {
      return 4;
    }
  }
  return new Error(`oh that shouldn't have happened.`);
}

export class Storage {
  //review: using static right?
  static libraryPhotosDirectory = FileSystem.documentDirectory + 'libraryPhotos';

  static _storeData = async (key: string, value: any) => {
    try {
      if (typeof value === 'string') {
        await AsyncStorage.setItem(key, value);
      } else {
        await AsyncStorage.setItem(key, '***' + JSON.stringify(value));
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
        if (value.substr(0, 3) === '***') {
          return JSON.parse(value.substring(3));
        } else {
          return value;
        }
      }
      return null;
    } catch (error) {
      // Error retrieving data
      alert("oof. error retrieving data. you shouldn't be seeing this." + error);
      return null;
    }
  };

  static _deleteData = async (item: string) => {
    AsyncStorage.removeItem(item);
  };

  //review: does storing data need await?

  static async storeItem(item: Item) {
    let numberOfPages: number = await this._retrieveData('pages');
    if (!numberOfPages) {
      //if null
      await this._storeData('pages', 1); //pages = 1
      let newPage: Page = { items: [item] };
      await this._storeData('page1', newPage); //page1 = new page
    } else {
      //if pages exist
      let lastPage: Page = await this._retrieveData('page' + numberOfPages); //get last page
      if (lastPage.items.length < 10) {
        //last page not full
        lastPage.items.push(item); // add item to last page
        await this._storeData('page' + numberOfPages, lastPage); //store last page
      } else {
        //last page full
        let newLastPage: Page = { items: [item] };
        await this._storeData('page' + (numberOfPages + 1), newLastPage);
        await this._storeData('pages', numberOfPages + 1);
      }
    }
  }

  //review: if code is proven true & bug free, assertions can be commented out
  //page index starts at 1? good idea? no?
  static async DeleteItem(page: number, itemIndex: number) {
    let numberOfPages: number = await this._retrieveData('pages');
    if (!numberOfPages) {
      throw 'no pages exist';
    }
    if (page > numberOfPages) {
      throw "page doesn't exist";
    }
    let returnedPage: Page = await this._retrieveData('page' + page); //get page
    if (itemIndex > returnedPage.items.length - 1) {
      throw 'item does not exist';
    }
    returnedPage.items.splice(itemIndex, 1); //delete item

    await this._storeData('page' + page, returnedPage);

    //shift items on all pages down
    for (let i = page + 1; i <= numberOfPages; i++) {
      let nextPage: Page = await this._retrieveData('page' + i); //get next page
      let currentPage: Page = await this._retrieveData('page' + (i - 1));
      //first item on next page
      let firstItem = nextPage.items[0];
      //delete first item
      nextPage.items.splice(0, 1);
      //if next page empty, delete page
      if (nextPage.items.length === 0) {
        this._deleteData('page' + i);
        this._storeData('pages', numberOfPages - 1);
      } else {
        await this._storeData('page' + i, nextPage);
      }
      //add item to current page

      currentPage.items.push(firstItem);
      //store current page
      await this._storeData('page' + (i - 1), currentPage);
    }
  }

  static async getNumberOfPages() {
    let number: number = await this._retrieveData('pages');
    if (!number) {
      return 0;
    }
    return number;
  }

  /**
   *
   * @param pageNumber indexes from 1
   */
  static async getPage(pageNumber: number) {
    let page: Page = await this._retrieveData('page' + pageNumber);
    return page;
  }
  /**
   *
   * @param pageNumber indexes from 1
   * @param itemNumber indexes from 1
   */
  static async getItem(pageNumber: number, itemNumber: number) {
    let page = await this.getPage(pageNumber);
    let item = page.items[itemNumber - 1];
    return item;
  }

  static async MovePhotoFromCache(cacheURI: string, callback: Function) {
    let info = await FileSystem.getInfoAsync(this.libraryPhotosDirectory);
    let newURI =
      this.libraryPhotosDirectory + '/' + Date.now() + cacheURI.substr(cacheURI.length - 4);
    if (!info.exists) {
      //first time, directory does not exist
      try {
        await FileSystem.makeDirectoryAsync(this.libraryPhotosDirectory, { intermediates: false });
      } catch (e) {
        alert('oh no! there was a problem storing your item.' + e);
        return;
      }
      // console.log('success making directory');  //temp
      try {
        await FileSystem.moveAsync({ from: cacheURI, to: newURI });
      } catch (e) {
        alert('oh no! there was a problem storing your item.' + e);
        return;
      }
      // console.log('success storing, made dir');
    } else {
      //directory already established, store the item there
      try {
        await FileSystem.moveAsync({ from: cacheURI, to: newURI });
      } catch (e) {
        alert('oh no! there was a problem storing your item.' + e);
        return;
      }
      // console.log('success storing, didn't make dir');
    }
    callback(newURI);
  }
}

export function roundColor(color: string): string {
  let colorRGB = Color(color).object();
  const colors: Array<{ name: string; color: { r: number; g: number; b: number } }> = [
    { name: 'black', color: { r: 0, g: 0, b: 0 } },
    { name: 'gray', color: { r: 128, g: 128, b: 128 } },
    { name: 'white', color: { r: 255, g: 255, b: 255 } },
    { name: 'maroon', color: { r: 128, g: 0, b: 0 } },
    { name: 'red', color: { r: 230, g: 25, b: 75 } },
    { name: 'pink', color: { r: 250, g: 190, b: 190 } },
    { name: 'brown', color: { r: 170, g: 110, b: 40 } },
    { name: 'orange', color: { r: 245, g: 130, b: 48 } },
    { name: 'apricot', color: { r: 255, g: 215, b: 180 } },
    { name: 'olive', color: { r: 128, g: 128, b: 0 } },
    { name: 'yellow', color: { r: 255, g: 255, b: 25 } },
    { name: 'beige', color: { r: 255, g: 250, b: 200 } },
    { name: 'lime', color: { r: 210, g: 245, b: 60 } },
    { name: 'green', color: { r: 60, g: 180, b: 75 } },
    { name: 'mint', color: { r: 170, g: 255, b: 195 } },
    { name: 'teal', color: { r: 0, g: 128, b: 128 } },
    { name: 'cyan', color: { r: 70, g: 240, b: 240 } },
    { name: 'navy', color: { r: 0, g: 0, b: 128 } },
    { name: 'blue', color: { r: 0, g: 130, b: 200 } },
    { name: 'purple', color: { r: 145, g: 30, b: 180 } },
    { name: 'lavender', color: { r: 230, g: 190, b: 255 } },
    { name: 'magenta', color: { r: 240, g: 50, b: 230 } }
    // {name: "", color: {r: , g: , b: }},
  ];
  let smallestIndex = 0;
  let smallest = 10000;
  let index = 0;
  for (let color of colors) {
    let distance = Math.sqrt(
      Math.pow(colorRGB.r - color.color.r, 2) +
        Math.pow(colorRGB.g - color.color.g, 2) +
        Math.pow(colorRGB.b - color.color.b, 2)
    );
    if (distance < smallest) {
      smallest = distance;
      smallestIndex = index;
    }
    index++;
  }
  return colors[smallestIndex].name;
}

export function roundColors(colors: string[]){
  let allColors = '';
  let index = 0;
  for(let color of colors){
    if(index === 0){
      allColors += roundColor(color);
    } else {
      if(index === colors.length -1){
        allColors = allColors + " and " + roundColor(color);
      } else {
        allColors = allColors + ', ' + roundColor(color);
      }
    }
    index++;
  }
}