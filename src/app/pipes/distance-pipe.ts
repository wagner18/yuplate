import { Pipe } from '@angular/core';


@Pipe({
	name: 'distancePipe'
})
export class DistancePipe {
	transform(data, format){

    if(format == "miles"){
      let distance: number = Number(Number(data / 1.6).toPrecision(2));

      if(distance < 1){
        let dist = Number(distance * 1000).toPrecision(2);
        dist = dist + " feet";
        return dist;
      }else{
        let dist = distance + " miles";
        return dist;
      }
      
    }

	}
}