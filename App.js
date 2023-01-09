// Importando bibliotecas.
import { View, Alert, Linking, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { useEffect } from 'react';
import './Globals.js';

// Importando componentes.
import Main from './components/Main';
import Data from './components/Data';
import Cloud from './components/Cloud';

// Definindo componente.
const Stack = createStackNavigator();
const App = () => {
  useEffect(() => {}, []);
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Main"
        screenOptions={({ navigation, route }) => ({
          title: global.name,
          headerTintColor: global.defaultColor,
          headerStyle: { backgroundColor: global.highlightColor },
          headerLeft: () =>
            route.name == 'Main' ? (
              <TouchableOpacity
                style={{ marginLeft: global.screenWidth / 36 }}
                onPress={() => navigation.dispatch(StackActions.push('Cloud'))}>
                <Icon
                  name="cloud"
                  size={global.screenWidth / 16}
                  color={global.defaultColor}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={{ marginLeft: global.screenWidth / 36 }}
                onPress={() => navigation.pop()}>
                <Icon
                  name="keyboard-backspace"
                  size={global.screenWidth / 16}
                  color={global.defaultColor}
                />
              </TouchableOpacity>
            ),
          headerRight: () => (
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
              <TouchableOpacity
                style={{ marginRight: global.screenWidth / 36 }}
                onPress={() =>
                  navigation.dispatch(StackActions.replace(route.name))
                }>
                <Icon
                  name="cached"
                  size={global.screenWidth / 16}
                  color={global.defaultColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ marginRight: global.screenWidth / 36 }}
                onPress={() =>
                  Alert.alert(
                    'Livre de royalties ©',
                    'Ícones criados por:\nFreepik ➯ Flaticon.\n\nAplicativo criado por:\nHenrico Maeda ➯ LinkedIn.',
                    [
                      { text: 'Voltar' },
                      {
                        text: 'Flaticon',
                        onPress: () =>
                          Linking.openURL(
                            'https://www.flaticon.com/authors/freepik'
                          ),
                      },
                      {
                        text: 'LinkedIn',
                        onPress: () =>
                          Linking.openURL(
                            'https://www.linkedin.com/in/henricomaeda'
                          ),
                      },
                    ]
                  )
                }>
                <Icon
                  name="verified-user"
                  size={global.screenWidth / 16}
                  color={global.defaultColor}
                />
              </TouchableOpacity>
              {route.name == 'Main' && (
                <TouchableOpacity
                  style={{ marginRight: global.screenWidth / 36 }}
                  onPress={() =>
                    navigation.dispatch(StackActions.push('Data'))
                  }>
                  <Icon
                    name="dashboard-customize"
                    size={global.screenWidth / 16}
                    color={global.defaultColor}
                  />
                </TouchableOpacity>
              )}
            </View>
          ),
        })}>
        <Stack.Screen
          name="Main"
          component={Main}
          options={{ title: 'Menu principal' }}
        />
        <Stack.Screen
          name="Data"
          component={Data}
          options={{ title: 'Alteração de dados' }}
        />
        <Stack.Screen
          name="Cloud"
          component={Cloud}
          options={{ title: 'Banco de dados' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Exportando componente.
export default App;
