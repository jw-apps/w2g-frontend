import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {timeout} from "rxjs/operators";
import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class RestHelperService {

  /**
   * @ignore
   */
  public readonly baseUrl = 'https://w2g-backend.johannes-wirth.de';

  /**
   * @ignore
   */
  constructor(private http: HttpClient) {
  }

  /**
   * Get the default headers for a HTTP-Request (including the authentication header with the SSO-ticket)
   * @return the headers to use for any query
   */
  public getHeaders(): HttpHeaders {
    return new HttpHeaders();
  }

  /**
   * Send a GET request with custom error handling
   *
   * @param url the url to send the request to
   * @param success a callback which will be called with the response upon success
   * @param handleError a callback to handle errors during the request
   * @param headers the headers to send with the request
   * @param timeoutValue the time after which a request should be interpreted as timeout (in ms)
   */
  public getCustomError<T>(url: string, success: (resp: T) => void, handleError: (error: any) => void, headers: HttpHeaders = this.getHeaders(), timeoutValue: number = 5000) {
    const response = this.http.get<T>(url, {headers: headers}).pipe(timeout(timeoutValue));
    response.subscribe(res => success(res), error => handleError(error));
  }

  /**
   * Send a GET request
   *
   * @param url the url to send the request to
   * @param success a callback which will be called with the response upon success
   * @param reload a callback which will be called to repeat the query after a failure
   * @param handleFeedback a callback which will be called with feedback from the server on non-critical failure
   * @param headers the headers to send with the request
   */
  public get<T>(url: string, success: (resp: T) => void, reload: () => void, headers: HttpHeaders = this.getHeaders()) {
    const handle = (error: any) => this.handleError(error, reload);
    this.getCustomError(url, success, handle, headers);
  }

  /**
   * Send a PUT request with custom error handling
   *
   * @param url the url to send the request to
   * @param data the payload to send with the request
   * @param success a callback which will be called with the response upon success
   * @param handleError a callback to handle errors during the request
   * @param handleFeedback a callback which will be called with feedback from the server on non-critical failure
   * @param headers the headers to send with the request
   */
  public putCustomError<T, U>(url: string, data: U, success: (resp: T) => void, handleError: (error: any) => void, headers: HttpHeaders = this.getHeaders()) {
    const response = this.http.put<T>(url, data, {headers: headers}).pipe(timeout(5000));
    response.subscribe(res => success(res), error => handleError(error));
  }

  /**
   * Send a GET request with custom error handling
   *
   * @param url the url to send the request to
   * @param data the payload to send with the request
   * @param success a callback which will be called with the response upon success
   * @param reload a callback which will be called to repeat the query after a failure
   * @param handleFeedback a callback which will be called with feedback from the server on non-critical failure
   * @param headers the headers to send with the request
   */
  public put<T, U>(url: string, data: U, success: (resp: T) => void, reload: () => void, headers: HttpHeaders = this.getHeaders()) {
    const handle = (error: any) => this.handleError(error, reload);
    this.putCustomError(url, data, success, handle, headers);
  }

  /**
   * Send a GET request with custom error handling
   *
   * @param url the url to send the request to
   * @param data the payload to send with the request
   * @param success a callback which will be called with the response upon success
   * @param handleError a callback to handle errors during the request
   * @param handleFeedback a callback which will be called with feedback from the server on non-critical failure
   * @param headers the headers to send with the request
   * @param timeoutValue the time after which a request should be interpreted as timeout (in ms)
   */
  public postCustomError<T, U>(url: string, data: U, success: (resp: T) => void, handleError: (error: any) => void, headers: HttpHeaders = this.getHeaders(), timeoutValue: number = 5000) {
    const response = this.http.post<T>(url, data, {headers: headers}).pipe(timeout(timeoutValue));
    response.subscribe(res => success(res), error => handleError(error));
  }

  /**
   * Send a GET request with custom error handling
   *
   * @param url the url to send the request to
   * @param data the payload to send with the request
   * @param success a callback which will be called with the response upon success
   * @param reload a callback which will be called to repeat the query after a failure
   * @param handleFeedback a callback which will be called with feedback from the server on non-critical failure
   * @param headers the headers to send with the request
   */
  public post<T, U>(url: string, data: U, success: (resp: T) => void, reload: () => void, headers: HttpHeaders = this.getHeaders()) {
    const handle = (error: any) => this.handleError(error, reload);
    this.postCustomError(url, data, success, handle, headers);
  }

  /**
   * Send a GET request with custom error handling
   *
   * @param url the url to send the request to
   * @param success a callback which will be called with the response upon success
   * @param handleError a callback to handle errors during the request
   * @param handleFeedback a callback which will be called with feedback from the server on non-critical failure
   * @param headers the headers to send with the request
   */
  public deleteCustomError<T>(url: string, success: (resp: T) => void, handleError: (error: any) => void, headers: HttpHeaders = this.getHeaders()) {
    const response = this.http.delete<T>(url, {headers: headers}).pipe(timeout(5000));
    response.subscribe(res => success(res), error => handleError(error));
  }

  /**
   * Send a GET request with custom error handling
   *
   * @param url the url to send the request to
   * @param success a callback which will be called with the response upon success
   * @param reload a callback which will be called to repeat the query after a failure
   * @param handleFeedback a callback which will be called with feedback from the server on non-critical failure
   * @param headers the headers to send with the request
   */
  public delete<T>(url: string, success: (resp: T) => void, reload: () => void, headers: HttpHeaders = this.getHeaders()) {
    const handle = (error: any) => this.handleError(error, reload);
    this.deleteCustomError(url, success, handle, headers);
  }

  /**
   * Download a file from the given URL
   *
   * @param url the URL to download the file from
   * @param reload a callback which will be called to repeat the query after a failure
   * @param filename the name to save the file with
   * @param success a callback which will be called upon successful download
   */
  public download(url: string, reload: () => void, filename: string, success: () => void) {
    const response = this.http.get(url, {headers: this.getHeaders(), responseType: 'blob'}).pipe(timeout(1000000));
    response.subscribe(res => {
      FileSaver.saveAs(res, filename);
      success();
    }, error => this.handleError(error, reload));
  }

  /**
   * Responds to an error occurred during a request
   *
   * @param error the error returned by the request
   * @param reload this function is called to retry the operation
   */
  public handleError(error: any, reload: () => void) {
    console.log(error);
  }
}
