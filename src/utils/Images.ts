import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default new class Images {
    public async saveStorage(url: string) {
        const fileUri = `${FileSystem.cacheDirectory}${url.split('/').pop()}`;
        const fileInfo = await FileSystem.getInfoAsync(fileUri);

        if (!fileInfo.exists) {
            const { uri } = await FileSystem.downloadAsync(url, fileUri);
            await AsyncStorage.setItem(url, uri);
            return uri;
        } else {
            return fileInfo.uri;
        }
    }

    public async getImageStorage(url: string) {
        const cachedUri = await AsyncStorage.getItem(url);
        if(!cachedUri){
            const uri = await this.saveStorage(url);
            return uri;
        }
        // return cachedUri ? cachedUri : this.saveStorage(url);
        return cachedUri;
    }

    public async deleteImage(url:string){
        const cachedUri = await AsyncStorage.getItem(url);
        if (cachedUri) {
          await FileSystem.deleteAsync(cachedUri);
          await AsyncStorage.removeItem(url);
        }
      };
      

    public async cleanUpOldImages(imagesUrl: string[]){
        const allKeys = await AsyncStorage.getAllKeys();
        const keysToDelete = allKeys.filter(key => !imagesUrl.includes(key));
        
        for (const key of keysToDelete) {
           // CadastroBD.deleteImageStorage(key);
          await this.deleteImage(key);
        }
    }
}