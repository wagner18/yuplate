import { Injectable, OnInit } from '@angular/core';
import { Platform, MenuController, NavController, ModalController, AlertController} from 'ionic-angular';

import { Storage } from '@ionic/storage';

@Injectable()
export class BaseProvider {

  constructor(public alert: AlertController){}


  public showAlert(title: string, msg: string): void {
    let alert = this.alert.create({
      title: title,
      subTitle: msg,
      buttons: ['OK']
    });
    alert.present();
  }

}