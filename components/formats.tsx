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
  // type: Top | Bottom | Full | Shoes | Accessory;'
  type: string;
  name: string;
  colors: string[];
  date: number;
  uses: number;
  laundry: number;
  photoURI: string;
}

export const ItemDefinitions: { classes: string[], types: { top: string[], bottom: string[], full: string[], shoes: string[], accessory: string[] }, items: { type: string, formality: number, temperature: number, cover: number }[] } = {
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
      { type: 'poncho', formality: 2, temperature: 3, cover: 3 },
      { type: 'robe', formality: 1, temperature: 2, cover: 3 },
      { type: 'romper', formality: 2, temperature: 1, cover: 2 },
      { type: 'tall coat', formality: 3, temperature: 4, cover: 1 },
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
    ]

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


//to do: AsyncStorage keeps track of indexed sort things! a list for everything purple, warm, formal, etc. good idea?
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
      await this._storeData('page0', newPage); //page0 = new page
    } else {
      //if pages exist
      let lastPage: Page = await this._retrieveData('page' + (numberOfPages - 1)); //get last page
      if (lastPage.items.length < 10) {
        //last page not full
        lastPage.items.push(item); // add item to last page
        await this._storeData('page' + (numberOfPages - 1), lastPage); //store last page
      } else {
        //last page full
        let newLastPage: Page = { items: [item] };
        await this._storeData('page' + (numberOfPages), newLastPage);
        await this._storeData('pages', numberOfPages + 1);
      }
    }
  }

  static checkItem(item: Item, onSuccess: Function, onFail: Function) {
    //if null
    if (!item.name) {
      if (!!item.colors && !!item.type) {
        if (item.colors.values.length !== 0) {

        }
      }
    }
  }

  //review: if code is proven true & bug free, assertions can be commented out
  //page index starts at 1? good idea? no? - changed to 0
  static async DeleteItem(page: number, itemIndex: number) {
    let numberOfPages: number = await this._retrieveData('pages');
    if (!numberOfPages) {
      throw 'no pages exist';
    }
    if (page > numberOfPages) {
      throw "page doesn't exist";
    }
    let returnedPage: Page = await this._retrieveData('page' + page); //get page
    if (itemIndex > returnedPage.items.length - 1) { //review: double check this ?
      throw 'item does not exist';
    }
    returnedPage.items.splice(itemIndex, 1); //delete item

    await this._storeData('page' + page, returnedPage);

    //shift items on all pages down
    for (let i = page + 1; i < numberOfPages; i++) {
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

  static async overwriteItem(pageIndex: number, itemIndex: number, item: Item, callback: Function) {
    let page: Page = await this.getPage(pageIndex);
    page.items[itemIndex] = item;
    this._storeData("page" + pageIndex, page).then(() => {
      callback();
    });
  }


  //hey!!! review: should these be async??? they have await in them? right?
  static async getNumberOfPages() {
    let number: number = await this._retrieveData('pages');
    if (!number) {
      return 0;
    }
    return number;
  }

  static async getPage(pageNumber: number) {
    let page: Page = await this._retrieveData('page' + pageNumber);
    return page;
  }

  static async getItem(pageNumber: number, itemNumber: number) {
    let page = await this.getPage(pageNumber);
    let item = page.items[itemNumber];
    return item;
  }

  /**
   * @returns Array of all pages
   */
  static async getAllPages() {
    let numberOfPages = await this.getNumberOfPages();
    let pages: Page[] = [];
    for (let i = 0; i < numberOfPages; i++) {
      let page = await this.getPage(i);
      pages.push(page)
    }
    return pages;
  }

  static itemListToPages(itemList: Item[]) {
    let pages: Page[] = [];
    for (let item of itemList) {
      if (pages.length === 0) {
        pages = [{ items: [item] }];
      } else if (pages[pages.length - 1].items.length < 10) {
        pages[pages.length - 1].items.push(item)
      } else if (pages[pages.length - 1].items.length === 10) {
        pages.push({ items: [item] });
      }
    }
    return pages;
  }


  /**
   * 
   * @param term 
   * @param value 
   * @returns Array of pages with 
   */
  static async sortBy(selections: Array<{ type: "hide" | "order", name: string, value: any }>) {
    let allPages = await this.getAllPages();
    for (let selection of selections) {
      if (selection.type === "hide") {
        let shownItems: Item[] = [];
        for (let page of allPages) {
          for (let item of page.items) {
            shownItems.push(item);
          }
        }

        switch (selection.name) {
          case "type":
            shownItems = shownItems.filter(item => item.type === selection.value);
            break;
          case "formality":
            let formality = -1;
            if (selection.value === "casual") {
              formality = 1;
            } else if (selection.value === "semi-casual") {
              formality = 2;
            } else if (selection.value === 'semi-formal') {
              formality = 3;
            } else {
              formality = 4;
            }
            shownItems = shownItems.filter(item => {
              return ItemDefinitions.items[ItemDefinitions.items.findIndex(e => { return e.type === item.type as any })].formality === formality
            })
            break;
          case "temperature":
            let temperature = -1;
            if (selection.value === "very light clothes") {
              temperature = 1;
            } else if (selection.value === "light clothes") {
              temperature = 2;
            } else if (selection.value === 'warm clothes') {
              temperature = 3;
            } else {
              temperature = 4;
            }
            shownItems = shownItems.filter(item => {
              return ItemDefinitions.items[ItemDefinitions.items.findIndex(e => { return e.type === item.type as any })].temperature === temperature
            })
            break;

        }
        allPages = this.itemListToPages(shownItems);

      } else { // type === "order"

        let sortedItems: Item[] = [];
        for (let page of allPages) {
          for (let item of page.items) {
            sortedItems.push(item);
          }
        }

        switch (selection.name) {
          case "date":

            if (selection.value === "new to old") {
              sortedItems.sort((a, b) => { return b.date - a.date });
            } else {
              sortedItems.sort((a, b) => { return a.date - b.date });
            }

            break;
          case "color":
            sortedItems.sort((a, b) => { return colorDistance(selection.value, a.colors[0]) - colorDistance(selection.value, b.colors[0]) });
            break;
          default:
        }

        allPages = this.itemListToPages(sortedItems);
      }
    }


    for (let page of allPages) {
      for (let item of page.items) {

      }
    }



    return allPages;
  }

  static async storeDefineProps(editMode: boolean, pageIndex: number, itemIndex: number, uri: string, callback: Function) {
    this._storeData('define', {
      editMode: editMode,
      pageIndex: pageIndex,
      itemIndex: itemIndex,
      uri: uri
    }).then(() => {
      callback();
    });
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

const colorSpace: Array<{ name: string; color: { r: number; g: number; b: number } }> = [
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

export function colorDistance(color1: string, color2: string) {
  let color1obj = Color(color1).object();
  let color2obj = Color(color2).object();
  return Math.sqrt(
    Math.pow(color1obj.r - color2obj.r, 2) +
    Math.pow(color1obj.g - color2obj.g, 2) +
    Math.pow(color1obj.b - color2obj.b, 2)
  );
}

export function roundColor(color: string): string {
  let colorRGB = Color(color).object();

  let smallestIndex = 0;
  let smallest = 10000;
  let index = 0;
  for (let color of colorSpace) {
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
  return colorSpace[smallestIndex].name;
}

export function roundColors(colors: string[]) {
  let allColors = '';
  let index = 0;
  for (let color of colors) {
    if (index === 0) {
      allColors += roundColor(color);
    } else {
      if (index === colors.length - 1) {
        allColors = allColors + " and " + roundColor(color);
      } else {
        allColors = allColors + ', ' + roundColor(color);
      }
    }
    index++;
  }
  return allColors;
}