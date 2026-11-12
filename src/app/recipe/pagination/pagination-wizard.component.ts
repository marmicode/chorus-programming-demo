/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { PaginationEventBusService } from './pagination-event-bus.service';
import { PaginationPreferencesService } from './pagination-preferences.service';
import {
  DEFAULT_INFINITE_SCROLL_BATCH_SIZE,
  DEFAULT_ITEMS_PER_PAGE,
  INFINITE_SCROLL_THRESHOLD_PX,
  ITEMS_PER_PAGE_OPTIONS,
  MAX_ITEMS_PER_PAGE,
  MIN_ITEMS_PER_PAGE,
  WIZARD_FOCUS_DELAY_MS,
  WIZARD_SHAKE_DURATION_MS,
  WIZARD_SUBMIT_DELAY_MS,
  WIZARD_TOTAL_STEPS,
} from './pagination.constants';
import {
  PaginationEventTypes,
  PaginationMode,
  PaginationPreferences,
  WizardStep,
} from './pagination.models';
import { deepClone, log, toNumber } from './pagination.utils';

@Component({
  // NOTE: OnPush broke the wizard, so we use the default change detection.
  selector: 'wm-pagination-wizard',
  imports: [
    FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
  ],
  template: `
    <div class="wizard-backdrop">
      <div class="wizard-card" role="dialog" aria-modal="true">
        <div class="wizard-progress">
          <div class="wizard-progress-bar" [style.width.%]="progress"></div>
        </div>
        <p class="wizard-step-label">
          Step {{ currentStep + 1 }} of {{ totalSteps }}
        </p>

        @switch (currentStep) {
          @case (WizardStep.Welcome) {
            <h2>👋 Welcome to the brand new Recipe Search!</h2>
            <p>
              Before you start discovering recipes, let's personalize how
              recipes are displayed. This will only take a minute.
            </p>
          }
          @case (WizardStep.Mode) {
            <h2>Which kind of pagination do you want?</h2>
            <mat-radio-group
              class="wizard-options"
              [(ngModel)]="model.mode"
              (ngModelChange)="selectMode($event)"
            >
              <mat-radio-button [value]="PaginationMode.Pages">
                <strong>📄 Pages</strong>
                <span class="wizard-hint">
                  Browse recipes page by page with Previous / Next buttons.
                </span>
              </mat-radio-button>
              <mat-radio-button [value]="PaginationMode.InfiniteScroll">
                <strong>♾️ Infinite scroll</strong>
                <span class="wizard-hint">
                  Recipes keep loading as you scroll down.
                </span>
              </mat-radio-button>
            </mat-radio-group>
          }
          @case (WizardStep.ItemsPerPage) {
            <h2>
              @if (isInfinite) {
                How many recipes should we load at a time?
              } @else {
                How many items per page?
              }
            </h2>
            <mat-form-field>
              <mat-label>{{
                isInfinite ? 'Recipes per batch' : 'Items per page'
              }}</mat-label>
              <input
                matInput
                type="text"
                [(ngModel)]="model.itemsPerPage"
                (ngModelChange)="onItemsPerPageChange($event)"
              />
            </mat-form-field>
            @if (errors['itemsPerPage']) {
              <p class="wizard-error">{{ errors['itemsPerPage'] }}</p>
            }
            <div class="wizard-quick-options">
              @for (option of ITEMS_PER_PAGE_OPTIONS; track $index) {
                <button
                  mat-stroked-button
                  type="button"
                  [class.selected]="toNumber(model.itemsPerPage) === option"
                  (click)="selectQuickOption(option)"
                >
                  {{ option }}
                </button>
              }
            </div>
          }
          @case (WizardStep.Advanced) {
            @if (isInfinite) {
              <h2>When should we load more recipes?</h2>
              <mat-form-field>
                <mat-label>Distance from the bottom (px)</mat-label>
                <input
                  matInput
                  type="text"
                  [(ngModel)]="model.scrollThreshold"
                  (ngModelChange)="onScrollThresholdChange($event)"
                />
              </mat-form-field>
              @if (errors['scrollThreshold']) {
                <p class="wizard-error">{{ errors['scrollThreshold'] }}</p>
              }
            } @else {
              <h2>Where should the paginator be displayed?</h2>
              <mat-radio-group
                class="wizard-options"
                [(ngModel)]="model.paginatorPosition"
              >
                <mat-radio-button value="top">⬆️ Top</mat-radio-button>
                <mat-radio-button value="bottom">⬇️ Bottom</mat-radio-button>
                <mat-radio-button value="both">↕️ Both</mat-radio-button>
              </mat-radio-group>
              <mat-checkbox [(ngModel)]="model.showPageNumbers">
                Show page numbers
              </mat-checkbox>
            }
          }
          @case (WizardStep.Summary) {
            <h2>🎉 You're all set!</h2>
            <p>Here is your configuration:</p>
            <pre class="wizard-summary">{{ stringify(model) }}</pre>
            <mat-checkbox [(ngModel)]="model.remember">
              Remember my choice
            </mat-checkbox>
          }
        }

        <div class="wizard-actions">
          @if (currentStep === WizardStep.Welcome) {
            <button mat-button type="button" (click)="skip()">
              Skip, use defaults
            </button>
          } @else {
            <button mat-button type="button" (click)="back()">Back</button>
          }
          <button
            mat-flat-button
            color="primary"
            type="button"
            [disabled]="!canGoNext() || isSubmitting"
            (click)="next()"
          >
            @if (isSubmitting) {
              Saving...
            } @else if (currentStep === WizardStep.Summary) {
              Finish
            } @else if (currentStep === WizardStep.Welcome) {
              Let's get started
            } @else {
              Next
            }
          </button>
        </div>
      </div>
    </div>
  `,
  styles: `
    .wizard-backdrop {
      position: fixed !important;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 99999 !important;
    }

    .wizard-card {
      background: #fff;
      border-radius: 12px;
      padding: 24px 32px;
      width: 520px;
      max-width: calc(100vw - 32px);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    }

    .wizard-progress {
      height: 6px;
      background: #eee;
      border-radius: 3px;
      overflow: hidden;
    }

    .wizard-progress-bar {
      height: 100%;
      background: #380030;
      transition: width 0.3s ease;
    }

    .wizard-step-label {
      color: #999;
      font-size: 12px;
      margin-top: 8px;
    }

    .wizard-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin: 16px 0;
    }

    .wizard-hint {
      display: block;
      color: #777;
      font-size: 13px;
    }

    .wizard-quick-options {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .wizard-quick-options .selected {
      background: #380030 !important;
      color: #fff !important;
    }

    .wizard-error {
      color: #d32f2f;
      margin-top: -12px;
    }

    .wizard-summary {
      background: #f5f5f5;
      padding: 12px;
      border-radius: 6px;
      font-size: 12px;
      max-height: 200px;
      overflow: auto;
    }

    .wizard-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 24px;
    }

    .shake {
      animation: shake 0.5s;
    }

    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-10px); }
      75% { transform: translateX(10px); }
    }
  `,
})
export class PaginationWizardComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  @Input() startStep: WizardStep = WizardStep.Welcome;
  @Input() dismissible = true;
  @Output() completed = new EventEmitter<PaginationPreferences>();
  @Output() dismissed = new EventEmitter<void>();

  /* Expose to the template. */
  WizardStep = WizardStep;
  PaginationMode = PaginationMode;
  ITEMS_PER_PAGE_OPTIONS = ITEMS_PER_PAGE_OPTIONS;
  totalSteps = WIZARD_TOTAL_STEPS;
  toNumber = toNumber;

  currentStep: WizardStep = WizardStep.Welcome;
  stepHistory: WizardStep[] = [];
  model: any = {
    mode: null,
    itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    paginatorPosition: 'bottom',
    showPageNumbers: true,
    scrollThreshold: INFINITE_SCROLL_THRESHOLD_PX,
    remember: true,
  };
  errors: { [key: string]: string | null } = {
    itemsPerPage: null,
    scrollThreshold: null,
  };
  isSubmitting = false;

  private _prefs = inject(PaginationPreferencesService);
  private _eventBus = inject(PaginationEventBusService);
  private _cdr = inject(ChangeDetectorRef);
  private _timeouts: any[] = [];

  ngOnInit() {
    this.currentStep = this.startStep;
    const existing = this._prefs.prefs();
    if (existing) {
      this.model = { ...this.model, ...deepClone(existing) };
    }
    log('wizard initialized', this.model);
  }

  ngAfterViewInit() {
    this._focusFirst();
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy() {
    // TODO: clear timeouts
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.dismissible) {
      this.dismiss();
    }
    if (
      event.key === 'Enter' &&
      (event.target as any)?.tagName !== 'BUTTON'
    ) {
      this.next();
    }
  }

  stringify(value: any) {
    return JSON.stringify(value, null, 2);
  }

  get progress() {
    return Math.round(((this.currentStep + 1) / WIZARD_TOTAL_STEPS) * 100);
  }

  get isInfinite() {
    return (
      this.model.mode === PaginationMode.InfiniteScroll ||
      this.model.mode === 'infinite' ||
      this.model.mode === 'Infinite' ||
      this.model.mode === 'scroll'
    );
  }

  canGoNext(): boolean {
    switch (this.currentStep) {
      case WizardStep.Welcome:
        return true;
      case WizardStep.Mode:
        return !!this.model.mode;
      case WizardStep.ItemsPerPage:
        return !this.errors['itemsPerPage'];
      case WizardStep.Advanced:
        return this.isInfinite ? !this.errors['scrollThreshold'] : true;
      case WizardStep.Summary:
        return true;
      default:
        return false;
    }
  }

  next() {
    if (!this.canGoNext()) {
      this.shake();
      return;
    }

    if (this.currentStep === WizardStep.Summary) {
      this.finish();
      return;
    }

    this.stepHistory.push(this.currentStep);
    this.currentStep = this.currentStep + 1;
    this._eventBus.emit(
      PaginationEventTypes.WIZARD_STEP_CHANGED,
      this.currentStep,
      'PaginationWizardComponent',
    );
    this._timeouts.push(
      setTimeout(() => this._focusFirst(), WIZARD_FOCUS_DELAY_MS),
    );
  }

  back() {
    const previousStep = this.stepHistory.pop();
    if (previousStep !== undefined) {
      this.currentStep = previousStep;
    }
  }

  selectMode(mode: PaginationMode) {
    this.model.mode = mode;
    if (
      mode === PaginationMode.InfiniteScroll &&
      this.model.itemsPerPage === DEFAULT_ITEMS_PER_PAGE
    ) {
      this.model.itemsPerPage = DEFAULT_INFINITE_SCROLL_BATCH_SIZE;
    }
    if (
      mode === PaginationMode.Pages &&
      this.model.itemsPerPage === DEFAULT_INFINITE_SCROLL_BATCH_SIZE
    ) {
      this.model.itemsPerPage = DEFAULT_ITEMS_PER_PAGE;
    }
  }

  selectQuickOption(option: number) {
    this.model.itemsPerPage = option;
    this.onItemsPerPageChange(option);
  }

  onItemsPerPageChange(value: any) {
    if (value === null || value === undefined || value === '') {
      this.errors['itemsPerPage'] = 'This field is required';
      return;
    }
    if (!/^\d+$/.test(String(value).trim())) {
      this.errors['itemsPerPage'] = 'Must be a number';
      return;
    }
    const n = toNumber(value);
    if (n < MIN_ITEMS_PER_PAGE) {
      this.errors['itemsPerPage'] = `Must be at least ${MIN_ITEMS_PER_PAGE}`;
      return;
    }
    if (n > MAX_ITEMS_PER_PAGE) {
      this.errors['itemsPerPage'] = `Must be at most ${MAX_ITEMS_PER_PAGE}`;
      return;
    }
    this.errors['itemsPerPage'] = null;
  }

  onScrollThresholdChange(value: any) {
    if (!/^\d+$/.test(String(value ?? '').trim())) {
      this.errors['scrollThreshold'] = 'Must be a number of pixels';
      return;
    }
    this.errors['scrollThreshold'] = null;
  }

  skip() {
    this.model = {
      ...this.model,
      mode: PaginationMode.Pages,
      itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
    };
    this.finish();
  }

  finish() {
    this.isSubmitting = true;
    const { remember, ...prefs } = this.model;
    this._timeouts.push(
      setTimeout(() => {
        this._prefs.save(
          { ...prefs, itemsPerPage: toNumber(prefs.itemsPerPage) },
          remember,
        );
        this._eventBus.emit(
          PaginationEventTypes.WIZARD_COMPLETED,
          prefs,
          'PaginationWizardComponent',
        );
        this.completed.emit(prefs);
        this.isSubmitting = false;
        /* Otherwise the view doesn't update. */
        this._cdr.detectChanges();
      }, WIZARD_SUBMIT_DELAY_MS),
    );
  }

  dismiss() {
    this._eventBus.emit(
      PaginationEventTypes.WIZARD_DISMISSED,
      null,
      'PaginationWizardComponent',
    );
    this.dismissed.emit();
  }

  shake() {
    const card = document.querySelector('.wizard-card');
    card?.classList.add('shake');
    setTimeout(() => card?.classList.remove('shake'), WIZARD_SHAKE_DURATION_MS);
  }

  private _focusFirst() {
    const element = document.querySelector(
      '.wizard-card input, .wizard-card mat-radio-button input, .wizard-card button',
    ) as HTMLElement | null;
    element?.focus();
  }
}
