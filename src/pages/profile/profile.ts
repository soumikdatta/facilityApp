import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  public profileData = [];
  public server = GlobalVars.WORKING_SERVER;
  public userType;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DoctorProfilePage');
    this.storage.get(GlobalVars.access_type_key).then(val=> {
       
        console.log(val);
        this.userType = val;
        if(val==GlobalVars.access_type_doctor_profile)
        {
          console.log("Doctor Profile Loaded Again");
          this.storage.get(GlobalVars.doctor_profile_storage_key).then(result=>{
            if(result != null){
    //          let jsonData:string=JSON.stringify(result);
              let myData = JSON.parse(result);
            console.log("Stored Data constructor:",myData);
              if(myData)
              {
                console.log("Doctor Photo Constructor",myData.records[0].doctor_photo);
                this.profileData = myData.records[0];
                console.log(this.profileData);
              }
            }
          });
        }
        else if(val==GlobalVars.access_type_admin_profile)
        {
          console.log("Admin Profile Loaded Again");
          this.storage.get(GlobalVars.admin_profile_storage_key).then(result=>{
            if(result != null){
    //          let jsonData:string=JSON.stringify(result);
              let myData = JSON.parse(result);
            console.log("Stored Data constructor:",myData);
              if(myData)
              {
                console.log("Admin Photo Constructor",myData.records[0].admin_photo);
                this.profileData = myData.records[0];
                console.log(this.profileData);
              }
            }
          });
        }
        else if(val==GlobalVars.access_type_assistant_profile)
        {
          console.log("Assistant Profile Loaded Again");
          this.storage.get(GlobalVars.assistant_profile_storage_key).then(result=>{
            if(result != null){
    //          let jsonData:string=JSON.stringify(result);
              let myData = JSON.parse(result);
            console.log("Stored Data constructor:",myData);
              if(myData)
              {
                console.log("Assistant Photo Constructor",myData.records[0].assistant_photo);
                this.profileData = myData.records[0];
                console.log(this.profileData);
              }
            }
          });
        }
      });
  }

  getImage()
  {
    //return this.PIMG;
  }

  editProfile()
  {
    //this.navCtrl.push(EditprofilePage);
  }


}
