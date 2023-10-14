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
import { firstValueFrom, takeWhile } from 'rxjs';
import { viewAdminPaymentRoute } from '../../../../routes/routes';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ManualCredit } from '../../../../../../../api/src/types/payment-capture/manual-credit';
import {
  ProductType,
  product_names,
  product_types,
  product_type_name
} from '../../../../../../../api/src/types/product-purchase/product-type';

type ManualCreditForm = Record<keyof ManualCredit, FormControl>;

@Component({
  selector: 'app-admin-payment-manual-page',
  templateUrl: './admin-payment-manual-page.component.html',
  styleUrls: ['./admin-payment-manual-page.component.scss']
})
export class AdminPaymentManualPageComponent extends BasePageComponent implements OnInit, AfterViewInit {
  public form: FormGroup<ManualCreditForm>;
  public product_types = product_types;
  public product_names = product_names;
  public product_type_name = product_type_name;

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

    this.buildForm();
  }

  public get invalidFields(): string {
    return Object
      .entries(this.form.controls).filter(value => !value[1].valid)
      .map(value => value[0])
      .map(value => value.replace('_', ' '))
      .join(', ');
  }

  private buildForm() {
    const date = new Date();

    this.form = this.fb.group<ManualCreditForm>({
      customer_email: this.fb.control(this.route.snapshot.queryParams.customer_email || '', [Validators.required]),
      customer_name: this.fb.control(this.route.snapshot.queryParams.customer_name || '', [Validators.required]),
      is_unlimited_sails: this.fb.control(false),
      note: this.fb.control('', [Validators.required]),
      number_of_guest_sails_included: this.fb.control(0),
      number_of_sails_included: this.fb.control(0),
      product_type: this.fb.control(ProductType.SINGLE_SAIL, [Validators.required]),
      product_name: this.fb.control(this.product_type_name[ProductType.SINGLE_SAIL], [Validators.required]),
      valid_until: this.fb.control(`${date.getFullYear()}-12-30`),
    });

    this.form.controls.product_type.valueChanges.pipe(takeWhile(() => this.active)).subscribe((change) => {
      this.form.controls.product_name.patchValue(this.product_type_name[change] || '');
    });
  }

  public get shouldEnableSaveButton(): boolean {
    return this.form.valid && this.form.dirty;
  }

  public async saveManualCredit() {
    const manualCredit = this.form.getRawValue();

    this.startLoading();
    const result = await firstValueFrom(this.paymentCaptureService.createManualCredit(manualCredit))
      .then((data) => {
        this.dispatchMessage('Manual credit created');
        return data;
      })
      .catch((error) => {
        this.dispatchError(`Failed to create manual credit: ${error.message}`);
      })
      .finally(() => this.finishLoading());

    if (result) {
      this.goTo([viewAdminPaymentRoute(result.id)]);
    }
  }

}
