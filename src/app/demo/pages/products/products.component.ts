import { Component } from '@angular/core';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { Product } from 'src/app/core/models/interface/Product';
import { ProductService } from 'src/app/core/services/product/product.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RequestParams } from 'src/app/core/models/generic/Request';
import { catchError, finalize, Observable } from 'rxjs';
import { Response } from 'src/app/core/models/generic/Response';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CardComponent,
    NzTableModule
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  products = []
  constructor(
    private productService: ProductService,
    private nzMessageService: NzMessageService
  ){
  }

  ngOnInit(){
    this.getProductsFiltered()
  }

  getProductsFiltered(){
    // const param: RequestParams = {
    // }
    // const id = this.nzMessageService.loading("Loading", {nzDuration: 0}).messageId
    // this.productService.getFilterProduct(param).pipe(
    //   finalize(() => {
    //     this.nzMessageService.remove(id)
    //   }),
    //   catchError(() => {
    //     this.nzMessageService.error("Error")
    //     return new Observable<Response<Product>>
    //   })
    // ).subscribe({
    //   next: (response: Response<Product>) => {
    //     this.products = response.products as Product
    //     this.nzMessageService.success(Constants.UPDATED_MSG)
    //     this.onSubmited.emit(this.product)
    //   }
    // })
  }
}
