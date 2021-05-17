import React, { Component } from 'react';
import Home from './HomeComponent';
import Directory from './DirectoryComponent';
import CampsiteInfo from './CampsiteInfoComponent';
import About from './AboutComponent';
import Contact from './ContactComponent';
import { View, Platform, StyleSheet, Text, ScrollView, Image } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import { Icon } from 'react-native-elements';
import SafeAreaView from 'react-native-safe-area-view';
import { connect } from 'react-redux';
import { fetchCampsites, fetchComments, fetchPromotions, fetchPartners } from '../redux/ActionCreators';

const mapDispatchToProps = {   // the changes to redux for this Main component are different from the changes to other component. Here use mapDispatchtoprops to pass the functions from redux
    fetchCampsites,  // change 1 to redux
    fetchComments,
    fetchPromotions,
    fetchPartners
}

const DirectoryNavigator = createStackNavigator(
    {
        Directory: { screen: Directory,
                     navigationOptions: ({navigation}) => ({ //this is to add icon to the text of directory on the left
                         headerLeft: <Icon
                            name='list'
                            type="font-awesome"
                            iconStyle={styles.stackIcon }
                            onPress={() => navigation.toggleDrawer()} />  //this toggleDrawer is the built in to the navigator, it is to open the drawer navigator if press the icon
                     }) },
        CampsiteInfo: { screen: CampsiteInfo }  //these 2 are the components will be available for stacknavigator
    },
    {
        initialRouteName: 'Directory',  // this is to set the default screen is Directory
        defaultNavigationOptions: {  
            headerStyle: {  //this is to set up the styles for Header
                backgroundColor: '#5637DD'  // this the header background color
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff' // this is the header title text color
            }
        }
    },
)

const HomeNavigator = createStackNavigator(
    {
        Home: { screen: Home }
    },
    {
        defaultNavigationOptions: ({navigation}) => ({  //the newly added Icon code can be added here 
            //and pass navigation instead of like the above directory, which need to under directory because 
            // there is another campsiteInfo
        
            headerStyle: {
                backgroundColor: '#5637DD'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            },
            headerLeft: <Icon
                name='home'
                type='font-awesome'
                iconStyle={styles.stackIcon}
                onPress={() => navigation.toggleDrawer()} />
        })
    }
);

const AboutNavigator = createStackNavigator(
    {
        About: { screen: About }
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            headerStyle: {
                backgroundColor: '#5637DD'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            },
            headerLeft: <Icon
                name='info-circle'
                type='font-awesome'
                iconStyle={styles.stackIcon}
                onPress={() => navigation.toggleDrawer()}/>
        })
    }
);

const ContactNavigator = createStackNavigator(
    {
        Contact: { screen: Contact }
    },
    {
        defaultNavigationOptions: ({navigation}) => ({
            headerStyle: {
                backgroundColor: '#5637DD'
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
                color: '#fff'
            },
            headerLeft: <Icon
                name='address-card'
                type='font-awesome'
                iconStyle={styles.stackIcon}
                onPress={() => navigation.toggleDrawer()} />
        })
    }
);

const CustomDrawerContentComponent = props => (
    <ScrollView>
        <SafeAreaView  // these are the code for set up safe area for phones
            style={styles.container}
            forceInset={{top: 'always', horizontal: 'never'}}>
            {/* below is set image to be 1/3, and text to be 2/3, horizontally, because below style.drawerHeader has flexdirection set to row*/}
            <View style={styles.drawerHeader}>
                <View style={{flex: 1}}>  
                    <Image source = {require('./images/logo.png')} style={styles.drawerImage} />
                </View>
                <View style={{flex:2}}> 
                    <Text style={styles.drawerHeaderText}>NuCamp</Text>
                </View>
            </View>
            <DrawerItems {...props} /> 
            {/* the above code is to render all the other components, like home, directory, etc, they are passed as props here. DrawerItems is imported from library. */}
        </SafeAreaView>
    </ScrollView> 

)


const MainNavigator = createDrawerNavigator(
    {
        Home: { screen: HomeNavigator,
                navigationOptions: {
                    drawerIcon: ({tintColor}) => ( // here drawerIcon and tintColor are all built in, can not be anyname,
                        //tintColor is for when it is current, it will be blue, otherwise will be tinted as grey,
                        // for the screen name like Home, Directory.. those tintColor features are built in, but for icons, we need to write tintColor
                        <Icon
                            name='home'
                            type='font-awesome'
                            size={24}  //you can also write size and color in here instead of in stylesheet below
                            color={tintColor} />
                    )

                } },
        Directory: { screen: DirectoryNavigator,
                     navigationOptions: {
                         drawerIcon: ({tintColor}) => (
                             <Icon
                                name='list'
                                type='font-awesome'
                                size={24}
                                color={tintColor} />
                         )
                     } },
        About: { screen: AboutNavigator,
                 navigationOptions: {
                     drawerLabel: 'About Us', //this is to overwrite the text of this drawer navigation, it was About, now change to About Us
                     drawerIcon: ({tintColor}) => (
                         <Icon
                            name='info-circle'
                            type='font-awesome'
                            size={24}
                            color={tintColor} />
                     )           
                    }},
        Contact: { screen: ContactNavigator,
                   navigationOptions: {
                       drawerLabel: 'Contact Us',
                       drawerIcon: ({tintColor}) => (
                           <Icon
                                name='address-card'
                                type='font-awesome'
                                size={24}
                                color={tintColor} />
                       )
                   }},
    },
    {
        drawerBackgroundColor: '#CEC8FF',
        contentComponent: CustomDrawerContentComponent  //this is add the custom drawer to this content, to replace the old one
    }
)

const AppNavigator = createAppContainer(MainNavigator);  // this is connect the top component with the navigator, so that like back, forward can work, etc

class Main extends Component { 
    
    componentDidMount() {  // change 2 to redux. componentDidMount() is invoked immediately after a component is mounted. If you need to load data from a remote endpoint, this is a good place to instantiate the network request.
        this.props.fetchCampsites();
        this.props.fetchComments();
        this.props.fetchPromotions();
        this.props.fetchPartners();
    }

    render() {
        return (
            <View style={{flex: 1,  // the below code is if platform is ios, then the top padding is 0, otherwise is the statusbarheight, it is not required but good to have.
                          paddingTop: Platform.OS === 'ios' ? 0 : Expo.Constants.statusBarHeight}}> 
                <AppNavigator /> 
            </View> 
        )
    }
}

const styles = StyleSheet.create({
    stackIcon: {
        marginLeft: 10,
        color: '#fff',
        fontSize:24
    },
    container: {
        flex: 1,
    },
    drawerHeader: {
        backgroundColor: '#5637DD',
        height: 140,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row' 
    },
    drawerHeaderText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold'
    },
    drawerImage: {
        margin: 10,
        height: 60,
        width: 60
    }
})

export default connect(null, mapDispatchToProps)(Main);  // change 3 to redux. null is because there is no mapStateToProps, so set it to null. 
// if there is no mapDispatchToProps, we can just leave it, no need null