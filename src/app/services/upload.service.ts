import { Injectable } from '@angular/core';
import {getStorage, ref, uploadBytes} from "firebase/storage";
import {FirebaseStorage, getBlob, getDownloadURL, uploadBytesResumable} from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private basePath = 'images/'
  selectedFile : any;
  private storage: FirebaseStorage = getStorage();

  constructor() {}

  /**
   * select file
   * @param $event
   */
  chooseFile($event: any) {
    this.selectedFile = $event.target.files;
  }

  /**
   * Upload image
   * @param file
   */
  async uploadFile(file: any) : Promise<string | null>{
    return new Promise((resolve, reject) => {
      if(file && file.length) {
        try {
          const storageRef = ref(this.storage, `${this.basePath}/${file[0].name}`);
          uploadBytesResumable(storageRef, file[0])
            .then(async() => {
              const imgUrl = await this.getUploadedImageURL(file[0].name);
              resolve(imgUrl);
            })
            .catch(err => {
              reject(err);
            })
        } catch (error) {
          reject(error);
        }
      } else {
        resolve(null);
      }
    });
  }

  /**
   * get image via cloud storage
   * to use this function below
   * const imgUrl = await this.uploadService.getUploadedImageURL("cat.jpeg");
   * console.log(imgUrl);
   * @param fileName
   */
  async getUploadedImageURL(fileName: string) : Promise<string> {
    try {
      const storageRef = ref(this.storage, `${this.basePath}/${fileName}`);
      return getDownloadURL(storageRef)
    } catch (error) {
      console.error("Error getting download URL:", error);
      throw error;
    }
  }

}
