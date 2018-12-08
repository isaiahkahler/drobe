import { ItemManager } from './itemManager';
import { Page, Item, ItemDefinitions, Outfit, Score } from './formats';
import { getWeather, colorDistance, clipRange } from './helpers';

const colorSpaceMaxDistance = 441.6729559300637;

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
        if (weather.temp === "hot") {
            filteredItems = items.filter(e => ItemDefinitions.getTemperature(e.type) === 1 || ItemDefinitions.getTemperature(e.type) === 2);
        } else if (weather.temp === "warm") {
            filteredItems = items.filter(e => ItemDefinitions.getTemperature(e.type) === 1 || ItemDefinitions.getTemperature(e.type) === 2 || ItemDefinitions.getTemperature(e.type) === 3);
        } else if (weather.temp === "chilly") {
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
        let bases: Array<{ top: Item, bottom: Item } | { full: Item }> = [];
        let bottoms = library.filter(e => e.class === "bottom");
        let tops = library.filter(e => e.class === "top");
        let fulls = library.filter(e => e.class === "full");
        for (let top of tops) {
            for (let bottom of bottoms) {
                //review: limit to like 20 bases at a time? how would you load more?
                bases.push({ top: top, bottom: bottom });
            }
        }
        for (let full of fulls) {
            bases.push({ full: full });
        }
        //add layers (add top)
        //based on temperature?

        //add shoes

        //add accessories
    }

    static scoreOutfit(outfit: Outfit): Score {
        // let library = await ItemManager.getAllItems();
        let colorScore = this.scoreColors(outfit);
        let personalityScore;
        let styleScore;
        // console.log(colorScore)
        return {colors: -1, overall: -1}

    }

    static scoreColors(outfit: Outfit) {
        // calculate color score

        let baseColors: string[] = [];
        let layerColors: string[] = [];
        let colorDistances: number[] = [];

        //push base colors
        if (!!outfit.items.baseRegular) {
            outfit.items.baseRegular.top.colors.forEach(color => baseColors.push(color));
            outfit.items.baseRegular.bottom.colors.forEach(color => baseColors.push(color));
        } else {
            outfit.items.baseFull.colors.forEach(color => baseColors.push(color))
        }

        //push layer colors
        if (!!outfit.items.layers) { //if outfit has layers
            outfit.items.layers.forEach(item => {
                item.colors.forEach(color => {
                    layerColors.push(color);
                })
            })

        }


        if (!!outfit.items.layers) {
            //compare base colors to layer colors
            //you probably want to change this in the future to pick complimentary colors
            for (let baseColor of baseColors) {
                for (let layerColor of layerColors) {
                    colorDistances.push(colorDistance(baseColor, layerColor));
                }
            }
        } else {
            //no layers, just compare base colors to itself
            let topColors: string[] = [];
            outfit.items.baseRegular.top.colors.forEach(color => topColors.push(color));
            let bottomColors: string[] = [];
            outfit.items.baseRegular.bottom.colors.forEach(color => bottomColors.push(color));
            // console.log('top colors', topColors, 'bottom colors', bottomColors)
            for(let topColor of topColors){
                for(let bottomColor of bottomColors){
                    colorDistances.push(colorDistance(topColor, bottomColor));
                }
            }
        }


        let smallestDistance = 500;
        let largestDistance = 0;
        for (let distance of colorDistances) {
            if (distance < smallestDistance) {
                smallestDistance = distance;
            }
            if (distance > largestDistance) {
                largestDistance = distance
            }
        }
        let colorScore =
            (100 - clipRange(smallestDistance, colorSpaceMaxDistance, 100))
        //  +
        //  clipRange(largestDistance, colorSpaceMaxDistance, 100) - 100 //largest distance should be ??
        return {smallest: clipRange(smallestDistance, colorSpaceMaxDistance, 100), largest: clipRange(largestDistance, colorSpaceMaxDistance, 100)};
    }


    //if a two part base
        //find color distance of top and bottom
        //if above 50, 110-distance = base score //idea: abstact the 110 value by dividing to generalize the number then size it up again
        //else + 85 = base score
        //if above 100, do 100-(score - 100)

        //if has layers
            //for each layer
            //count layers

            //if dist from layer to top is below 50
            // 130 - distance = layer score
            //else 15 + distance *to bottom* = layer score
            //if above 100, do 100-(score - 100)
            //add score to layer score
            //average layer score

        //else 
            //dont calculate for layer score?

        //if has shoes // bad idea?
            //find smallest distance to top or bottom
            // if above 50, (middle of the 2 values)
            // 90 (ideally range btwn 0-20) + smallest dist
            //if above 100, cut off
            // = shoe score

            //return all 3 scores back, 
            //average score

    //else (if a full)
        //dont have a base score?
        //compare base colors against themselves?

        //if has layers
            //for each layer
            //count layers

            //if dist from layer to base is below 50
            // 130 - distance = layer score
            //else 15 + distance  = layer score
            //if above 100, do 100-(score - 100)
            //add score to layer score
            //average layer score

        //else 
            //dont calculate for layer score?

        //if has shoes // bad idea?
            //find smallest distance to a color of base
            // if above 50, (middle of the 2 values)
            // 90 (ideally range btwn 0-20) + smallest dist
            //if above 100, cut off
            // = shoe score

            //return all 3 scores back, 
            //average score


        //oof::: how to deal with MANY colors? on one item
        
        //INVESTIGATE: how does adding / subtracting effect score?
        //also!!!!! i dont think any of these individual scoring equations give on a range from 0-100, clip range?

        //how would the generalizing function work?
        //before doing calculations, you could multiply things by a number, like 10, do the calculations, then divide by the number, so things are shifted by a factor of 10
}