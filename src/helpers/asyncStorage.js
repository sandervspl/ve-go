import { AsyncStorage } from 'react-native';

class AsyncStorageHelper {
  suffix = '@VeganGo:';
  keys = {
    saved: 'saved',
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

  save = async (placeId) => {
    try {
      const saved = await this.getSaved();

      if (saved) {
        const newSaved = [...saved, placeId];
        await this.setItem(this.keys.saved, newSaved);

        return true;
      }

      await this.setItem(this.keys.saved, [placeId]);

      return true;
    } catch (e) {
      console.log(e);

      return false;
    }
  };

  unsave = async (placeId) => {
    try {
      const saved = await this.getSaved();

      if (saved) {
        const newSaved = saved.filter(fav => fav.place_id !== placeId);
        await this.setItem(this.keys.saved, newSaved);

        return true;
      }

      return false;
    } catch (e) {
      console.log(e);

      return false;
    }
  };

  getSaved = async () => {
    try {
      const saved = await this.getItem(this.keys.saved);

      if (!saved) {
        return false;
      }

      return saved.sort((a, b) => a.name > b.name);
    } catch (e) {
      console.log(e);

      return false;
    }
  };

  isSaved = async (placeId) => {
    try {
      const saved = await this.getSaved();

      if (!saved || (Array.isArray(saved) && saved.length === 0)) {
        return false;
      }

      return !!saved.find(fav => fav.place_id === placeId);
    } catch (e) {
      console.log(e);

      return false;
    }
  };
}

export const asyncStorage = new AsyncStorageHelper();
