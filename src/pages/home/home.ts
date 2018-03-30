import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';
import { LoadingController } from 'ionic-angular';
import {HttpClient } from '@angular/common/http';
import 'rxjs/Rx';

//import { DoctorProfilePage } from '../doctor-profile/doctor-profile';
//import { DoctorRegisterPage } from '../doctor-register/doctor-register';
import { MenuPage } from '../menu/menu';
//import { DoctormenuPage } from '../doctormenu/doctormenu';
//import { FacilitymenuPage } from '../facilitymenu/facilitymenu';
//import { AssistantmenuPage } from '../assistantmenu/assistantmenu';

/**
 * Generated class for the DoctorHomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('submit') submit;
  
  private loginForm : FormGroup=new FormGroup({controllername:new FormControl()});
  private loginAuthURL="";
  private getDoctorURL="";
  private getAssistantURL="";
  private getAdminURL="";
  public LSTAT:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, 
    private formBuilder: FormBuilder, private httpClient:HttpClient, public loadingCtrl: LoadingController) 
  {
    this.loginForm = this.formBuilder.group({
      userId:['', Validators.compose([Validators.minLength(5), Validators.pattern('[a-zA-Z0-9\.\@ ]*'), Validators.required])],
      password:['', Validators.compose([Validators.minLength(8), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])]
    });
  }

  ionViewDidEnter()
  {
    this.storage.get(GlobalVars.access_type_key).then(val=>
      {
       
        console.log(val);
        /*if(val==GlobalVars.access_type_doctor_profile)
        {
          console.log("Profile Flow");
          this.navCtrl.push(DoctormenuPage);          
        }
        else if(val==GlobalVars.access_type_assistant_profile)
        {
          console.log("Profile Flow");
          this.navCtrl.push(AssistantmenuPage);          
        } */
        if(val !== GlobalVars.access_type_home)
        {
          console.log("Profile Flow");
          this.navCtrl.push(MenuPage);
        }
        else
        {
          console.log("Logged Out");
        }
      });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  
  loginAuth(){
    
    this.loginAuthURL=GlobalVars.END_POINT_GET_LOGIN_AUTH + "?user_id=" + this.loginForm.value.userId.toUpperCase() + "&user_type=DOCTOR";
    console.log(this.loginAuthURL);
/*    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
*/
    this.httpClient.get(this.loginAuthURL).map((res: Response) => res).subscribe(data => {
      
        console.log(data);
        let jsonData:string=JSON.stringify(data);
//        console.log(jsonData);
//        this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
          let myData = JSON.parse(jsonData);
//          console.log("LoginAuth Response",myData.records[0].password);
//        this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_profile);
//        this.navCtrl.push(ProfilePage);
    
      if(this.loginForm.value.password==myData.records[0].password)
      {
        console.log('Login Success');
  /*      let loader = this.loadingCtrl.create({
          content: "Please wait...",
        });
  */      
          //console.log('storage',val);
            this.getDoctorURL = GlobalVars.END_POINT_GET_DOCTOR_PROFILE + "?doctor_id=" + myData.records[0].patient_id;
            this.getAssistantURL = GlobalVars.END_POINT_GET_ASSISTANT_PROFILE + "?assistant_id=" + myData.records[0].patient_id;
            this.getAdminURL = GlobalVars.END_POINT_GET_ADMIN_PROFILE + "?admin_id=" + myData.records[0].patient_id;
            console.log(this.getDoctorURL);
            if(myData.records[0].user_type == "DOCTOR")
            {
              this.httpClient.get(this.getDoctorURL).map((res: Response) => res).subscribe(data => {
            
                let jsonData:string=JSON.stringify(data);
                this.storage.set(GlobalVars.doctor_profile_storage_key,jsonData);  
                console.log("doctorProfile",jsonData);
                this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_doctor_profile);
                console.log("Profile from Login");
                this.navCtrl.push(MenuPage);
              });
            }
            else if(myData.records[0].user_type == "ASSISTANT")
            {
              this.httpClient.get(this.getAssistantURL).map((res: Response) => res).subscribe(data => {
            
                let jsonData:string=JSON.stringify(data);
                this.storage.set(GlobalVars.assistant_profile_storage_key,jsonData);  
                console.log("assistantProfile",jsonData);
                this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_assistant_profile);
                console.log("Profile from Login");
                this.navCtrl.push(MenuPage);
              });
            }
            else if(myData.records[0].user_type == "FACILITY")
            {
              this.httpClient.get(this.getAdminURL).map((res: Response) => res).subscribe(data => {
            
                let jsonData:string=JSON.stringify(data);
                this.storage.set(GlobalVars.admin_profile_storage_key,jsonData);  
                console.log("adminProfile",jsonData);
                this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_admin_profile);
                console.log("Profile from Login");
                this.navCtrl.push(MenuPage);
              });
            }
//      this.navCtrl.push(ProfilePage);
      }
      else
      {
        console.log('Login failed');
        this.LSTAT = "Wrong User ID / Password \n";
      }
    });
  }

/*   gotoRegister(){
    this.storage.set(GlobalVars.access_type_key,GlobalVars.access_type_doctor_register);
  
        this.navCtrl.push(DoctorRegisterPage);
  }
 */
}
