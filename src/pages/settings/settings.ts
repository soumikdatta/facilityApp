import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import {HttpHeaders } from '@angular/common/http';
//import { LoadingController } from 'ionic-angular';
import {HttpClient } from '@angular/common/http';
import * as GlobalVars from '../../helper/globalvars';
import { HomePage } from '../home/home';
import { ChangePasswordConfig } from '../../helper/ChangePasswordConfig';

/**
 * Generated class for the SettingsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  private PID:any;
  private changeConfig : ChangePasswordConfig;
  private MSG = "";

  private changePasswordForm : FormGroup=new FormGroup({controllername:new FormControl()});

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, 
  private storage: Storage, private httpClient: HttpClient) {
    this.changePasswordForm = this.formBuilder.group({
      oldPassword:['', Validators.compose([Validators.minLength(8), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      newPassword:['', Validators.compose([Validators.minLength(8), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      renewPassword:['', Validators.compose([Validators.minLength(8), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
    this.storage.get(GlobalVars.access_type_key).then(val=>
      {
       
        console.log(val);
        if(val==GlobalVars.access_type_doctor_profile)
        {
          console.log("Profile Loaded Again");
          this.storage.get(GlobalVars.doctor_profile_storage_key).then(result=>{
            if(result != null){
    //          let jsonData:string=JSON.stringify(result);
              let myData = JSON.parse(result);
             console.log("Stored Data constructor:",myData);
              if(myData)
              {
                console.log("Doctor Photo Constructor",myData.records[0].doctor_photo);
                this.PID=myData.records[0].doctor_id;
              }
    //          this.PID.value=this.profileConfig.data;
              }else{
                console.log("No data in storage constructor");
            }
          });
        }
        else if(val==GlobalVars.access_type_admin_profile)
        {
          console.log("Profile Loaded Again");
          this.storage.get(GlobalVars.admin_profile_storage_key).then(result=>{
            if(result != null){
    //          let jsonData:string=JSON.stringify(result);
              let myData = JSON.parse(result);
             console.log("Stored Data constructor:",myData);
              if(myData)
              {
                console.log("Facility Photo Constructor",myData.records[0].admin_photo);
                this.PID=myData.records[0].admin_id;
              }
    //          this.PID.value=this.profileConfig.data;
              }else{
                console.log("No data in storage constructor");
            }
          });
        }
        else if(val==GlobalVars.access_type_assistant_profile)
        {
          console.log("Profile Loaded Again");
          this.storage.get(GlobalVars.assistant_profile_storage_key).then(result=>{
            if(result != null){
    //          let jsonData:string=JSON.stringify(result);
              let myData = JSON.parse(result);
             console.log("Stored Data constructor:",myData);
              if(myData)
              {
                console.log("Assistant Photo Constructor",myData.records[0].assistant_photo);
                this.PID=myData.records[0].assistant_id;
              }
    //          this.PID.value=this.profileConfig.data;
              }else{
                console.log("No data in storage constructor");
            }
          });
        }
        else
        {
          console.log("Logged Out");
          this.navCtrl.push(HomePage);          
        }
      });
  }

  updatePassword()
  {
    if(this.changePasswordForm.value.newPassword == this.changePasswordForm.value.renewPassword 
    && this.changePasswordForm.value.newPassword != this.changePasswordForm.value.oldPassword)
    {
      this.changeConfig=new ChangePasswordConfig();
      this.changeConfig.PID = this.PID;
      this.changeConfig.oldPassword = this.changePasswordForm.value.oldPassword;
      this.changeConfig.newPassword = this.changePasswordForm.value.newPassword;
      this.changeConfig.renewPassword = this.changePasswordForm.value.renewPassword;
      console.log(this.changeConfig);
      console.log(GlobalVars.END_POINT_SEND_CHANGE_PASSWORD);
      this.httpClient.post(GlobalVars.END_POINT_SEND_CHANGE_PASSWORD, this.changeConfig,{
        headers: new HttpHeaders().set("Content-type", "application/json"),
        responseType:"text",
      
      })
      .subscribe( data => {
        console.log(data);
        //this.storage.set(GlobalVars.patient_profile_storage_key,profileConfigJson);
        this.MSG = JSON.parse(data).message;
        this.changePasswordForm.value.oldPassword = "";
        this.changePasswordForm.value.newPassword = "";
        this.changePasswordForm.value.renewPassword = "";
            
      },
        // Errors will call this callback instead:
        err => {
          console.log(this.changeConfig);
          console.log('Could not save Password!',err);
        }
      );
  
    }
    else
    {
      this.MSG = " Old and New passwords can't be same. <br> OR <br> New passwords don't match. <br> Please re-enter.";
    }
  }

}
