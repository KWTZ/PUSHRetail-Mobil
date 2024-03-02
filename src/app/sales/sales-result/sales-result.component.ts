import { Component, OnInit } from '@angular/core';
import { Line } from '../../productLine';
import { Products } from '../../products';


@Component({
  selector: 'app-sales-result',
  templateUrl: './sales-result.component.html',
  styleUrls: ['./sales-result.component.css']
})
export class SalesResultComponent implements OnInit {

  productline = Line;
  productList = Products;
  filteredProductList=Products;

  selectedLine;
  constructor() { }

  ngOnInit(): void {
    this.productline.sort();
    this.productList.sort();
  }

  filterProductLine() {
      this.filteredProductList=this.productList.filter(e => e.line==this.selectedLine)
  }

}


