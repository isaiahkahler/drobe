import { Page, Item, ItemDefinitions, Filter } from './formats';
import { Storage } from './storage';
import { colorDistance, clipRange } from './helpers';
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

  static async getAllItems() {
    let library = await this.getAllPages();
    let items: Item[] = [];
    library.forEach(e => { e.items.forEach(i => items.push(i)) });
    return items;
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

  //review: is being used?
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


  // static getDisallowedItems(items: Item[]) {
  //   let disallowed: Array<{ class?: string, type?: string, cover?: number, date?: number, id?: number }> = [];
  //   for (let item of items) {
  //     disallowed.push({date: item.date})
  //     if (ItemDefinitions.getCover(item.type) === 1) {
  //       disallowed.push({ class: item.class, id: item.date });
  //     }
  //     if (item.class === "full") {
  //       disallowed.push({ class: "bottom", id: item.date })
  //     }
  //     if(item.class === "bottom"){
  //       disallowed.push({class: "full", id: item.date })
  //     }
  //     if (item.class === 'accessory') {
  //       disallowed.push({ type: item.type, id: item.date })
  //     }
  //   }
  //   return disallowed;
  // }


  static arrangeItems(pages: Page[], filters: Filter[]) {
    let items: Item[] = [];
    pages.forEach(page => {
      page.items.forEach(item => {
        items.push(item);
      })
    })
    //remove all hidden from list
    filters.forEach(filter => {
      Object.keys(filter.keys).forEach(key => {
        if (filter.type === "hide") {
          items.filter(item => item[key] === filter.keys[key])
        }
      })
    })

    //grey out all disallowed
    filters.forEach(filter => {
      Object.keys(filter.keys).forEach(key => {
        if (filter.type === "disallowed") {
          items.filter(item => item[key] === filter.keys[key])
        }
      })
    })

    //find priorities
    let priorityFilters = filters.filter(filter => filter.type === 'priority');
    let priorities = this._findPriorities(items, priorityFilters);

    //items.sort((item1, item2) => this._findPriority(item1, item2, filters))

    //arrange by priority
  }


  //review: how do i check these?
  static _findPriorities(items: Item[], filters: Filter[]): number {
    let priorities = [];

    let lowestDate = Date.now();
    items.forEach(item => {
      if(item.date < lowestDate) {
        lowestDate = item.date;
      }
    })

    let highestLaundry = 0;
    items.forEach(item => {
      if(item.laundry > highestLaundry){
        highestLaundry = item.laundry
      }
    })

    items.forEach(item => {
      let numberOfFilters = 0;
      let score = 0;
      filters.forEach(filter => {
        Object.keys(filter.keys).forEach(key => {
          numberOfFilters++;
          let value = filter.keys[key];
          switch (filter[key]) {
            case "class":
              if (item.class === value) {
                score += 100
              }
              break;
            case "name":
              if(item.name.indexOf(value) !== -1){
                score += 100
              }
              break;
            case "id":
              if(item.class === value){
                score += 100;
              }
              break;
            case "color":
              let larger = 0;
              item.colors.forEach(color => {
                let dist = colorDistance(color, value);
                if(dist > larger) {
                  larger = dist;
                }
              })
              score += larger;
              break;
            case "type":
              if(item.type === value) {
                score += 100;
              }
              break;
            case "date":
              if(value === "ascending"){
                let dateValue = 100 - (Date.now() - item.date); //lets say 200 //close to new would be smaller
                let range = Date.now() - lowestDate; //lets say 500
                score += clipRange(dateValue, range, 100); //does newer = higher range?
              } else {
                //descending
                let dateValue = Date.now() - item.date;
                let range = Date.now() - lowestDate;
                score += clipRange(dateValue, range, 100); //does newer = higher range?
              }
              break;
            case "laundry":
              if(value === "ascending") {
                let laundryValue = item.laundry //lets say 3
                //highest is 5, 
                score += clipRange(item.laundry, highestLaundry, 100)
              } else {

              }
              break;
            case "uses":
              break;
          }
        })
      })
    })

    return -1;
  }
}