import { Injectable } from "@angular/core";
 
@Injectable()
export class ServerApi{

    public HOST: string = 'http://10.0.0.148:3000/';
    public API: string = 'api/';
    public URL = this.HOST + this.API;

}