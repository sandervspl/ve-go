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
        const newFavorites = favorites.filter(fav => fav.place_id !== placeId);
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
    try {
      const favorites = await this.getItem(this.keys.favorites);

      if (!favorites) {
        return false;
      }

      return favorites.sort((a, b) => a.name > b.name);
    } catch (e) {
      console.log(e);

      return false;
    }
  };

  isFavorited = async (placeId) => {
    try {
      const favorites = await this.getFavorites();

      if (!favorites || (Array.isArray(favorites) && favorites.length === 0)) {
        return false;
      }

      return !!favorites.find(fav => fav.place_id === placeId);
    } catch (e) {
      console.log(e);

      return false;
    }
  };
}

export const asyncStorage = new AsyncStorageHelper();
