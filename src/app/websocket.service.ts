import { Injectable } from '@angular/core';
import { Subject, Observer, Observable } from 'rxjs';
import { map } from "rxjs/operators";

export class ClientMessage {
  constructor(public videoID: number, public play: boolean, public videoTimestamp: number, public timestamp: number) {}
}

@Injectable()
export class WebsocketService {

  private messages: Subject<MessageEvent>;
  private initialized = false;
  private socket: WebSocket;

  constructor() { }

  private initWebsocket() {
    const socket = new WebSocket('wss://w2g-backend.johannes-wirth.de/websocket');
    this.socket = socket;
    const observable = Observable.create(
      (eventObserver: Observer<MessageEvent>) => {
        socket.onmessage = eventObserver.next.bind(eventObserver);
        socket.onerror = eventObserver.error.bind(eventObserver);
        socket.onclose = eventObserver.complete.bind(eventObserver);
        return socket.close.bind(socket);
      }
    );
    const observer = {
      next: (data: Object) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify(data));
        }
      }
    };
    this.messages =  Subject.create(observer, observable);
  }

  public send(message: ClientMessage) {
    let msg = JSON.stringify(message);
    console.log(msg);
    this.socket.send(msg);
  }

  public subscribe(): Observable<ClientMessage> {
    if (!this.initialized) { this.initWebsocket(); }
    return this.messages.pipe(map(ev => JSON.parse(ev.data)))
  }

}
