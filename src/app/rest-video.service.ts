import { Injectable } from '@angular/core';
import {RestHelperService} from "./rest-helper.service";
import {Video} from "./model";

@Injectable({
  providedIn: 'root'
})
export class RestVideoService {

  constructor(private rest: RestHelperService) {}

  public getVideos(success: (resp: Video[]) => void, reload: () => void) {
    const url = this.rest.baseUrl + '/videos';
    this.rest.get(url, success, reload);
  }
}
