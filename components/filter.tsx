import { /*Filter,*/ Item, Page } from './formats';
import { filter } from 'minimatch';
import { ItemManager } from './itemManager';


export interface Hidden {
  filterType: "grey";
  class?: 'top' | 'bottom' | 'full' | 'shoes' | 'accessory';
  type?: string;
  name?: string;
  colors?: string[];
  date?: number;
  uses?: number;
  laundry?: number;
}

/* 
overrides disallowed - ex: disallowed tops, allowed cardigan - it will show up
*/
export interface Allowed {
  filterType: "allowed";
  class?: 'top' | 'bottom' | 'full' | 'shoes' | 'accessory';
  type?: string;
  name?: string;
  colors?: string[];
  date?: number;
  uses?: number;
  laundry?: number;
}

//review: is it supposed to work in conjunction with keys?
//like if i said type: shirt and uses: 2 will it only
//remove items with BOTH type shirt and 2 uses? or will
//it remove all shirts and all 2 use items?

export interface Disallowed {
  filterType: "disallowed";
  class?: 'top' | 'bottom' | 'full' | 'shoes' | 'accessory';
  type?: string;
  name?: string;
  colors?: string[];
  date?: number;
  uses?: number;
  laundry?: number;
}

export interface Priority {
  filterType: "priority";
  class?: { value: 'top' | 'bottom' | 'full' | 'shoes' | 'accessory', weight: number };
  type?: { value: string, weight: number };
  name?: { value: string, weight: number };
  colors?: { value: string[], weight: number };
  date?: { value: 'ascending' | 'descending', weight: number };
  uses?: { value: 'ascending' | 'descending', weight: number };
  laundry?: { value: 'ascending' | 'descending', weight: number };
  cover?: { value: number, weight: number };
  temperature?: { value: number, weight: number };
  formality?: { value: number, weight: number };
}

export class Sort {

  static arrangeItems(pages: Page[], filters: Array<Hidden | Allowed | Disallowed | Priority>) {
    let items: Item[] = [];
    pages.forEach(page => {
      page.items.forEach(item => {
        items.push(item);
      })
    });

    const originalItems = [...items];


    //review maybe / idea
    /* 
    how about you make removing disallowed basically just 
    allowing everything that is not disallowed - that way
    it would work with allowed easily !!! and it would
    overcome logic thingies
    */
    items = this._removeHidden(items, filters);;
    //find priorities

    items = this._greyDisallowed(items, filters);

    //move grey items to end

    let newPages = ItemManager.itemListToPages(items);
    newPages.forEach(page => {
      page.items.forEach(item => {
        console.log(item.class)
      })
    })
    return newPages;
  }

  static findPriorities() {

  }

  /*
  review: remove hidden does not really work as expected for type 
  of colors? for the item to be allowed or disallowed, colors array
  must have SAME exact values to allow / disallow. okay? i mean 
  you'd never use it that way but is it okay?
  */
  static _removeHidden(itemList: Item[], filters: Array<Hidden | Allowed | Disallowed | Priority>) {
    const originalItems = [...itemList];
    let items: Item[] = [];

    let disallowed = [];
    for (let filter of filters) {
      if (filter.filterType === "disallowed") {
        for (let key of Object.keys(filter)) {
          if (key !== 'filterType') {
            disallowed.push({[key]: filter[key]});
          }
        }
      }
    }

    let allowed = [];
    for (let filter of filters) {
      if (filter.filterType === "allowed") {
        for (let key of Object.keys(filter)) {
          if (key !== 'filterType') {
            allowed.push({[key]: filter[key]});
          }
        }
      }
    }


    for (let item of originalItems) {
      let isDisallowed = false;
      let isAllowed = false;
      for(let dis of disallowed){
        for (let key of Object.keys(dis)) {
          if (item[key] === dis[key]) {
            isDisallowed = true;
          }
        }
      }
      for(let all of allowed){
        for(let key of Object.keys(all)){
          if (item[key] === all[key]){
            isAllowed = true;
          }
        }
      }

      if(isDisallowed){
        if(isAllowed){
          items.push(item);
        }
      } else {
        items.push(item)
      }
      
    }

    return items;
  }
  



  static _greyDisallowed(itemList: Item[], filters: Array<Hidden | Allowed | Disallowed | Priority>) {
    let items = [...itemList];

    return items;
  }

  static _findClassPriority() {

  }
}