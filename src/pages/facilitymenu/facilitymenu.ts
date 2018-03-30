import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AdddoctorPage } from '../adddoctor/adddoctor';
import { AdduserPage } from '../adduser/adduser';
import { HomePage } from '../home/home';
/**
 * Generated class for the FacilitymenuPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-facilitymenu',
  templateUrl: 'facilitymenu.html',
})
export class FacilitymenuPage {

  tab1Root = AdddoctorPage;
  tab2Root = AdduserPage;
  tab3Root = HomePage;

  constructor(public navCtrl: NavController, public storage:Storage) {
   
  }

  ionViewDidEnter(){

  }

  ionViewDidLeave(){
  }

}
