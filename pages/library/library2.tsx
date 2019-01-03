import * as React from 'react';
import { StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import { PageLayout } from '../../components/page';
import { commonStyles, StyleConstants } from '../../components/styles';
import { createStackNavigator, NavigationComponent } from 'react-navigation';
import { Item, Page, ItemDefinitions, Filter } from '../../components/formats';
import { ItemManager } from '../../components/itemManager';
import { ItemView } from './itemView';
import { Define } from '../add/define';
import { SortSidebar } from './sortSidebar';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { roundColor } from '../../components/helpers';
import { Sort, Priority, Allowed, Disallowed, Greyed } from '../../components/filter';

//review: remove all unused imports



const width = Dimensions.get('screen').width;
const height = Dimensions.get('screen').height;

interface LibraryProps {
    navigation: NavigationComponent;
}

interface LibraryState {
    library: Page[],
    pages: Page[],
    activePages: number,
    filters: Array<Priority | Allowed | Disallowed | Greyed>,
    drawerOpen: boolean,
    searchValue: string
}

//review: does this class (and others) need to be exported? only the 'stack'
//needs to? remove unnecessary exports
export class Library extends React.Component<LibraryProps, LibraryState> {
    _drawer: React.RefObject<ScrollView>

    constructor(props: LibraryProps) {
        super(props);
        this._drawer = React.createRef<ScrollView>();
        this.state = {
            library: [],
            pages: [],
            activePages: 1,
            filters: [],
            drawerOpen: false,
            searchValue: ''
        }
    }

    static navigationOptions = {
        title: 'Library'
    };

    getTiles () {
        return (
            <View />
        )
    }

    hideSidebar = () => {
        this._drawer.current.scrollTo({ x: 0, animated: true })
    }

    toggleSidebar = () => {
        this._drawer.current.scrollToEnd();
    };

    render() {
        return (
            <PageLayout>
                <ScrollView horizontal pagingEnabled ref={this._drawer} >
                    {/* library part (not sidebar) */}
                    <View style={styles.library}>
                        {/* tiles scroll view */}
                        <ScrollView style={styles.tilesContainer}>
                            {this.getTiles()}
                        </ScrollView>
                        {/* top static container */}
                        <View style={styles.topStaticContainer}>
                            <Text style={commonStyles.pb}>top container</Text>
                        </View>
                    </View>

                    {/* sidebar */}
                    <View>
                        <SortSidebar onSelect={() => { }} />
                    </View>
                </ScrollView>
            </PageLayout>
        );
    }

}


export const LibraryStack = createStackNavigator(
    {
        Library: { screen: Library },
        ItemView: { screen: ItemView },
        Edit: { screen: Define }
    },
    {
        initialRouteName: 'Library',
        //   initialRouteParams: { selectionMode: false }
    }
);

const styles = StyleSheet.create({
    library: {
        width: width
    },
    tilesContainer: {
        flex: 1,
    },
    topStaticContainer: {
        width: width,
        position: 'absolute',
    }
});