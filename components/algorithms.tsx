import { ItemManager } from './itemManager';
import { Page, Item, ItemDefinitions, Outfit, Score } from './formats';
import { getWeather, colorDistance, clipRange } from './helpers';

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
        //review: should these be hand picked?
        if(weather.temp === "hot") {
            filteredItems = items.filter(e => ItemDefinitions.getTemperature(e.type) === 1 || ItemDefinitions.getTemperature(e.type) === 2);
        } else if(weather.temp === "warm"){
            filteredItems = items.filter(e => ItemDefinitions.getTemperature(e.type) === 1 || ItemDefinitions.getTemperature(e.type) === 2 || ItemDefinitions.getTemperature(e.type) === 3);
        } else if(weather.temp === "chilly"){
            filteredItems = items.filter(e => ItemDefinitions.getTemperature(e.type) === 2 || ItemDefinitions.getTemperature(e.type) === 3);            
        } else {
            filteredItems = items.filter(e => ItemDefinitions.getTemperature(e.type) === 3 || ItemDefinitions.getTemperature(e.type) === 4);            
        }
        return filteredItems;
    }

    /*
    review: this creates a bunch of outfits at once!
    by first creating bases, adding layers to those, etc.
    should it create 1 outfit at a time? and how?
    */
    static async getRecommendedOutfits() {
        let library = await ItemManager.getAllItems();
        let outfits: Outfit[] = [];
        // library = await this.narrowByWeather(library);
        //create bases
        let bases: Array<{top: Item, bottom: Item} | {full: Item}> = [];
        let bottoms = library.filter(e => e.class === "bottom");
        let tops = library.filter(e => e.class === "top");
        let fulls = library.filter(e => e.class === "full");
        for(let top of tops) {
            for(let bottom of bottoms){
                //review: limit to like 20 bases at a time? how would you load more?
                bases.push({top: top, bottom: bottom});
            }
        }
        for(let full of fulls){
            bases.push({full: full});
        }
        //add layers (add top)
        //based on temperature?

        //add shoes

        //add accessories
    }

    static scoreOutfit(outfit: Outfit): Score {
        // let library = await ItemManager.getAllItems();
        let colorScore;
        let personalityScore;
        let styleScore;
        // calculate color score
            //set array of base colors and layer colors
        let baseColors:string[] = [];
        if(!!outfit.items.baseRegular){
            outfit.items.baseRegular.top.colors.forEach(color => baseColors.push(color));
            outfit.items.baseRegular.bottom.colors.forEach(color => baseColors.push(color));
        } else {
            outfit.items.baseFull.colors.forEach(color => baseColors.push(color))
        }

        let layerColors: string[] = [];
        if(!!outfit.items.layers){
            outfit.items.layers.forEach(item => {
                item.colors.forEach(color => {
                    layerColors.push(color);
                })
            })
        }

            //compare base colors to layer colors
            //you probably want to change this in the future to pick complimentary colors
        let colorDistances: number[] = [];
        for(let baseColor of baseColors){
            for(let layerColor of layerColors){
                colorDistances.push(colorDistance(baseColor, layerColor));
            }
        }
        
        let smallestDistance = 300;
        let largestDistance = 0;
        for(let distance of colorDistances) {
            if(distance < smallestDistance){
                smallestDistance = distance;
            }
            if(distance > largestDistance) {
                largestDistance = distance
            }
        } 
        colorScore = 
         (100 - clipRange(smallestDistance, 441.6729559300637, 100))
        //  +
        //  clipRange(largestDistance, 441.6729559300637, 100) - 100 //largest distance should be ??
        return {colors: colorScore, overall: colorScore}
    }
}