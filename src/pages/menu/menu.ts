import { Component, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';

import { HomePage } from '../home/home';
import { AppointmentPage } from '../appointment/appointment';
import { ProfilePage } from '../profile/profile';
import { AdduserPage } from '../adduser/adduser';
import { SettingsPage } from '../settings/settings';
import { FacilitymenuPage } from '../facilitymenu/facilitymenu';
/**
 * Generated class for the MenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-menu',
  templateUrl: 'menu.html',
})
export class MenuPage {

  @ViewChild('tab1') tab1;
  @ViewChild('tab2') tab2;

  public currentUser;
  
  tab1Root = AppointmentPage;
  tab2Root = ProfilePage;
  tab3Root = FacilitymenuPage;
  tab4Root = SettingsPage;

  constructor(public navCtrl: NavController, public storage:Storage) {
   
  }

  ionViewDidEnter(){
    this.storage.get(GlobalVars.access_type_key).then(val=>
      {
        console.log(val);
        this.currentUser = val;
      });
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
    this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_home);
    this.navCtrl.push(HomePage);
  }


}
