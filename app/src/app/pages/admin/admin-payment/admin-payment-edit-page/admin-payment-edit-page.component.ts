import {
  AfterViewInit,
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { BasePageComponent } from '../../../base-page/base-page.component';
import { MatDialog } from '@angular/material/dialog';
import { WindowService } from '../../../../services/window.service';
import { PaymentCaptureService } from '../../../../services/payment-capture.service';
import { firstValueFrom } from 'rxjs';
import { viewProfileRoute } from '../../../../routes/routes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ProductType } from '../../../../../../../api/src/types/product-purchase/product-type';
import { PaymentCapture } from '../../../../../../../api/src/types/payment-capture/payment-capture';

interface PaymentEditForm {
  customer_email: FormControl<string>;
  customer_name: FormControl<string>;
  is_unlimited_sails: FormControl<boolean>;
  note: FormControl<string>;
  number_of_guest_sails_included: FormControl<number>;
  number_of_guest_sails_used: FormControl<number>;
  number_of_sails_included: FormControl<number>;
  number_of_sails_used: FormControl<number>;
  product_name: FormControl<string>;
  product_type: FormControl<string>;
  valid_until: FormControl<string>;
}

@Component({
  selector: 'app-admin-payment-edit-page',
  templateUrl: './admin-payment-edit-page.component.html',
  styleUrls: ['./admin-payment-edit-page.component.scss']
})
export class AdminPaymentEditPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public form: FormGroup<PaymentEditForm>;
  public product_types = Object.values(ProductType);
  public payment: PaymentCapture;
  public paymentId: string;
  public viewProfileRoute = viewProfileRoute;

  constructor(
    @Inject(Store) store: Store<any>,
    @Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(MatDialog) dialog: MatDialog,
    @Inject(WindowService) public windowService: WindowService,
    @Inject(PaymentCaptureService) private paymentCaptureService: PaymentCaptureService,
    @Inject(FormBuilder) private fb: FormBuilder,
  ) {
    super(store, route, router, dialog);
  }

  ngOnInit() {
    if (!this.user) {
      return;
    }

    this.paymentId = this.route.snapshot.params.id;

    if (this.paymentId) {
      this.fetchPayment(this.paymentId);
    }

    this.buildForm();

  }

  private async fetchPayment(id: string) {
    this.startLoading();

    this.payment = await firstValueFrom(this.paymentCaptureService.fetchPaymentCapture(id))
      .finally(() => this.finishLoading());

    this.updateForm(this.payment);
  }

  private buildForm() {
    this.form = this.fb.group<PaymentEditForm>({
      customer_email: this.fb.control('', [Validators.required]),
      customer_name: this.fb.control('', [Validators.required]),
      is_unlimited_sails: this.fb.control(false),
      note: this.fb.control('', [Validators.required]),
      number_of_guest_sails_included: this.fb.control(0),
      number_of_sails_included: this.fb.control(0),
      number_of_sails_used: this.fb.control(0),
      number_of_guest_sails_used: this.fb.control(0),
      product_name: this.fb.control('', [Validators.required]),
      product_type: this.fb.control('', [Validators.required]),
      valid_until: this.fb.control(null),
    });
  }

  private updateForm(payment: PaymentCapture): void {
    this.form.patchValue({
      customer_email: payment.customer_email,
      customer_name: payment.customer_name,
      is_unlimited_sails: payment.product_purchase.is_unlimited_sails,
      note: payment.data.note,
      number_of_guest_sails_included: payment.data.number_of_guest_sails_included || 0,
      number_of_guest_sails_used: payment.product_purchase?.number_of_guest_sails_used || 0,
      number_of_sails_included: payment.data.number_of_sails_included || 0,
      number_of_sails_used: payment.product_purchase?.number_of_sails_used || 0,
      product_name: payment.data.product_name,
      product_type: payment.data.product_type,
      valid_until: payment.data.valid_until,
    });
    this.form.updateValueAndValidity();
    this.form.markAsPristine();
  }

  public get shouldEnableSaveButton(): boolean {
    return this.form.valid && this.form.dirty;
  }

  public async saveForm() {
    const formData = this.form.getRawValue();

    const paymentCapture = { ...this.payment } as PaymentCapture;

    paymentCapture.customer_email = formData.customer_email;
    paymentCapture.customer_name = formData.customer_name;
    paymentCapture.product_name = formData.product_name;
    paymentCapture.product_type = formData.product_type as ProductType;

    paymentCapture.data = {
      note: formData.note,
      valid_until: formData.valid_until,
      product_type: formData.product_type,
      product_name: formData.product_name,
      customer_name: formData.customer_name,
      customer_email: formData.customer_email,
      created_by: paymentCapture.data.created_by,
      is_unlimited_sails: formData.is_unlimited_sails,
      number_of_sails_included: formData.number_of_sails_included,
      number_of_guest_sails_included: formData.number_of_guest_sails_included,
    };

    if (paymentCapture.product_purchase) {
      paymentCapture.product_purchase.product_name = formData.product_name;
      paymentCapture.product_purchase.product_type = formData.product_type as ProductType;
      paymentCapture.product_purchase.valid_until = new Date(formData.valid_until);
      paymentCapture.product_purchase.number_of_guest_sails_included = formData.number_of_guest_sails_included;
      paymentCapture.product_purchase.number_of_guest_sails_used = formData.number_of_guest_sails_used;
      paymentCapture.product_purchase.number_of_sails_included = formData.number_of_sails_included;
      paymentCapture.product_purchase.number_of_sails_used = formData.number_of_sails_used;
      paymentCapture.product_purchase.is_unlimited_sails = formData.is_unlimited_sails;
      paymentCapture.product_purchase.note = formData.note;
    }

    delete paymentCapture.profile;

    this.startLoading();

    this.payment = await firstValueFrom(this.paymentCaptureService
      .updatePayment(this.paymentId, paymentCapture))
      .then((data) => {
        this.dispatchMessage('Payment updated.');
        this.updateForm(data);
        return data;
      })
      .catch((error) => {
        this.dispatchError(`Failed to update payment: ${error.message}`);
        return this.payment;
      })
      .finally(() => this.finishLoading());

  }

}
