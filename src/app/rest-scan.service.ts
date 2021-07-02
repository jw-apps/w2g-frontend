import { Injectable } from '@angular/core';
import {RestHelperService} from "./rest-helper.service";
import {Video} from "./model";

@Injectable({
  providedIn: 'root'
})
export class RestScanService {

  constructor(private rest: RestHelperService) {}

  public execScan(success: (resp: Video[]) => void, reload: () => void) {
    const url = this.rest.baseUrl + '/scan';
    this.rest.get(url, success, reload);
  }
}
