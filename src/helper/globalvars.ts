'use strict';

export const access_type_key='access_type';
export const access_type_home='HOME';
export const access_type_doctor='DOCTOR';
export const access_type_clinic='CLINIC';
export const access_type_facility='FACILITY';
export const access_type_booking='BOOKING';
export const access_type_doctor_profile='DOCTOR PROFILE';
export const access_type_assistant_profile='ASSISTANT PROFILE';
export const access_type_admin_profile='ADMIN PROFILE';
export const access_type_doctor_register='DOCTOR REGISTER';
export const access_type_clinic_register='CLINIC REGISTER';
export const access_type_facility_register='FACILITY REGISTER';
//export const access_type_map='MAP';
export const doctor_profile_storage_key="doctorProfile";
export const assistant_profile_storage_key="assistantProfile";
export const admin_profile_storage_key="adminProfile";
export const booking_info_storage_key="bookingInformation";

/*
export const vehicle_type_bus='BUS';
export const vehicle_type_tram='TRAM';
export const vehicle_config_key_ambulance='ambulance_config';
export const vehicle_config_key_bus='bus_config';
export const vehicle_config_key_tram='tram_config';
export const vehicle_detail_map_key = 'facilityType';
export const ambulance_facility_normal='normal';
export const ambulance_facility_contagious = 'contagious';
export const ambulance_facility_life_support = 'life_support';
export const ambulance_facilities=[ambulance_facility_normal,ambulance_facility_contagious,ambulance_facility_life_support];
export const data_source = 'IDEATION';
export const vehicle_call_interval_ambulance=15000;
export const nodal_agencies_storage_key="nodalAgencies";
export const public_transport_storage_key="publicRoutes";

export const public_imei_ambulance = "301020171133110";
export const public_imei_bus = "301020171133111";
export const public_imei_tram = "301020171133112";

export const facility_type_key_normal="A";
export const facility_type_key_contagious = "B";
export const facility_type_key_lifesupport = "C";
export const facility_type_value_normal="normal";
export const facility_type_value_contagious = "contagious";
export const facility_type_value_lifesupport = "lifesupport";
export const EVENT_LISTENER_TYPE_KEYBOARD ="keydown";


export const facility_type_values : Map<string,string> = new Map();
facility_type_values.set(facility_type_key_normal,facility_type_value_normal);
facility_type_values.set(facility_type_key_contagious,facility_type_value_contagious);
facility_type_values.set(facility_type_key_lifesupport,facility_type_value_lifesupport);

export const facility_type_keys_by_value: Map<string,string> = new Map();
facility_type_keys_by_value.set(facility_type_value_normal,facility_type_key_normal);
facility_type_keys_by_value.set(facility_type_value_contagious,facility_type_key_contagious);
facility_type_keys_by_value.set(facility_type_value_lifesupport,facility_type_key_lifesupport);
*/

//uat server in i

// Localhost
//export const WORKING_SERVER = "http://localhost/smarthealth/";

// New Server
export const WORKING_SERVER = "http://139.59.20.250/";

// GoDaddy Server
//export const WORKING_SERVER = "http://hr.ideal-channel.com/smarthealth/";

// Free Server
//export const WORKING_SERVER = "http://smarthealth.epizy.com/";

export const END_POINT_GET_LOGIN_AUTH = WORKING_SERVER + "api/login/loginAuth_doctor.php";
export const END_POINT_GET_DOCTOR_PROFILE = WORKING_SERVER + "api/profile/read_doctor.php";
export const END_POINT_GET_ASSISTANT_PROFILE = WORKING_SERVER + "api/profile/read_assistant.php";
export const END_POINT_GET_ADMIN_PROFILE = WORKING_SERVER + "api/profile/read_admin.php";
export const END_POINT_SEND_DOCTOR_REGISTRATION_DATA = WORKING_SERVER + "api/register/register_doctor.php";
export const END_POINT_SEND_ASSISTANT_REGISTRATION_DATA = WORKING_SERVER + "api/register/register_assistant.php";
export const END_POINT_SEND_ADMIN_REGISTRATION_DATA = WORKING_SERVER + "api/register/register_admin.php";
export const END_POINT_SEND_PROFILE_DATA = WORKING_SERVER + "api/profile/edit_doctor.php";
export const END_POINT_GET_DOCTOR_SEARCH = WORKING_SERVER + "api/search/search_doctor.php";
export const END_POINT_SEND_DOCTOR_GPS = WORKING_SERVER + "api/geolocation/gps_doctor.php";
export const END_POINT_GET_DOCTOR_CLINIC = WORKING_SERVER + "api/booking/getClinic.php";
export const END_POINT_GET_ADMIN_CLINIC = WORKING_SERVER + "api/booking/getAdminClinic.php";
export const END_POINT_GET_ASSISTANT_CLINIC = WORKING_SERVER + "api/booking/getAssistantClinic.php";
export const END_POINT_GET_CLINIC_APPOINTMENTS = WORKING_SERVER + "api/booking/appointment_now.php";
export const END_POINT_SEND_CHANGE_PASSWORD = WORKING_SERVER + "api/profile/change_password.php";

export const END_POINT_SEND_BOOKING_DATA = WORKING_SERVER + "api/booking/booking_backend.php";
export const END_POINT_GET_ALL_BOOKING_DATA = WORKING_SERVER + "api/booking/booking_all.php";
export const END_POINT_GET_BOOKING_NOW_DATA = WORKING_SERVER + "api/booking/booking_now.php";
export const END_POINT_GET_BOOKING_OLD_DATA = WORKING_SERVER + "api/booking/booking_old.php";
export const END_POINT_GET_ALL_SPECIALITIES = WORKING_SERVER + "api/search/getSpeciality.php";
export const END_POINT_GET_ALL_CLINICS = WORKING_SERVER + "api/search/getChamber.php";
export const END_POINT_SEND_CANCEL_BOOKING = WORKING_SERVER + "api/booking/cancel_booking.php";
export const END_POINT_SEND_BOOKING_STATE = WORKING_SERVER + "api/booking/state_booking.php";
