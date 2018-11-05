import { Page, Item, ItemDefinitions } from './formats';
import { Storage } from './storage';
import { colorDistance } from './helpers';
import { string } from 'prop-types';

export class ItemManager {
  //hey!!! review: should these be async??? they have await in them? right?
  static async getNumberOfPages() {
    let number: number = await Storage._retrieveData('pages');
    if (!number) {
      return 0;
    }
    return number;
  }

  static async getPage(pageNumber: number) {
    let page: Page = await Storage._retrieveData('page' + pageNumber);
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
              return ItemDefinitions.getFormality(item.type) === formality
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
              return ItemDefinitions.getTemperature(item.type) === temperature
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

    return allPages;
  }

  //review: efficiency? 
  static async search(term: string, data: Page[], callback: (pages) => void) {
    let unfilteredTerms: Item[] = [];
    for (let page of data) {
      for (let item of page.items) {
        unfilteredTerms.push(item);
      }
    }
    let filteredTerms = unfilteredTerms.filter(item => {
      return item.name.indexOf(term.toLowerCase()) !== -1 || item.type.indexOf(term.toLowerCase()) !== -1 || item.class.indexOf(term.toLowerCase()) !== -1
    })
    // if(filteredTerms.length !== 0){
    //   filteredTerms = unfilteredTerms.filter(item => item.type.indexOf(term) !== -1)
    // } 
    let newPages = this.itemListToPages(filteredTerms);
    callback(newPages);

  }

  // static outfitRequirements(items: Item[]){ //needs to take COVER into consideration
  //   let itemType:string[] = [];
  //   let required:string[] = [];
  //   for(let item of items){
  //     if(item.class === 'full'){
  //       if(ItemDefinitions.getCover(item.type) === 3){ //if full body needs top, it can be called a bottom
  //         itemType.push('bottom')
  //       }
  //     } else {
  //       if(ItemDefinitions.getCover(item.type) === 3){ //item needs to be worn with item of same type

  //       }
  //       itemType.push(item.class);
  //     }
  //   }
  //   if(itemType.indexOf('top') === -1 ){
  //     required.push('top')
  //   }
  //   if(itemType.indexOf('bottom') === -1 ){
  //     required.push('bottom');
  //   }
  //   if(itemType.indexOf('shoes') === -1 ){
  //     required.push('shoes');
  //   }
  //   return required;
  // }

  // static getOutfitRequirements(items: Item[]){
  // not exactly logically sound! outfits can either be TOP + BOTTOM + SHOES or TOP + FULL3 + SHOES or FULL1/2 + SHOES
  // }

  static isValidOutfit(items: Item[]) {
    let isTopBottomShoes =
      (items.findIndex(e => e.class === 'top') !== -1) &&
      (items.findIndex(e => e.class === 'bottom') !== -1) &&
      (items.findIndex(e => e.class === 'shoes') !== -1);
    let isTopFull3Shoes =
      (items.findIndex(e => e.class === 'top') !== -1) &&
      (items.findIndex(e => e.class === 'full' && ItemDefinitions.getCover(e.type) === 3) !== -1) &&
      (items.findIndex(e => e.class === 'shoes') !== -1);
    let isFull21Shoes =
      (items.findIndex(e => e.class === 'full' &&
        (ItemDefinitions.getCover(e.type) === 2 || ItemDefinitions.getCover(e.type) === 2)
      ) !== -1) &&
      (items.findIndex(e => e.class === 'shoes') !== -1);
    return isTopBottomShoes || isTopFull3Shoes || isFull21Shoes;
  }


  static getDisallowedItems(items: Item[]) {
    let disallowed: Array<{ class?: string, type?: string, cover?: number }> = [];
    for (let item of items) {
      if (ItemDefinitions.getCover(item.type) === 1) {
        disallowed.push({ class: item.class });
      }
      if (item.class === "full") {
        disallowed.push({ class: "bottom" })
      }
      if (item.class === 'accessory') {
        disallowed.push({ type: item.type })
      }
    }
    return disallowed;
  }


}