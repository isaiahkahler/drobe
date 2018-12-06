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
    items = this._removeHidden(items, filters);
    
    //find priorities

    items = this._greyDisallowed(items, filters);
    
    //move grey items to end

    let newPages = ItemManager.itemListToPages(items);
    // newPages.forEach(page => {
    //   page.items.forEach(item => {
    //     console.log(item.class)
    //   })
    // })
    return newPages;
  }

  static findPriorities() {

  }

  static _removeHidden(itemList: Item[], filters: Array<Hidden | Allowed | Disallowed | Priority>) {
    let items = [...itemList];
    items = items.filter(item => {
      for(let filter of filters){
        console.log("fidjsfld", filter.filterType)
        if(filter.filterType === "disallowed"){
          console.log('disallowed')
          for(let key of Object.keys(filter)){
            if(key !== "filterType"){
              if(filter[key] === item[key]){
                return false;
              } else {
                return true;
              }
            }
          }
        } else if(filter.filterType === "allowed"){
          console.log('allowed')
          for(let key of Object.keys(filter)){
            if(key !== "filterType"){
              if(filter[key] !== item[key]){
                return false;
              } else {
                return true;
              }
            }
          }
        } else {
          console.log('else')
          return false;
        }
      }
      return false;
    })

    return items;
  }

  static _greyDisallowed(itemList: Item[], filters: Array<Hidden | Allowed | Disallowed | Priority>) {
    let items = [...itemList];
    
    return items;
  }

  static _findClassPriority() {

  }
}