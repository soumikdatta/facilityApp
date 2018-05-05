import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Storage } from '@ionic/storage';
import * as GlobalVars from '../../helper/globalvars';
import { HttpHeaders } from '@angular/common/http';
import {HttpClient } from '@angular/common/http';
import { BookingConfig } from '../../helper/BookingConfig';
import { LoadingController } from 'ionic-angular';

/**
 * Generated class for the AppointmentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

/************************************
 * isActive States:
 * cancelled => 0
 * booking => 1
 * present => 2
 * current => 3
 * complete => 4
************************************/

@IonicPage()
@Component({
  selector: 'page-appointment',
  templateUrl: 'appointment.html',
})
export class AppointmentPage {

  @ViewChild("clinicList") clinicList;
  @ViewChild("noclinicList") noclinicList;
  @ViewChild("appointmentList") appointmentList;
  @ViewChild("noAppointment") noAppointment;
  @ViewChild("patientDetail") patientDetail;
  @ViewChild("addBookingInfoPage") addBookingInfoPage;
  @ViewChild("bookingConfirm") bookingConfirm;
  
  private getClinicURL="";
  private getAppointmentURL="";
  public clinicData = [];
  public appointmentData = [];
  public appointmentDetails = [];
  public profileData = [];
  public userType;
  public currentVisit = [];
  public currentClinic =[];
  public doctorAvailability = "OUT";
  //public IN_OUT = "OUT";
  public source = "WALK IN";
  public booking_id: any;
  public queue_status: any;
  private chamber_id;
  private today = new Date();
  private query_date = new Date();
  public booking_date = "";
  private month_names = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  private month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public todayFlag = true;
  public pastFlag = false;
  public futureFlag = false;

  private patientVisitForm : FormGroup=new FormGroup({controllername:new FormControl()});

  private bookingForm : FormGroup=new FormGroup({controllername:new FormControl()});
  private datePickerForm : FormGroup=new FormGroup({controllername:new FormControl()});

