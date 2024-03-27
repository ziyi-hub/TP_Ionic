import { Injectable } from '@angular/core';
import {getStorage, ref, uploadBytes} from "firebase/storage";
import {FirebaseStorage} from "@angular/fire/storage";

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

  async addRecipe(categorieId: string, event: Event) {
    // this.topicService.addPost({id: "", name: "", description: ""}, "IcxRYNDSoIHg9mDLAMaR")
    //   .then(async () => {
    //     const imageUrl = await this.uploadFile(categorieId, this.selectedFile)
    //     console.log("Image URL:", imageUrl);
    //     // this.topicService.updatePost({id: "", name: "", description: "", imageUrl: imageUrl}, "topicId") // update image
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   })
    this.uploadFile(categorieId, this.selectedFile)
    event.preventDefault();
  }

  uploadFile(id: string, file: any) {
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
      console.log(storageRef);
    } catch (error) {
      console.error("Error getting download URL:", error);
      throw error;
    }
  }

}
