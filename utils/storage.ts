// src/utils/storage.ts

import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  cards: Array<string>;
}

export const storeUser = async (user: User): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem('@user', jsonValue);
  } catch (e) {
    console.error('Failed to save the user to local storage', e);
  }
};

export const removeUser = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('@user');
  } catch (e) {
    console.error('Failed to remove the user from local storage', e);
  }
};

export const getUser = async (): Promise<User | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Failed to fetch the user from local storage', e);
    return null;
  }
};

export const storeCards = async (cards: any): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(cards);
    await AsyncStorage.setItem('@cards', jsonValue);
  } catch (e) {
    console.error('Failed to save the products to local storage', e);
  }
};

export const getCards = async (): Promise<any> => {
  try {
    const jsonValue = await AsyncStorage.getItem('@cards');
    return {
      cards: JSON.parse(jsonValue),
    };
  } catch (e) {
    console.error('Failed to get the products from local storage', e);
  }
};
