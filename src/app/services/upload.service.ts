import { Injectable } from '@angular/core';
import {getStorage, ref, uploadBytes} from "firebase/storage";
import {FirebaseStorage, getDownloadURL} from "@angular/fire/storage";

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private basePath = 'images/'
  selectedFile : any;
  private storage: FirebaseStorage = getStorage();

  constructor() {}


  chooseFile($event: any) {
    this.selectedFile = $event.target.files;
  }

  uploadFile(id: string | undefined, file: any, event: Event) {
    return new Promise((resolve, reject) => {
      if(file && file.length) {
        try {
          const refToUpload = ref(this.storage, `${this.basePath}/${file[0].name}`);
          uploadBytes(refToUpload, file)
            .then(snapshot => {
              console.log(snapshot);
              console.log('Uploaded a blob or file!');
            })
            .catch(error => {
              reject(error);
            });
        } catch (error) {
          reject(error);
        }
      } else {
        reject("No file selected");
      }
    });
  }

  async getUploadedImageURL(fileName: string) {
    try {
      const storageRef = ref(this.storage, `${this.basePath}/${fileName}`);
      getDownloadURL(storageRef)
        .then((url) => {
          console.log(url);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.error("Error getting download URL:", error);
      throw error;
    }
  }

}
