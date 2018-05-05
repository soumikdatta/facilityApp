import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';
import {HttpHeaders } from '@angular/common/http';
//import { LoadingController } from 'ionic-angular';
import {HttpClient } from '@angular/common/http';

/**
 * Generated class for the AdddoctorPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-adddoctor',
  templateUrl: 'adddoctor.html',
})
export class AdddoctorPage {

  public doctorList = [
    {
      "doctor_id":18012025,
      "doctor_name":"Anita Datta"
    }
  ];
  public weekdays = [
    {
      "id":0,
      "value":"SUNDAY"
    },
    {
      "id":1,
      "value":"MONDAY"
    },
    {
      "id":2,
      "value":"TUESDAY"
    },
    {
      "id":3,
      "value":"WEDNESDAY"
    },
    {
      "id":4,
      "value":"THURSDAY"
    },
    {
      "id":5,
      "value":"FRIDAY"
    },
    {
      "id":6,
      "value":"SATURDAY"
    }
  ];

  public clinicData = [];
  public clinicChosen = [];
  public clinicHour = [];
  public RSTAT: any;
  private requestURL;
  private getClinicURL="";
  private facility_id = "";

  private profileConfig = {
    "doctor":"",
    "facility":"",
    "clinicStartHr":"",
    "clinicStartMin":"",
    "clinicEndHr":"",
    "clinicEndMin":"",
    "clinicDay":""
  };

  @ViewChild("saveBtn") saveBtn;

  private registrationForm : FormGroup=new FormGroup({controllername:new FormControl()});

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, 
    private httpClient:HttpClient, private storage:Storage) {
    this.registrationForm = this.formBuilder.group({
      //userId:['', Validators.compose([Validators.minLength(5), Validators.maxLength(16), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      doctor:['', Validators.compose([Validators.required])],
      //address:['', Validators.compose([Validators.minLength(8), Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9\.\,\/ ]*'), Validators.required])],
//      email:['', Validators.compose([Validators.maxLength(100), Validators.pattern('^[^\s]+\@[^\s]+\.[^\s]{2,}$'), Validators.required])],
      clinicStartHr:['', Validators.compose([Validators.minLength(2), Validators.maxLength(2), Validators.pattern('[0-9 ]*'), Validators.required])],
      clinicStartMin:['', Validators.compose([Validators.minLength(2), Validators.maxLength(2), Validators.pattern('[0-9 ]*'), Validators.required])],
      clinicEndHr:['', Validators.compose([Validators.minLength(2), Validators.maxLength(2), Validators.pattern('[0-9 ]*'), Validators.required])],
      clinicEndMin:['', Validators.compose([Validators.minLength(2), Validators.maxLength(2), Validators.pattern('[0-9 ]*'), Validators.required])],
      clinicDay:['']
    });
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad AdddoctorPage');
    this.registrationForm.reset();
    this.storage.get(GlobalVars.admin_profile_storage_key).then(result=>{
      if(result != null){
//          let jsonData:string=JSON.stringify(result);
        let myData = JSON.parse(result);
      this.facility_id = myData.records[0].facility_id;
      console.log("Stored Data constructor:",myData);
        if(myData)
        {
          console.log("Patient Photo Constructor",myData.records[0].admin_photo);
          this.getClinicURL=GlobalVars.END_POINT_GET_ADMIN_CLINIC + "?admin_id=" + myData.records[0].admin_id;
          console.log(this.getClinicURL);
          this.httpClient.get(this.getClinicURL).map((res: Response) => res).subscribe(data => {
          //console.log(data);
          let jsonData:string=JSON.stringify(data);
//        console.log(jsonData);
//        this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
          this.clinicData = JSON.parse(jsonData).records;
          console.log(this.clinicData);
          });
          console.log(GlobalVars.END_POINT_GET_ALL_DOCTORS + "?facility_id=" + myData.records[0].facility_id);
          this.httpClient.get(GlobalVars.END_POINT_GET_ALL_DOCTORS + "?facility_id=" + myData.records[0].facility_id).map((res: Response) => res).subscribe(data => {
            //console.log(data);
            let jsonData:string=JSON.stringify(data);
  //        console.log(jsonData);
  //        this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
            this.doctorList = JSON.parse(jsonData).records;
            console.log(this.doctorList);
          });
        }
      }
    });
    this.getDoctorList();
    //this.getFacilityList();
    this.populateClinicHour();
  }

  getDoctorList()
  {

  }

  getFacilityList()
  {

  }

  onChange(id, isChecked) {
    console.log("id",id);
    if(isChecked)
    {
      this.clinicChosen.push(id);
      console.log("Checked Selected: ",this.clinicChosen);
    }
    else
    {
      //console.log("Can't capture");
      /* let idx = this.clinicChosen.findIndex(x => x.id == id);
      console.log(idx);
      this.clinicChosen.splice(idx, 1); */
      this.clinicChosen.forEach( (chosen_id, index) => {
        if(chosen_id === id)
          this.clinicChosen.splice(index,1);
      });
      //this.clinicChosen.filter(number => number !== id);
      console.log("Unchecked Selected: ",this.clinicChosen);
    }
  }

  populateClinicHour()
  {
    for(var i=0; i<24; i++)
    {
      //console.log(i + " " + i.toString() + " " + i.toString().length);
      if(i.toString().length == 1)
        this.clinicHour.push("0"+i);
      else
        this.clinicHour.push(i);
    }
  }

  register()
  {
    //console.log('Registration Success');
/*     let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
 */    
      //console.log('saveconfig');
      this.saveBtn.nativeElement.style.display = "block";
      (<HTMLInputElement> document.getElementById("saveBtn")).disabled = true;
      this.populateConfigObject();
//      loader.present();

      let profileConfigJson:string = JSON.stringify(this.profileConfig);
      console.log("Sent Data JSON:",profileConfigJson);
      this.requestURL = GlobalVars.END_POINT_SEND_CLINIC_REGISTRATION_DATA;

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
          /* loader.dismiss(); */
          this.RSTAT = JSON.parse(data).message;
          this.saveBtn.nativeElement.style.display = "none";
      },
        // Errors will call this callback instead:
        err => {
          /* loader.dismiss(); */
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
    
    //this.profileConfig=new ProfileConfig();
    this.profileConfig.doctor = this.registrationForm.value.doctor;
    this.profileConfig.facility = this.facility_id;
    this.profileConfig.clinicStartHr = this.registrationForm.value.clinicStartHr;
    this.profileConfig.clinicStartMin = this.registrationForm.value.clinicStartMin;
    this.profileConfig.clinicEndHr = this.registrationForm.value.clinicEndHr;
    this.profileConfig.clinicEndMin = this.registrationForm.value.clinicEndMin;
    for(var i=-0; i<this.clinicChosen.length; i++)
    {
      if(this.profileConfig.clinicDay == "")
        this.profileConfig.clinicDay = this.weekdays[this.clinicChosen[i]].value;
      else
      this.profileConfig.clinicDay = this.profileConfig.clinicDay + "," + this.weekdays[this.clinicChosen[i]].value;
    }

    console.log(this.profileConfig);
    
  }

}
