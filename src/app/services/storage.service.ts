import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class StorageService {


  /**
   *
   * @param string item
   */
  public SetItem(item : string) : void {
    localStorage.setItem(item, item)
  }


  /**
   *
   * @param string key
   */
  getItem(key: string) : string {
    return localStorage.getItem(key) || '';
  }

  clearAll() {

  }

}
