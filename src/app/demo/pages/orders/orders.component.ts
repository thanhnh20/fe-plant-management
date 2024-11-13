import { Component } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzTableModule } from 'ng-zorro-antd/table';
import { CardComponent } from 'src/app/theme/shared/components/card/card.component';
import { EditProductComponent } from '../products/edit-product/edit-product.component';
import { Order } from 'src/app/core/models/interface/Order';
import { NzSizeDSType } from 'ng-zorro-antd/core/types';
import { Pageable } from 'src/app/core/models/interface/Page';
import { NzMessageService } from 'ng-zorro-antd/message';
import { OrderService } from 'src/app/core/services/order/order.service';
import { RequestParams } from 'src/app/core/models/generic/Request';
import { catchError, finalize, Observable } from 'rxjs';
import { PaginationResponse, Response } from 'src/app/core/models/generic/Response';
import { NzInputModule } from 'ng-zorro-antd/input';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    NzButtonModule,
    CardComponent,
    NzTableModule,
    NzIconModule,
    NzPaginationModule,
    EditProductComponent,
    NzInputModule,
    CommonModule,
    FormsModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
  orders: Order[]
  pageable: Pageable
  pageSizeOption: number[] = [10, 20]
  nzSize: NzSizeDSType = "default";
  status: boolean = false;
  statusSearch: string[] = [];
  orderId: string = ""

  constructor(
    private orderService: OrderService,
    private nzMessageService: NzMessageService
  ) {
    this.orders = []
    this.pageable = {
      page: 1,
      size: 10,
      totalElements: 0,
      totalPages: 0
    }
  }

  ngOnInit(){
    this.getFilterOrders()
  }

  onPageIndexChange(pageChange: number) {
    this.pageable.page = pageChange;
    this.getFilterOrders()
  }

  onPageSizeChange(pageSize: number) {
    this.pageable.size = pageSize;
    this.getFilterOrders()
  }

  getFilterOrders(){
    const param: RequestParams = {
      orderId: this.orderId,
      listStatus: this.statusSearch.toString(),
      page: this.pageable.page,
      size: this.pageable.size,
    }
    const id = this.nzMessageService.loading("Loading", { nzDuration: 0, }).messageId
    this.orderService.getFilterOrders(param).pipe(
      finalize(() => {
        this.nzMessageService.remove(id)
      }),
      catchError(() => {
        this.nzMessageService.error("Error")
        return new Observable<Response<Order>>
      })
    ).subscribe({
      next: (response: Response<Order>) => {
        const pageResponse: PaginationResponse<Order> = response.data as PaginationResponse<Order>
        this.orders = pageResponse.content
        this.pageable.totalElements = pageResponse.pagination.totalElements
        this.pageable.totalPages = pageResponse.pagination.totalPages
      }
    })
  }

  cancelOrder(orderId: number){
    let status = "cancelled"
    this.updateStatusOrder(status, orderId)
  }

  approveOrder(orderId: number){
    let status = "shipping"
    this.updateStatusOrder(status, orderId)
  }

  deliveryOrder(orderId: number){
    let status = "delivered";
    this.updateStatusOrder(status, orderId)
  }

  updateStatusOrder(status: string, orderId: number){
    const id = this.nzMessageService.loading("Loading", { nzDuration: 0, }).messageId
    this.orderService.updateStatusOrder(status, orderId).pipe(
      finalize(() => {
        this.nzMessageService.remove(id)
      }),
      catchError(() => {
        this.nzMessageService.error("Error")
        return new Observable<Response<Order>>
      })
    ).subscribe({
      next: () => {
        this.getFilterOrders()
      }
    })
  }

  onSearchStatus(value: string){
    if(this.statusSearch.some(item => item == value)){
      this.statusSearch = this.statusSearch.filter(item => item != value)
    }else{
      this.statusSearch.push(value)
    }
    this.getFilterOrders()
  }

  onSearchOrder(){
    this.getFilterOrders()
  }

  onAction(value: string, orderId: number){
    switch(value){
      case 'pending': {
        this.approveOrder(orderId);
        break;
      }
      case 'shipping': {
        this.deliveryOrder(orderId);
        break;
      }
      case 'cancelled': {
        this.cancelOrder(orderId);
        break;
      }
    }
  }
}
