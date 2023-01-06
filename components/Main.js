// Importando bibliotecas.
import * as SecureStore from 'expo-secure-store';
import { Icon } from 'react-native-elements';
import { useState, useEffect } from 'react';
import * as Datacalc from '../Globals.js';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

// Definindo componente.
const Main = () => {
  const [data, setData] = useState([]);
  const fetchData = async () => {
    const response = await SecureStore.getItemAsync('products');
    if (response && response.trim().length != 0) setData(JSON.parse(response));
  };

  const calculatePrice = () => {
    let reais = 0;
    let cents = 0;

    data.map((item) => {
      if (item.amount > 0) {
        reais += item.total * item.amount;
        cents += item.subTotal * item.amount;
      }
    });

    while (cents >= 100) {
      cents -= 100;
      reais += 1;
    }

    if (cents < 9) cents = '0' + cents;
    if (reais >= 1000) reais = Datacalc.normalizeNumber(reais);

    const price = reais + ',' + cents;
    return price;
  };

  const resetData = () => {
    setData(
      data.map((item) => (item.amount != 0 ? { ...item, amount: 0 } : item))
    );
  };

  const increaseAmount = (selectedId) => {
    setData(
      data.map((item, index) =>
        index == selectedId ? { ...item, amount: item.amount + 1 } : item
      )
    );
  };

  const decreaseAmount = (selectedId) => {
    setData(
      data.map((item, index) =>
        index == selectedId ? { ...item, amount: item.amount - 1 } : item
      )
    );
  };

  useEffect(() => fetchData(), []);
  return (
    <View
      style={{
        flex: 1,
        padding: global.screenWidth / 22,
        backgroundColor: global.defaultColor,
      }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        <FlatList
          data={data}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.button,
                {
                  borderWidth: 1.2,
                  borderColor: global.highlightColor,
                  marginTop: global.screenWidth / 46.2,
                  backgroundColor: global.defaultColor,
                  paddingRight: global.screenWidth / 32,
                },
              ]}>
              <Icon
                name="view-in-ar"
                color={global.placeholderColor}
                size={global.screenWidth / 16}
                style={{ flex: 0, marginRight: global.screenWidth / 36 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: global.highlightColor,
                    fontSize: global.screenWidth / 22,
                  }}>
                  {item.name}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{
                    color: global.placeholderColor,
                    fontSize: global.screenWidth / 22,
                  }}>
                  R$ {Datacalc.normalizeNumber(item.total)},
                  {item.subTotal < 10 ? '0' + item.subTotal : item.subTotal}
                </Text>
              </View>
              <View
                style={{ flex: 0, alignItems: 'center', flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => item.amount > 0 && decreaseAmount(index)}
                  style={{
                    padding: global.screenWidth / 90,
                    marginLeft: global.screenWidth / 36,
                    backgroundColor: global.highlightColor,
                    borderTopLeftRadius: global.screenWidth / 102,
                    borderBottomLeftRadius: global.screenWidth / 102,
                  }}>
                  <Icon
                    name="remove"
                    color={global.defaultColor}
                    size={global.screenWidth / 16}
                  />
                </TouchableOpacity>
                <Text
                  numberOfLines={1}
                  style={{
                    borderWidth: 1,
                    textAlign: 'center',
                    color: global.highlightColor,
                    padding: global.screenWidth / 90,
                    borderColor: global.highlightColor,
                    fontSize: global.screenWidth / 22.6,
                    backgroundColor: global.defaultColor,
                    paddingLeft: global.screenWidth / 46,
                    paddingRight: global.screenWidth / 46,
                  }}>
                  {item.amount}
                </Text>
                <TouchableOpacity
                  onPress={() => item.amount < 100 && increaseAmount(index)}
                  style={{
                    padding: global.screenWidth / 90,
                    backgroundColor: global.highlightColor,
                    borderTopRightRadius: global.screenWidth / 102,
                    borderBottomRightRadius: global.screenWidth / 102,
                  }}>
                  <Icon
                    name="add"
                    color={global.defaultColor}
                    size={global.screenWidth / 16}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
      <View
        style={{
          flex: 0,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-evenly',
        }}>
        <View
          style={{
            flex: 1,
            borderColor: global.highlightColor,
            borderTopWidth: StyleSheet.hairlineWidth,
          }}
        />
        <Text
          style={{
            flex: 0,
            color: global.highlightColor,
            padding: global.screenWidth / 20,
            fontSize: global.screenWidth / 26,
          }}>
          Preço calculado automaticamente
        </Text>
        <View
          style={{
            flex: 1,
            borderColor: global.highlightColor,
            borderTopWidth: StyleSheet.hairlineWidth,
          }}
        />
      </View>
      <View style={{ flex: 0, flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => resetData()}
          style={[
            styles.button,
            {
              flex: 0,
              borderWidth: 1.2,
              borderColor: global.defaultColor,
              backgroundColor: global.highlightColor,
            },
          ]}>
          <Icon
            name="clear-all"
            color={global.defaultColor}
            size={global.screenWidth / 16}
            style={{ marginRight: global.screenWidth / 32 }}
          />
          <Text
            style={{
              color: global.defaultColor,
              fontSize: global.screenWidth / 26,
            }}>
            Redefinir
          </Text>
        </TouchableOpacity>
        <View
          style={[
            styles.button,
            {
              flex: 1,
              borderWidth: 1.2,
              alignItems: 'center',
              borderColor: global.highlightColor,
              marginLeft: global.screenWidth / 32,
              backgroundColor: global.defaultColor,
            },
          ]}>
          <Text
            style={{
              flex: 0,
              color: global.highlightColor,
              fontSize: global.screenWidth / 26,
              marginRight: global.screenWidth / 32,
            }}>
            R$
          </Text>
          <Text
            numberOfLines={1}
            style={{
              flex: 1,
              color: global.highlightColor,
              fontSize: global.screenWidth / 26,
            }}>
            {calculatePrice()}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Exportando componente.
export default Main;
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: global.screenWidth / 32,
    paddingRight: global.screenWidth / 22,
    borderRadius: global.screenWidth / 62,
    backgroundColor: global.highlightColor,
  },
});
