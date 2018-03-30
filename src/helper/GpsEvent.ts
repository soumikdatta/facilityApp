'use strict';
export class GPSEvent {
    public user_id:string;
    public timestamp:string;
    public latitude:number;
    public longitude:number;

    public constructor(user_id:string,timestamp:string,latitude:number, longitude:number){
            this.user_id=user_id;
            this.timestamp=timestamp;
            this.latitude=latitude;
            this.longitude=longitude;
    }
    
}