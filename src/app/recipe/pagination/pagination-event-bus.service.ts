/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { PaginationEvent } from './pagination.models';
import { log } from './pagination.utils';

/**
 * Central event bus so that pagination components can talk to each other
 * without having to pass inputs and outputs around.
 */
@Injectable({ providedIn: 'root' })
export class PaginationEventBusService {
  private _events = new Subject<PaginationEvent>();

  public events$ = this._events.asObservable();

  /* Keep all events for debugging purposes. */
  public history: PaginationEvent[] = [];

  emit(type: string, payload?: any, source?: string) {
    const event: PaginationEvent = {
      type,
      payload,
      source,
      timestamp: Date.now(),
    };
    this.history.push(event);
    log('event', event);
    this._events.next(event);
  }

  on(type: string): Observable<any> {
    return this.events$.pipe(
      filter((event) => event.type === type),
      map((event) => event.payload),
    );
  }
}
