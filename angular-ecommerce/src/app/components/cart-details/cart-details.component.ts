import { Component, OnInit } from '@angular/core';
import {CartItem} from "../../common/cart-item";
import {CartService} from "../../services/cart.service";

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems: CartItem[] = [];
  totalPrice: number = 0;
  totalQuantity: number = 0;

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }

  listCartDetails(){
    //get a handle to the cart items
    this.cartItems = this.cartService.cartItems;

    //subscribe to cart TotalPrice
    this.cartService.totalPrice.subscribe(
      data => this.totalPrice = data
    );

    //subscribe to cart totalQuantity
    this.cartService.totalQuantity.subscribe(
      data => this.totalQuantity = data
    );

    //compute cart total price and total quantity
    this.cartService.computeCartTotals();
  }

  incrementQuantity(tempCartItem: CartItem) {
    this.cartService.addToCart(tempCartItem);
  }

  reductionQuantity(tempCartItem: CartItem){
    this.cartService.removeFromCart(tempCartItem);
  }

  remove(tempCartItem: CartItem) {
    this.cartService.remove(tempCartItem);
  }
}
