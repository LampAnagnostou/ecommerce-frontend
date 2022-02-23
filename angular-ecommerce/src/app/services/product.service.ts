import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Product } from '../common/product';
import { ProductCategory } from "../common/product-category";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.shopApiUrl + '/products';
  private categoryUrl = environment.shopApiUrl + '/product-category'
  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryId: number): Observable<Product[]>{

    const searchUrl=`${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);
  }

  getProductCategories(): Observable<ProductCategory[]>{
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }

  searchProducts(theKeyword: string): Observable<Product[]>{

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }

  private getProducts(searchUrl: string){
    return this.httpClient.get<GetResponseProducts>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProduct(theProductId: number): Observable<Product>{
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);
  }

  getProductListPaginate(thePage: number, thePageSize: number, theCategoryId: number): Observable<GetResponseProducts>{
    // need to build URL based on category id, page and size
    const url = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}&page=${thePage}&size=${thePageSize}`
    return this.httpClient.get<GetResponseProducts>(url);
  }

  searchProductsPaginate(thePage: number, thePageSize: number, theKeyword: string): Observable<GetResponseProducts>{
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}&page=${thePage}&size=${thePageSize}`;
    return this.httpClient.get<GetResponseProducts>(searchUrl);
  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[]
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory{
    _embedded:{
      productCategory: ProductCategory[];
    }
}

