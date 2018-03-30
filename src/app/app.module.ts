import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { MenuPage } from '../pages/menu/menu';
import { FacilitymenuPage } from '../pages/facilitymenu/facilitymenu';
import { DoctormenuPage } from '../pages/doctormenu/doctormenu';
import { AssistantmenuPage } from '../pages/assistantmenu/assistantmenu';
import { ProfilePage } from '../pages/profile/profile';
import { SettingsPage } from '../pages/settings/settings';
import { AdddoctorPage } from '../pages/adddoctor/adddoctor';
import { AdduserPage } from '../pages/adduser/adduser';
import { AppointmentPage } from '../pages/appointment/appointment';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MenuPage,
    FacilitymenuPage,
    DoctormenuPage,
    AssistantmenuPage,
    ProfilePage,
    SettingsPage,
    AdddoctorPage,
    AdduserPage,
    AppointmentPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MenuPage,
    FacilitymenuPage,
    DoctormenuPage,
    AssistantmenuPage,
    ProfilePage,
    SettingsPage,
    AdddoctorPage,
    AdduserPage,
    AppointmentPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    IonicStorageModule,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
