import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';

import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { SettingsPage } from '../settings/settings';

/**
 * Generated class for the DoctormenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-doctormenu',
  templateUrl: 'doctormenu.html',
})
export class DoctormenuPage {

  @ViewChild('tab1') tab1;
  @ViewChild('tab2') tab2;
  
  tab1Root = ProfilePage;
  tab2Root = ProfilePage;
  tab3Root = ProfilePage;
  tab4Root = SettingsPage;

  constructor(public navCtrl: NavController, public storage:Storage) {
   
  }

  ionViewDidEnter(){

  }

  ionViewDidLeave(){
  }

  changeIcon(tab)
  {
    console.log(tab);
  /*  this.tab1.tabTitle = "Current";
    this.tab2.tabTitle = "Previous";
    tab.tabTitle = "Changed";
    tab.color = "red";
  */
  }

  logout()
  {
    this.storage.clear();      
    this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_doctor);
    this.navCtrl.push(HomePage);
  }


}
