import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { of } from 'rxjs';
import {Country} from "../common/country";
import {State} from "../common/state";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  private countriesURL = environment.shopApiUrl + "/countries";
  private statesURL = environment.shopApiUrl + "/states";

  constructor(private httpClient: HttpClient) { }

  getStates(theCountryCode: string): Observable<State[]>{
    const searchURL = `${this.statesURL}/search/findByCountryCode?code=${theCountryCode}`;

    return this.httpClient.get<GetResponseStates>(searchURL).pipe(
      map(response => response._embedded.states)
    );
  }

  getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesURL).pipe(
      map(response => response._embedded.countries)
    );
  }

  getCreditCardMonths(startMonth: number): Observable<number[]>{

    let data: number[] = [];
    //build an array for "Month" dropdown list
    //-start at desired startMonth and loop until 12

    for(let theMonth = startMonth; theMonth <= 12; theMonth++){
      data.push(theMonth);
    }
    return of(data);
  }

  getCreditCardYears(): Observable<number[]>{

    let data: number[] = [];
    //build an array for "Year" dropdown list
    //-start at current year and loop for next 10

    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;

    for(let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }

    return of(data);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  }
}

interface GetResponseStates {
  _embedded:{
    states: State[];
  }
}
