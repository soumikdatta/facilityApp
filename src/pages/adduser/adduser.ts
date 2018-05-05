import { Component, ViewChild  } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';
import {HttpHeaders } from '@angular/common/http';
import { LoadingController } from 'ionic-angular';
import {HttpClient } from '@angular/common/http';
import { ProfileConfig } from '../../helper/ProfileConfig';

//import { HomePage } from '../home/home';

/**
 * Generated class for the AdduserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adduser',
  templateUrl: 'adduser.html',
})
export class AdduserPage {

  public RSTAT: any;
  private requestURL;
  private userType = "";
  public regno;
  public spclty;
  public exp;
  private FID;
  public checked = "admin";
  public baseProfile="";
  public clinicData;
  public clinicChosen = [];
  
  @ViewChild("saveBtn") saveBtn;

  private registrationForm : FormGroup=new FormGroup({controllername:new FormControl()});
//  private getPatientURL="";
  private profileConfig : ProfileConfig;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, 
    private formBuilder: FormBuilder, private httpClient:HttpClient, public loadingCtrl: LoadingController) 
  {
    this.registrationForm = this.formBuilder.group({
      //userId:['', Validators.compose([Validators.minLength(5), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      name:['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      //address:['', Validators.compose([Validators.minLength(8), Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9\.\,\/ ]*'), Validators.required])],
//      email:['', Validators.compose([Validators.maxLength(100), Validators.pattern('^[^\s]+\@[^\s]+\.[^\s]{2,}$'), Validators.required])],
      email:['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9\.\@ ]*'), Validators.required])],
      phone:['', Validators.compose([Validators.minLength(10), Validators.maxLength(12), Validators.pattern('[0-9 ]*'), Validators.required])],
      regno:['', Validators.compose([Validators.minLength(1), Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9\.\,\/ ]*')])],
      spclty:['', Validators.compose([Validators.minLength(1), Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9\.\,\/ ]*')])],
      exp:['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.pattern('[0-9]*')])],
      password:['', Validators.compose([Validators.minLength(8), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9 ]*')])],
      userType:['', Validators.compose([Validators.required])],
      clinic:['']
    });
  }

  ionViewDidEnter() {
    this.registrationForm.reset();
    this.storage.get(GlobalVars.access_type_key).then(val=>
      {
       
        console.log(val);
        if(val==GlobalVars.access_type_admin_profile)
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
                this.FID=myData.records[0].facility_id;
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
          //this.navCtrl.push(HomePage);          
        }
      });
  }

  register()
  {
    //console.log('Registration Success');
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    
      //console.log('saveconfig');
      this.saveBtn.nativeElement.style.display = "block";
      (<HTMLInputElement> document.getElementById("saveBtn")).disabled = true;
      this.populateConfigObject();
//      loader.present();

      let profileConfigJson:string = JSON.stringify(this.profileConfig);
      console.log("Sent Data:",profileConfigJson);
      if(this.registrationForm.value.userType == "doctor")
      {
        this.requestURL = GlobalVars.END_POINT_SEND_DOCTOR_REGISTRATION_DATA;
      }
      else if(this.registrationForm.value.userType == "assistant")
      {
        this.requestURL = GlobalVars.END_POINT_SEND_ASSISTANT_REGISTRATION_DATA;
      }
      else if(this.registrationForm.value.userType == "admin")
      {
        this.requestURL = GlobalVars.END_POINT_SEND_ADMIN_REGISTRATION_DATA;
      }

      console.log(this.requestURL);
      this.httpClient.post(this.requestURL, profileConfigJson,{
        headers: new HttpHeaders().set("Content-type", "application/json"),
        responseType:"text",
      
      })
      .subscribe( data => {
        
        console.log('Registration saved',data);
/*         if(JSON.parse(data). != "BLANK")
        {
          //console.log('Registration saved',data);
//        this.storage.set(GlobalVars.patient_profile_storage_key,profileConfigJson);
          loader.dismiss();
          this.RSTAT = JSON.parse(data).message;
          this.saveBtn.nativeElement.style.display = "none";
          //this.gotoMainPage();
        }
        else
        {
          loader.dismiss();
          //console.log(profileConfigJson);
          //console.log('Could not save Registration!',data);
          this.RSTAT = "Could not save Registration! " + JSON.parse(data).message;
        } */
          loader.dismiss();
          this.RSTAT = JSON.parse(data).message;
          this.saveBtn.nativeElement.style.display = "none";
      },
        // Errors will call this callback instead:
        err => {
          loader.dismiss();
          //console.log(profileConfigJson);
          //console.log('Could not save Registration!',err);
          this.RSTAT = "Could not save Registration! " + err;
        }
      );
      this.registrationForm.reset();
      //console.log(JSON.stringify(this.ambulanceConfig));
//      this.storage.set(GlobalVars.patient_profile_storage_key,profileConfigJson);
      //this.gotoMainPage();
    }
  populateConfigObject(){
    //console.log('populateConfigObject');
    
    this.profileConfig=new ProfileConfig();
    this.profileConfig.user_name = this.registrationForm.value.name;
    //this.profileConfig.user_address = this.registrationForm.value.address;
    this.profileConfig.user_email = this.registrationForm.value.email;
    this.profileConfig.user_phone = this.registrationForm.value.phone;
    this.profileConfig.user_type = this.registrationForm.value.userType;
    this.profileConfig.user_regno = this.registrationForm.value.regno;
    this.profileConfig.speciality = this.registrationForm.value.spclty;
    this.profileConfig.user_exp = this.registrationForm.value.exp;
    this.profileConfig.clinic = this.clinicChosen;
	this.profileConfig.facility_id = this.FID;
    
  }
  
  gotoMainPage(){
    this.populateConfigObject();
    console.log(this.profileConfig);
  }

  checkUserType()
  {
    console.log(this.registrationForm.value.userType);
    if(this.registrationForm.value.userType == 'doctor')
    {
      /* this.regno = "";
      this.spclty = "";
      this.exp = ""; */
      this.userType = "doctor";
    }
    else if(this.registrationForm.value.userType == 'assistant')
    {
      /* this.regno = "none";
      this.spclty = "none";
      this.exp = "0"; */
      this.httpClient.get(GlobalVars.END_POINT_GET_ALL_CLINICS + "?facility_id=" + this.FID).map((res: Response) => res).subscribe(data => {
        console.log(data);
        let jsonData:string=JSON.stringify(data);
//        console.log(jsonData);
//        this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
          let myData = JSON.parse(jsonData);
          this.clinicData = myData.records;
          console.log(this.clinicData);
          this.userType = "assistant";
      });
    }
    else
    {
      this.userType = "admin";
    }
  }

  onChange(id, isChecked) {
    if(isChecked)
    {
      this.clinicChosen.push(id);
      console.log("Selected: ",this.clinicChosen);
    }
    else
    {
      //console.log("Can't capture");
      /* let idx = this.clinicChosen.find(x => x.value == id);
      //console.log(idx);
      this.clinicChosen.splice(idx, 1); */
      this.clinicChosen.forEach( (chosen_id, index) => {
        if(chosen_id === id)
          this.clinicChosen.splice(index,1);
      });
      console.log("Selected: ",this.clinicChosen);
    }
  }

}
