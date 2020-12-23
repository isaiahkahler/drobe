import { createStore, Action, action, createTypedHooks, thunk, Thunk } from 'easy-peasy';
import { Item, User } from './types';
import { getAskCameraPermission as getAskCameraPermissionHelper } from './helpers';
import { Camera } from 'expo-camera';

interface StoreModel {
    user: User,
    library: Item[],
    addItem: Action<StoreModel, Item>,
    helpers: {
        getAskCameraPermission: Thunk<StoreModel, undefined, any, any, Promise<boolean>>,
    }
}

const store = createStore<StoreModel>({
    user: {
        name: { first: "John", last: "Doe" },
        id: "test",
        new: true,
    },
    library: [],
    addItem: action((state, payload) => {
        state.library.push(payload);
    }),
    helpers: {
        getAskCameraPermission: thunk(async () => {
            const { status } = await Camera.getPermissionsAsync();
            if (status === 'granted') {
                return true;
            } else {
                const requestStatus = await Camera.requestPermissionsAsync();
                if (requestStatus.status === 'granted') {
                    return true;
                } else {
                    return false;
                }
            }
        }),
    }
});

const typedHooks = createTypedHooks<StoreModel>();

export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export default store;