  private bookingConfig : BookingConfig;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private storage:Storage, 
    private httpClient:HttpClient, private formBuilder: FormBuilder, public loadingCtrl: LoadingController) {
      this.patientVisitForm = this.formBuilder.group({
        prescription:['', Validators.compose([Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9\.\@ \#/\n\']*'), Validators.required])]
      });
      this.bookingForm = this.formBuilder.group({
        chamber_id:['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9 ]*')])],
        patient_id:['', Validators.compose([Validators.maxLength(30), Validators.pattern('[0-9 ]*')])],
        name:['', Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
        address:['', Validators.compose([Validators.minLength(8), Validators.maxLength(100), Validators.pattern('[a-zA-Z0-9\.\,\/ /\n/\r]*'), Validators.required])],
        age:['', Validators.compose([Validators.minLength(1), Validators.maxLength(3), Validators.pattern('[0-9]*'), Validators.required])],
        sex:['', Validators.compose([Validators.minLength(1), Validators.maxLength(1), Validators.pattern('[mMfF]*'), Validators.required])],
        phone:['', Validators.compose([Validators.minLength(10), Validators.maxLength(12), Validators.pattern('[0-9 ]*'), Validators.required])],
        symptoms:['', Validators.compose([Validators.maxLength(200), Validators.pattern('[a-zA-Z0-9\.\'\,\/ ]*'), Validators.required])]
      });
      this.datePickerForm = this.formBuilder.group({
        /* datePicker:['',Validators.compose([Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9\/ ]*'), Validators.required])] */
        visit_date:['']
      });
  }

  ionViewDidEnter() {
    this.clinicList.nativeElement.style.display = "block";
    this.appointmentList.nativeElement.style.display = "none";
    this.noAppointment.nativeElement.style.display = "none";
    this.patientDetail.nativeElement.style.display = "none";
    this.addBookingInfoPage.nativeElement.style.display = "none";
    this.bookingConfirm.nativeElement.style.display = "none";
    
    this.calculateBookingDate();
  }

  ionViewWillLeave() {
    // Unregister the custom back button action for this page
    //this.navCtrl.pop();
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad AppointmentPage');

    this.clinicList.nativeElement.style.display = "block";
    this.appointmentList.nativeElement.style.display = "none";
    this.noAppointment.nativeElement.style.display = "none";
    this.patientDetail.nativeElement.style.display = "none";
    this.addBookingInfoPage.nativeElement.style.display = "none";
    this.bookingConfirm.nativeElement.style.display = "none";

    this.calculateBookingDate();

    this.storage.get(GlobalVars.access_type_key).then(val=> {
       
      console.log(val);
      this.userType = val;

      this.getClinic();

    });
  }

  getClinic()
  {
    if(this.userType==GlobalVars.access_type_doctor_profile)
    {
      console.log("Doctor Profile Loaded Again");
      this.storage.get(GlobalVars.doctor_profile_storage_key).then(result=>{
        if(result != null){
  //          let jsonData:string=JSON.stringify(result);
          let myData = JSON.parse(result);
        console.log("Stored Data constructor:",myData);
          if(myData)
          {
            console.log("Patient Photo Constructor",myData.records[0].doctor_photo);
            this.getClinicURL=GlobalVars.END_POINT_GET_DOCTOR_CLINIC + "?doctor_id=" + myData.records[0].doctor_id + "&booking_date=" + this.query_date.toLocaleString();
            console.log(this.getClinicURL);
            this.httpClient.get(this.getClinicURL).map((res: Response) => res).subscribe(data => {
            //console.log(data);
            let jsonData:string=JSON.stringify(data);
  //        console.log(jsonData);
  //        this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
            if(typeof JSON.parse(jsonData).records == "object")
            {
              console.log("object");
              this.clinicData = JSON.parse(jsonData).records;
              console.log(this.clinicData);
              this.clinicList.nativeElement.style.display = "block";
              this.noclinicList.nativeElement.style.display = "none";
            }
            else if(typeof JSON.parse(jsonData).records == "string")
            {
              console.log("string");
              this.clinicList.nativeElement.style.display = "none";
              this.noclinicList.nativeElement.style.display = "block";
            }
            });            
          }
        }
      });
    }
    else if(this.userType==GlobalVars.access_type_admin_profile)
    {
      console.log("Admin Profile Loaded Again");
      this.storage.get(GlobalVars.admin_profile_storage_key).then(result=>{
        if(result != null){
  //          let jsonData:string=JSON.stringify(result);
          let myData = JSON.parse(result);
        console.log("Stored Data constructor:",myData);
          if(myData)
          {
            console.log("Patient Photo Constructor",myData.records[0].admin_photo);
            this.getClinicURL=GlobalVars.END_POINT_GET_ADMIN_CLINIC + "?admin_id=" + myData.records[0].admin_id + "&booking_date=" + this.query_date.toLocaleString();
            console.log(this.getClinicURL);
            this.httpClient.get(this.getClinicURL).map((res: Response) => res).subscribe(data => {
            //console.log(data);
            let jsonData:string=JSON.stringify(data);
  //        console.log(jsonData);
  //        this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
            if(typeof JSON.parse(jsonData).records == "object")
            {
              console.log("object");
              this.clinicData = JSON.parse(jsonData).records;
              console.log(this.clinicData);
              this.clinicList.nativeElement.style.display = "block";
              this.noclinicList.nativeElement.style.display = "none";
            }
            else if(typeof JSON.parse(jsonData).records == "string")
            {
              console.log("string");
              this.clinicList.nativeElement.style.display = "none";
              this.noclinicList.nativeElement.style.display = "block";
            }
            });            
          }
        }
      });
    }
    else if(this.userType==GlobalVars.access_type_assistant_profile)
    {
      console.log("Assistant Profile Loaded Again");
      this.storage.get(GlobalVars.assistant_profile_storage_key).then(result=>{
        if(result != null){
  //          let jsonData:string=JSON.stringify(result);
          let myData = JSON.parse(result);
        console.log("Stored Data constructor:",myData);
          if(myData)
          {
            console.log("Patient Photo Constructor",myData.records[0].assistant_photo);
            this.getClinicURL=GlobalVars.END_POINT_GET_ASSISTANT_CLINIC + "?assistant_id=" + myData.records[0].assistant_id + "&booking_date=" + this.query_date.toLocaleString();
            console.log(this.getClinicURL);
            this.httpClient.get(this.getClinicURL).map((res: Response) => res).subscribe(data => {
            //console.log(data);
            let jsonData:string=JSON.stringify(data);
  //        console.log(jsonData);
  //        this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
              if(typeof JSON.parse(jsonData).records == "object")
              {
                console.log("object");
                this.clinicData = JSON.parse(jsonData).records;
                console.log(this.clinicData);
                this.clinicList.nativeElement.style.display = "block";
                this.noclinicList.nativeElement.style.display = "none";
              }
              else if(typeof JSON.parse(jsonData).records == "string")
              {
                console.log("string");
                this.clinicList.nativeElement.style.display = "none";
                this.noclinicList.nativeElement.style.display = "block";
              }
            });            
          }
        }
      });
    }
  }

  goToClinic(clinic)
  {
    console.log(clinic.doctorAvailability);
    this.currentClinic = clinic;
    this.chamber_id = clinic.chamber_id;
    this.getAppointmentURL=GlobalVars.END_POINT_GET_CLINIC_APPOINTMENTS + "?chamber_id=" + clinic.chamber_id + "&booking_date=" + this.query_date.toLocaleString();
    console.log(this.getAppointmentURL);
    this.httpClient.get(this.getAppointmentURL).map((res: Response) => res).subscribe(data => {
    //console.log(data);
      let jsonData:string=JSON.stringify(data);
      //console.log(jsonData);
      let myData = JSON.parse(jsonData);
      if(myData.message == "No Booking available.")
      {
        this.clinicList.nativeElement.style.display = "none";
        this.noAppointment.nativeElement.style.display = "block";
      }
      else
      {
        //this.storage.set(GlobalVars.patient_profile_storage_key,jsonData);  
        this.appointmentData = myData.records;
        console.log(myData.records);
        console.log(this.appointmentData);

        /* for(var i=0; i<this.appointmentData.length; i++)
        {
          this.appointmentData[i].doctorAvailability = "OUT";
        } */

        this.clinicList.nativeElement.style.display = "none";
        if(this.appointmentData.length>0)
        {
          this.appointmentList.nativeElement.style.display = "block";
        }
        else
        {
          this.noAppointment.nativeElement.style.display = "block";
        }

      }
      
    });
  }

  startVisit(appointment)
  {
    this.appointmentDetails = appointment;
    this.appointmentList.nativeElement.style.display = "none";
    this.patientDetail.nativeElement.style.display = "block";
    
  }

  closeDiv(myDiv)
  {
    this.clinicList.nativeElement.style.display = "none";
    this.appointmentList.nativeElement.style.display = "none";
    this.noAppointment.nativeElement.style.display = "none";
    this.patientDetail.nativeElement.style.display = "none";
    this.addBookingInfoPage.nativeElement.style.display = "none";
    this.bookingConfirm.nativeElement.style.display = "none";
    console.log(myDiv);
    myDiv.style.display = "block";
    
  }

  completeVisit(appointmentDetails)
  {
    console.log(appointmentDetails);
    console.log(this.patientVisitForm.value.prescription);
    this.appointmentData.forEach(value=>{
      if(value.booking_id == appointmentDetails.booking_id){
        value.isActive = 4;
        this.updateServer(appointmentDetails.booking_id, 4);
      }
    });
    console.log(this.appointmentData);
  }

  doNothing()
  {

  }

  makeCurrent(appointment)
  {
    //appointment.isActive = 3;
    //this.currentVisit = appointment;
    this.appointmentData.forEach(value=>{
      if(value.booking_id == appointment.booking_id){
        value.isActive = 3;
        this.updateServer(appointment.booking_id, 3);
      }
    });
  }

  revertCurrent(appointment)
  {
    //appointment.isActive = 3;
    //this.currentVisit = appointment;
    this.appointmentData.forEach(value=>{
      if(value.booking_id == appointment.booking_id){
        value.isActive = 2;
        this.updateServer(appointment.booking_id, 2);
      }
    });
  }

  revertComplete(appointment)
  {
    //appointment.isActive = 3;
    //this.currentVisit = appointment;
    this.appointmentData.forEach(value=>{
      if(value.booking_id == appointment.booking_id){
        value.isActive = 3;
        this.updateServer(appointment.booking_id, 3);
      }
    });
  }

  patientPresent(appointment, e) {
    console.log(appointment.booking_id);
    if(e.target.checked)
    {
      this.appointmentData.forEach(value=>{
        if(value.booking_id == appointment.booking_id){
          value.isActive = 2;
          this.updateServer(appointment.booking_id, 2);
          console.log("Record found");
        }
      });
      console.log("Selected: ",this.appointmentData);
    }
    else
    {
      console.log("Can't capture");
      this.appointmentData.forEach(value=>{
        if(value.booking_id == appointment.booking_id){
          value.isActive = 1;
          this.updateServer(appointment.booking_id, 1);
        }
      });
      console.log("Selected: ",this.appointmentData);
    }
  }

  cancelBooking(appointment)
  {
    this.appointmentData.forEach(value=>{
      if(value.booking_id == appointment.booking_id){
        value.isActive = 0;
        console.log("Record found");
        this.updateServer(appointment.booking_id, 0);
      }
    });
    console.log("Cancelled: ",this.appointmentData);
  }

  toggleAvailability(clinic,chamber_id, evt)
  {
    console.log(clinic);
    console.log(evt.checked);
    if((evt.checked && clinic.doctorAvailability == "OUT") || (!evt.checked && clinic.doctorAvailability == "IN"))
    {
      console.log("Need to update availability");
      for(var i=0; i<this.clinicData.length; i++)
      {
        if(this.clinicData[i].chamber_id == chamber_id)
        {
          if(this.clinicData[i].doctorAvailability == 'IN'){
            this.clinicData[i].doctorAvailability = 'OUT';
            //chamber_id.IN_OUT = "OUT";
          }
          else{
            this.clinicData[i].doctorAvailability = 'IN';
            //chamber_id.IN_OUT = "IN";
          }
        }
      }
      let availabilityURL = GlobalVars.END_POINT_SEND_AVAILABILITY + "?chamber_id=" + chamber_id + "&doctorAvailability=" + clinic.doctorAvailability;
      console.log(availabilityURL);
      this.httpClient.get(availabilityURL).map((res: Response) => res).subscribe(data => {
        let jsonData:string=JSON.stringify(data);
        //console.log(jsonData);
          let myData = JSON.parse(jsonData);
          console.log("Availability Response",myData.message);
          //alert(myData.message);
      });
    }
    //console.log(clinic.doctorAvailability);
    //console.log(clinic);
  }

  addBookingInfo(currentClinic, divID)
  {
    //console.log("addBookingInfo",divID);
    divID.style.display = "none";
    this.addBookingInfoPage.nativeElement.style.display = "block";
  }

  saveBooking(){
    //console.log('Registration Success');
    let loader = this.loadingCtrl.create({
      content: "Please wait...",
    });
    
      //console.log('saveconfig');
      this.populateConfigObject();
//      loader.present();

      let bookingConfigJson:string = JSON.stringify(this.bookingConfig);
      console.log("Sent Data:",bookingConfigJson);
      let updURL = GlobalVars.END_POINT_SEND_BOOKING_DATA;
      //console.log(updURL);
      this.httpClient.post(updURL, bookingConfigJson,{
        headers: new HttpHeaders().set("Content-type", "application/json"),
        responseType:"text",
      
      })
      .subscribe( data => {
        //console.log('Booking saved',data);
//        this.storage.set(GlobalVars.patient_profile_storage_key,profileConfigJson);
        loader.dismiss();
        //let jsonData:string=JSON.stringify(data);
        //console.log(jsonData);
        let myData = JSON.parse(data);
        //console.log(myData);
        this.booking_id = myData.booking_id;
        this.queue_status = myData.queue_status;
        this.addBookingInfoPage.nativeElement.style.display = "none";
        this.bookingConfirm.nativeElement.style.display = "block";
//        this.gotoMenuPage();    
      },
        // Errors will call this callback instead:
        err => {
          loader.dismiss();
          //console.log(bookingConfigJson);
          console.log('Could not save Profile!',err);
        }
      );
      //console.log(JSON.stringify(this.ambulanceConfig));
//      this.storage.set(GlobalVars.patient_profile_storage_key,profileConfigJson);
      //this.gotoMainPage();
  }

  populateConfigObject(){
    //console.log('populateConfigObject');
    
    this.bookingConfig=new BookingConfig();
    //this.bookingConfig.patient_id = this.patient_id;
    this.bookingConfig.patient_name = this.bookingForm.value.name;
    this.bookingConfig.patient_address = this.bookingForm.value.address;
    this.bookingConfig.patient_age = this.bookingForm.value.age;
    this.bookingConfig.patient_phone = this.bookingForm.value.phone;
    this.bookingConfig.patient_sex = this.bookingForm.value.sex.toUpperCase();
    this.bookingConfig.chamber_id = this.chamber_id;
    this.bookingConfig.symptoms = this.bookingForm.value.symptoms;
    this.bookingConfig.source = this.source;
//    this.profileConfig.password = this.editProfileForm.value.password;
    //console.log("Populated",this.bookingConfig);
    
  }

  bookingSource()
  {
    if(this.source == "WALK IN")
    {
      this.source = "PHONE";
    }
    else
    {
      this.source = "WALK IN";
    }
  }

  toggleList(divID)
  {
    console.log(this.appointmentData);
    document.getElementById("queue").style.display = "none";
    document.getElementById("history").style.display = "none";
    document.getElementById(divID).style.display = "block";
  }

  updateServer(booking_id, state)
  {
    let stateChangeURL = GlobalVars.END_POINT_SEND_BOOKING_STATE + "?booking_id=" + booking_id + "&state=" + state;
    console.log(stateChangeURL);
    this.httpClient.get(stateChangeURL).map((res: Response) => res).subscribe(data => {
      let jsonData:string=JSON.stringify(data);
      //console.log(jsonData);
        let myData = JSON.parse(jsonData);
        //console.log("LoginAuth Response",myData.message);
        //alert(myData.message);
    });
  }

  calculateBookingDate()
  {
    this.booking_date = this.query_date.getDate() + "-" + this.month_names_short[this.query_date.getMonth()] + "-" + this.query_date.getFullYear();
    console.log("Booking Date",this.booking_date);
    //console.log("Query Date",this.query_date.getTime());
    //console.log("Today",this.today.getTime());
    this.todayFlag = this.query_date.getTime() === this.today.getTime() ? true : false;
    this.pastFlag = this.query_date.getTime() < this.today.getTime() ? true : false;
    this.futureFlag = this.query_date.getTime() > this.today.getTime() ? true : false;
    console.log("todayFlag",this.todayFlag);
    console.log("futureFlag",this.futureFlag);
    console.log("pastFlag",this.pastFlag);
  }

  getPreviousDate()
  {
    this.query_date = new Date(this.query_date.getTime() - (1000 * 60 * 60 * 24));
    this.calculateBookingDate();
    this.getClinic();
  }

  getNextDate()
  {
    this.query_date = new Date(this.query_date.getTime() + (1000 * 60 * 60 * 24));
    console.log(this.query_date);
    this.calculateBookingDate();
    this.getClinic();
  }

  changeDate()
  {
    var visitDate = this.datePickerForm.value.visit_date;
    document.getElementById("date_picker").style.display = "none";
    console.log("Visit Date:",visitDate);
    console.log(visitDate == "");
    if(visitDate != "")
    {
      this.query_date = new Date(visitDate);
      console.log(this.query_date);
      this.calculateBookingDate();
      this.getClinic();
    }
  }

  openDatePicker()
  {
    document.getElementById("date_picker").style.display = "block";
  }

}
