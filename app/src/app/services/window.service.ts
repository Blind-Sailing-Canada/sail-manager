import { Injectable } from '@angular/core';

export enum WINDOW_WIDTH {
  SMALL,
  MEDIUM,
  LARGE,
}

@Injectable({
  providedIn: 'root'
})
export class WindowService {

  constructor() { }

  public get width(): WINDOW_WIDTH {
    if (window.innerWidth > 1000) {
      return WINDOW_WIDTH.LARGE;
    }

    if (window.innerWidth > 500) {
      return WINDOW_WIDTH.MEDIUM;
    }

    return WINDOW_WIDTH.SMALL;
  }

  public get isSmallWidth(): boolean {
    return this.width === WINDOW_WIDTH.SMALL;
  }

  public get isMediumWidth(): boolean {
    return this.width === WINDOW_WIDTH.MEDIUM;
  }

  public get isLargeWidth(): boolean {
    return this.width === WINDOW_WIDTH.LARGE;
  }

}
