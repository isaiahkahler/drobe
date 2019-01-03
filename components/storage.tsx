import { Page, Item } from './formats';
import { AsyncStorage } from 'react-native';
import { FileSystem } from 'expo';



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

    //review: remove - as of now, unused
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
    static async deleteItem(page: number, itemIndex: number) {
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

    //review: remove comment - was changed to fix require cycle
    static async overwriteItem(pageIndex: number, itemIndex: number, item: Item, callback: Function) {
        let page: Page = await this._retrieveData('page' + pageIndex) //ItemManager.getPage(pageIndex);
        page.items[itemIndex] = item;
        this._storeData("page" + pageIndex, page).then(() => {
            callback();
        });
    }

    static async movePhotoFromCache(cacheURI: string, callback: Function) {
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


    //review: make this a real PROP through react navigation
  static async storeDefineProps(editMode: boolean, pageIndex: number, itemIndex: number, uri: string, callback: Function) {
    Storage._storeData('define', {
      editMode: editMode,
      pageIndex: pageIndex,
      itemIndex: itemIndex,
      uri: uri
    }).then(() => {
      callback();
    });
  }
}
