import { /*Filter,*/ Item, Page, Filter, ItemDefinitions } from './formats';
import { ItemManager } from './itemManager';
import stringSimilarity from 'string-similarity';
import { string } from 'prop-types';
import { colorDistance, clipRange } from './helpers';


export interface Greyed {
  filterType: "greyed";
  class?: 'top' | 'bottom' | 'full' | 'shoes' | 'accessory';
  type?: string;
  name?: string;
  colors?: string[];
  date?: number;
  uses?: number;
  laundry?: number;
  message: {title: string, body: string};
  action?: Function;
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


//review: when given a priority filter, will there only
//ever be one? or will there be more than one?
//as of now, will not work with more than one
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

  static arrangeItems(pages: Page[], filters: Array<Greyed | Allowed | Disallowed | Priority>) {
    let items: Item[] = [];
    pages.forEach(page => {
      page.items.forEach(item => {
        items.push(item);
      })
    });

    const originalItems = [...items];

    items = this._removeHidden(items, filters);;
    //find priorities

    items = this.findPriorities(items, filters)

    items = this._greyItems(items, filters);

    //move grey items to end

    let newPages = ItemManager.itemListToPages(items);
    newPages.forEach(page => {
      page.items.forEach(item => {
        // console.log(item.class)
      })
    })
    return newPages;
  }

  static findPriorities(items: Item[], filters: Array<Greyed | Allowed | Disallowed | Priority>) {
    let priorities = [];
    
    let oldestDate = Date.now();
    items.forEach(item => {
      if(item.date < oldestDate) {
        oldestDate = item.date;
      }
    })

    let mostUsed = 0;
    items.forEach(item => {
      if(item.uses > mostUsed){
        mostUsed = item.uses;
      }
    })

    let highestLaundry = 0;
    items.forEach(item => {
      if(item.laundry > highestLaundry) {
        highestLaundry = item.laundry
      }
    })

    for(let filter of filters){
      if(filter.filterType === "priority"){
        for(let item of items){
          let itemPriority = 0;
          let divisor = 0;
          for(let key of Object.keys(filter)){
            if(key !== 'filterType'){

              if(key === "class"){
                itemPriority += this._findClassPriority(item, filter[key].value);
                divisor++;
              } else if(key === "type"){
                itemPriority += this._findTypePriority(item, filter[key].value);
                divisor++;
              } else if(key === "name"){
                itemPriority += this._findNamePriority(item, filter[key].value);
                divisor++;
              } else if(key === "colors"){
                itemPriority += this._findColorsPriority(item, filter[key].value);
                divisor++;
              } else if(key === "date"){
                itemPriority += this._findDatePriority(item, filter[key].value, oldestDate);
                divisor++;
              } else if(key === "uses"){
                itemPriority += this._findUsesPriority(item, filter[key].value, mostUsed);
                divisor++;
              } else if(key === "laundry"){
                itemPriority += this._findLaundryPriority(item, filter[key].value, highestLaundry);
                divisor++;
              } else if(key === "cover"){
                itemPriority += this._findCoverPriority(item, filter[key].value);
                divisor++;
              } else if(key === "temperature"){
                itemPriority += this._findTemperaturePriority(item, filter[key].value)
                divisor++;
              } else if(key === "formality"){
                itemPriority += this._findFormalityPriority(item, filter[key].value)
                divisor++;
              }


            }
          }
          // console.log(item.name, itemPriority, divisor, itemPriority / divisor)
          priorities.push(itemPriority / divisor);
        }
      }
    }

    // for(let filter of filters){
    //   if(filter.filterType === "priority"){
    //     for(let key of Object.keys(filter)){
    //       if(key !== "filterType"){
    //         for(let item of items){
  
    //           let itemPriority = 0;
    //           let divisor = 0;
              
    //           if(key === "class"){
    //             itemPriority += this._findClassPriority(item, filter[key].value);
    //             divisor++;
    //           } else if(key === "type"){
    //             itemPriority += this._findTypePriority(item, filter[key].value);
    //             divisor++;
    //           } else if(key === "name"){
    //             itemPriority += this._findNamePriority(item, filter[key].value);
    //             divisor++;
    //           } else if(key === "colors"){
    //             itemPriority += this._findColorsPriority(item, filter[key].value);
    //             divisor++;
    //           } else if(key === "date"){
    //             itemPriority += this._findDatePriority(item, filter[key].value, oldestDate);
    //             divisor++;
    //           } else if(key === "uses"){
    //             itemPriority += this._findUsesPriority(item, filter[key].value, mostUsed);
    //             divisor++;
    //           } else if(key === "laundry"){
    //             itemPriority += this._findLaundryPriority(item, filter[key].value, highestLaundry);
    //             divisor++;
    //           } else if(key === "cover"){
    //             itemPriority += this._findCoverPriority(item, filter[key].value);
    //             divisor++;
    //           } else if(key === "temperature"){
    //             itemPriority += this._findTemperaturePriority(item, filter[key].value)
    //             divisor++;
    //           } else if(key === "formality"){
    //             itemPriority += this._findFormalityPriority(item, filter[key].value)
    //             divisor++;
    //           }
              
    //           priorities.push(itemPriority / divisor)
  
    //         }
    //       }
    //     }
    //   }
    // }
    
    
    let sortedItems = [...items]
    sortedItems.sort((a, b) => {
      return priorities[items.indexOf(b)] - priorities[items.indexOf(a)]
    })

    sortedItems.forEach( item => {
      console.log(item.name, priorities[items.indexOf(item)])
    })

    return sortedItems;
  }

