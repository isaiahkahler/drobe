import { ItemManager } from './itemManager';
import { Page, Item, ItemDefinitions } from './formats';
import { getWeather } from './helpers';

export class Algorithms {

    /*review / thoughts: this returns an array which removes items with temp too far from the weather.
      well,,,, this isn't really good for filtering ALL items you can use to make an outfit because
      you can wear clothes for hot weather in cold weather, like a t-shirt and a hoodie.
      also theres literally a total of 1 top that has a temp of 4 and its something that has
      to be worn with other clohtes. 
      so - this returning array should only be used for bases maybe?
      also!!!! how to detect when you can't really make an appropriate outfit with what's in the library??
      you cant always assume that every library is a large one with a big variety. 
    */
    static async narrowByWeather(items: Item[]) {
        let weather = await getWeather();
        let filteredItems: Item[] = [];
        if(weather.temp === "hot") {
            filteredItems = items.filter(e => ItemDefinitions.getTemperature(e.type) === 1 || ItemDefinitions.getTemperature(e.type) === 2);
        } else if(weather.temp === "warm"){
            filteredItems = items.filter(e => ItemDefinitions.getTemperature(e.type) === 1 || ItemDefinitions.getTemperature(e.type) === 2 || ItemDefinitions.getTemperature(e.type) === 3);
        } else if(weather.temp === "chilly"){
            filteredItems = items.filter(e => ItemDefinitions.getTemperature(e.type) === 2 || ItemDefinitions.getTemperature(e.type) === 3);            
        } else {

        }
        return filteredItems;
    }

    static async getRecommendedOutfits() {
        let library = await ItemManager.getAllItems();
        library = await this.narrowByWeather(library);
        let bases: Array<{top: Item, bottom: Item} | {full: Item}> = [];
        let bottoms = library.filter(e => e.class === "bottom");
        let tops = library.filter(e => e.class === "top");
        let fulls = library.filter(e => e.class === "full");
        for(let top of tops) {
            for(let bottom of bottoms){
                console.log(top.name, bottom.name)
            }
        }
    }

    static async scoreOutfit(items: Item[]) {
        let library = await ItemManager.getAllItems();
        let colorScore;
    }
}