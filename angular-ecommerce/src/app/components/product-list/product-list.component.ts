import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/common/product';
import {ActivatedRoute} from "@angular/router";
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "Books";
  searchMode: boolean = false;

  //properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;

  previousKeyword!: string;

  constructor(private productService: ProductService, private route: ActivatedRoute, private cartService: CartService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
    this.listProducts();
    });
  }

  listProducts() {

    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProducts();
    } else {
      this.handleListProducts();
    }
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //if we have a different keyword than the previous
    //then set the pageNumber to 1

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`theKeyword=${theKeyword}, thePageNumber=${this.thePageNumber}`)

    this.productService.searchProductsPaginate(this.thePageNumber - 1,
                                                       this.thePageSize,
                                                       theKeyword).subscribe(this.processResult());

      }

  handleListProducts(){
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //get the "id" parameter and convert it into a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      //not category id is available ... default to category id = 1
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    //check if we have a different category id than the previous
    //Note: Angular will reuse a component if it is currently being viewed

    //if we have different category id than the previous
    //then we want to reset the page back to 1
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }
    this.previousCategoryId = this.currentCategoryId;
    console.log(`current category id = ${this.currentCategoryId}, page number = ${this.thePageNumber}`);

    //now get the products for the given id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                                       this.thePageSize,
                                                       this.currentCategoryId)
                                                       .subscribe(this.processResult());
  }

  private processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    };
  }

  updatePageSize(value: number) {
    this.thePageSize = value;
    this.thePageNumber = 1;
    this.listProducts();
  }

  addToCart(tempProduct: Product) {
    console.log(`Adding to cart: ${tempProduct.name}, ${tempProduct.unitPrice}`);

    const theCartItem = new CartItem(tempProduct);
    this.cartService.addToCart(theCartItem);
  }
}