  /*
  review: remove hidden does not really work as expected for type 
  of colors? for the item to be allowed or disallowed, colors array
  must have SAME exact values to allow / disallow. okay? i mean 
  you'd never use it that way but is it okay?
  */
  static _removeHidden(itemList: Item[], filters: Array<Greyed | Allowed | Disallowed | Priority>) {
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
  



  static _greyItems(itemList: Item[], filters: Array<Greyed | Allowed | Disallowed | Priority>) {
    let items = [...itemList];

    let greyed = [];
    for (let filter of filters) {
      if (filter.filterType === "greyed") {
        for (let key of Object.keys(filter)) {
          if (key !== 'filterType') {
            greyed.push({[key]: filter[key], message: filter.message});
          }
        }
      }
    }

    for (let item of items) {
      for(let grey of greyed){
        for (let key of Object.keys(grey)) {
          if(key !== "message"){
            if (item[key] === grey[key]) {
              item.grey = {message: grey.message};
            }
          }
        }
      }
    }

    return items;
  }

  static _findClassPriority(item: Item, classType: string) {
    return item.class === classType ? 100 : 0;
  }

  static _findTypePriority(item: Item, type: string) {
    return item.type === type ? 100 : 0;
  }

  static _findNamePriority(item: Item, name: string) {
    return 100 * stringSimilarity.compareTwoStrings(item.name, name);
  }

  static _findColorsPriority(item: Item, colors: string[]) {
    let shortestDistance = 100;
    for(let itemColor of item.colors){
      for(let compareColor of colors) {
        let colorDist = colorDistance(itemColor, compareColor);
        if(colorDist < shortestDistance) {
          shortestDistance = colorDist
        }
      }
    }
    return 100 - shortestDistance;
  }

  static _findDatePriority(item: Item, date: "ascending" | "descending", oldestDate) {
    if(date === "ascending"){
      //should be old to new 
      //items with old dates get lower scores 
      return clipRange(item.date - oldestDate, Date.now() - oldestDate, 100);
    } else {
      //items with oldest dates get highest scores
      return 100 - clipRange(item.date - oldestDate, Date.now() - oldestDate, 100);
    }
  }

  static _findUsesPriority(item: Item, uses: "ascending" | "descending", mostUsed: number){
    if(uses === "ascending"){
      return clipRange(item.uses, mostUsed, 100);
    } else {
      return 100 - clipRange(item.uses, mostUsed, 100);
    }
  }

  static _findLaundryPriority(item: Item, laundry: "ascending" | "descending", highestLaundry: number){
    if(laundry === "ascending"){
      return clipRange(item.laundry, highestLaundry, 100);
    } else {
      return 100 - clipRange(item.laundry, highestLaundry, 100)
    }
  }

  static _findCoverPriority(item: Item, cover: number){
    return 100 - clipRange(Math.abs(cover - ItemDefinitions.getCover(item.type)), 4, 100)
  }

  static _findTemperaturePriority(item: Item, temp: number){
    return 100 - clipRange(Math.abs(temp - ItemDefinitions.getTemperature(item.type)), 4, 100)
  }

  static _findFormalityPriority(item: Item, formality:  number){
    return 100 - clipRange(Math.abs(formality - ItemDefinitions.getFormality(item.type)), 4, 100)
  }
}