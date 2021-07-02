import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ClientMessage, WebsocketService} from "./websocket.service";
import {Observable} from "rxjs/Rx";
import {Subscription} from "rxjs";
import {RestScanService} from "./rest-scan.service";
import {Video} from "./model";
import {RestVideoService} from "./rest-video.service";
import {RestHelperService} from "./rest-helper.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('target', {static: true}) target: ElementRef;
  private socket: Observable<ClientMessage>;
  private subscription: Subscription;

  videos: Video[] = [];
  currentVideoIndex: number = 0;

  constructor(private websocketService: WebsocketService, private restScan: RestScanService, private restVideo: RestVideoService, private restHelper: RestHelperService) { }

  ngOnInit() {
    this.socket = this.websocketService.subscribe();
    this.subscription = this.socket.subscribe(resp => {
      if (resp.videoID == this.currentVideoID()) {
        if (!resp.play) {
          this.target.nativeElement.pause()
          this.target.nativeElement.currentTime = resp.videoTimestamp
        } else {
          let now = Date.now()
          let wait = now - resp.timestamp
          if (wait > 0)
            window.setTimeout(() => this.target.nativeElement.play(), wait)
          else
            this.target.nativeElement.play()
          this.target.nativeElement.currentTime = resp.videoTimestamp
        }
      }
    });
    this.loadVideos()
  }

  currentVideoID() {
    return this.videos[this.currentVideoIndex].ID
  }

  loadVideos() {
    this.restVideo.getVideos(
      videos => this.videos = videos,
      () => this.loadVideos()
    )
  }

  onPlay(event: Event) {
    event.preventDefault()
    console.log('play')
    console.log(this.target.nativeElement.currentTime)
    this.websocketService.send(new ClientMessage(this.currentVideoID(), true, this.target.nativeElement.currentTime, Date.now() + 100))
  }

  onPause(event: Event) {
    event.preventDefault()
    console.log('pause')
    this.websocketService.send(new ClientMessage(this.currentVideoID(), false, this.target.nativeElement.currentTime, 0))
  }

  scan() {
    this.restScan.execScan(
      videos => this.videos = videos,
      () => this.scan()
    )
  }

  windowHeight() {
    return window.innerHeight
  }

  selectVideo(i: number) {
    this.currentVideoIndex = i
    this.target.nativeElement.load()
  }

  currentVideoURL() {
    return this.restHelper.baseUrl + '/videos?videoID=' + this.currentVideoID();
  }
}
