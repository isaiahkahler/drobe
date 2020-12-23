import { isIos } from './constants';

// export const LargeHeaderTitleStyle = {
//     position: "absolute",
//     fontWeight: "bold",
//     fontSize: 35,
//     left: 0,
//     bottom: 10
// };

// export const LargeHeaderTitleContainerStyle = {
//     position: "absolute",
//     left: 0,
// }

// export const LargeHeaderStyle = isIos ? {
//     height: 100,
//     backgroundColor: "#fff",
//     borderBottomColor: "#D4D4D5",
//     borderBottomWidth: 1,
// } : {
//         height: 100,
//         backgroundColor: "#fff",
//     };

// export const LargeHeaderSideContainerStyle = {
//     position: "absolute",
//     height: 50
// };

export const LargeHeaderOptions = {
    title: "Add Clothes",
    headerStyle: isIos ? {
        height: 100,
        backgroundColor: "#fff",
        borderBottomColor: "#D4D4D5",
        borderBottomWidth: 1,
    } : {
            height: 100,
            backgroundColor: "#fff",
        },
    headerTitleStyle: {
        position: "absolute",
        fontWeight: "bold",
        fontSize: 30,
        left: 0,
        bottom: -15
    },
    headerTitleContainerStyle: {
        position: "absolute",
        left: 0,
    },
    headerLeftContainerStyle: {
        position: "absolute",
        height: 50
    }
};