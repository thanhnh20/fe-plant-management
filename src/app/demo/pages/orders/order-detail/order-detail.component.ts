import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { catchError, finalize, Observable } from 'rxjs';
import { Response } from 'src/app/core/models/generic/Response';
import { Order, OrderDetail } from 'src/app/core/models/interface/Order';
import { DashboardService } from 'src/app/core/services/dashboard/dashboard.service';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [
    NzButtonModule,
    NzDatePickerModule,
    NzDrawerModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    CommonModule,
    NzBadgeModule,
    NzDescriptionsModule,
    NzDividerModule,
    NzTableModule
  ],
  templateUrl: './order-detail.component.html',
  styleUrl: './order-detail.component.scss'
})
export class OrderDetailComponent {
  title: string
  orderDetail: OrderDetail

  @Input() orderId!: string
  @Input() visible!: boolean
  @Output() onClose = new EventEmitter<boolean>

  constructor(
    private dashboardService: DashboardService,
    private nzMessageService: NzMessageService
  ) {
    this.title = "";
    this.orderDetail = {
      status: "pending",
      id: 60,
      user_id: 19,
      user_name: "Nguyen Hai",
      user_phone: "0703363605",
      total_price: 85000.00,
      order_date: "2024-11-04T18:44:20.000Z",
      callback: "",
      shipping_fee: 25000,
      voucher_code: "",
      discount_amount: 0,
      note: "",
      shipping_address: "91/3",
      payment_method: "COD",
      createdAt: "2024-11-04T18:44:20.000Z",
      updatedAt: "2024-11-04T18:44:20.000Z",
      products: [
      ]
    }
  }

  ngOnChanges() {
    if(this.orderId != ""){
      this.title = `Đơn hàng #${this.orderId}`
      this.getOrderDetail(this.orderId)
    }
  }

  ngOnInit() {

  }

  getOrderDetail(orderId: string) {
    const id = this.nzMessageService.loading("Loading", { nzDuration: 0, }).messageId
    this.dashboardService.getOrderDetail(orderId).pipe(
      finalize(() => {
        this.nzMessageService.remove(id)
      }),
      catchError(() => {
        this.nzMessageService.error("Error")
        return new Observable<Response<OrderDetail>>
      })
    ).subscribe({
      next: (response: Response<OrderDetail>) => {
        this.orderDetail = response.data as OrderDetail
      }
    })
  }

  close() {
    this.orderId = ""
    this.onClose.emit()
  }
}


