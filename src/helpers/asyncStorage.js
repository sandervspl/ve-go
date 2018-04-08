import { AsyncStorage } from 'react-native';

class AsyncStorageHelper {
  suffix = '@VeganGo:';
  keys = {
    favorites: 'favorites',
  };

  getItem = async (key) => {
    try {
      const item = await AsyncStorage.getItem(`${this.suffix}${key}`);

      if (item) {
        return JSON.parse(item);
      }

      return false;
    } catch (e) {
      console.log(e);

      return false;
    }
  };

  setItem = async (key, value) => {
    try {
      await AsyncStorage.setItem(`${this.suffix}${key}`, JSON.stringify(value));

      return true;
    } catch (e) {
      console.log(e);

      return false;
    }
  };

  favorite = async (placeId) => {
    try {
      const favorites = await this.getFavorites();

      if (favorites) {
        const newFavorites = [...favorites, placeId];
        await this.setItem(this.keys.favorites, newFavorites);

        return true;
      }

      await this.setItem(this.keys.favorites, [placeId]);

      return true;
    } catch (e) {
      console.log(e);

      return false;
    }
  };

  unfavorite = async (placeId) => {
    try {
      const favorites = await this.getFavorites();

      if (favorites) {
        const newFavorites = favorites.filter(id => id !== placeId);
        await this.setItem(this.keys.favorites, newFavorites);

        return true;
      }

      return false;
    } catch (e) {
      console.log(e);

      return false;
    }
  };

  getFavorites = async () => {
    const favorites = await this.getItem(this.keys.favorites);

    if (!favorites) {
      return false;
    }

    return favorites;
  };

  isFavorited = async (placeId) => {
    const favorites = await this.getFavorites();

    if (favorites == null) {
      return false;
    }

    return !!favorites.find(id => id === placeId);
  };
}

export const asyncStorage = new AsyncStorageHelper();
