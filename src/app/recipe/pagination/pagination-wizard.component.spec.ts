/* eslint-disable @typescript-eslint/no-explicit-any */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PaginationEventBusService } from './pagination-event-bus.service';
import { PaginationPreferencesService } from './pagination-preferences.service';
import { PaginationWizardComponent } from './pagination-wizard.component';

describe('PaginationWizardComponent', () => {
  let component: PaginationWizardComponent;
  let fixture: ComponentFixture<PaginationWizardComponent>;

  const mockPrefsService = {
    prefs: vi.fn().mockReturnValue(null),
    save: vi.fn(),
    reset: vi.fn(),
    mode: vi.fn().mockReturnValue('pages'),
    itemsPerPage: vi.fn().mockReturnValue(5),
    hasCompletedWizard: vi.fn().mockReturnValue(false),
  };

  const mockEventBus = {
    emit: vi.fn(),
    on: vi.fn().mockReturnValue(of()),
    events$: of(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationWizardComponent],
      providers: [
        { provide: PaginationPreferencesService, useValue: mockPrefsService },
        { provide: PaginationEventBusService, useValue: mockEventBus },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    })
      /* The template is too complex to render in tests. */
      .overrideComponent(PaginationWizardComponent, {
        set: { template: '<div></div>', imports: [] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(PaginationWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should go to next step', () => {
    component.next();
    expect(component.currentStep).toBe(1);
    expect(mockEventBus.emit).toHaveBeenCalled();
  });

  it('should not go to next step if mode is not selected', () => {
    component.currentStep = 1;
    component.model.mode = null;
    component.next();
    expect(component.currentStep).toBe(1);
  });

  it('should set items per page to 10 when infinite scroll is selected', () => {
    component.selectMode('infinite' as any);
    expect(component.model.itemsPerPage).toBe(10);
  });

  it('should validate items per page', () => {
    component.onItemsPerPageChange('abc');
    expect(component.errors['itemsPerPage']).toBeTruthy();

    component.onItemsPerPageChange(999999);
    expect((component as any).errors.itemsPerPage).toBe('Must be at most 100');

    component.onItemsPerPageChange(42);
    expect((component as any).errors.itemsPerPage).toBeNull();
  });

  it('should save preferences on finish', () => {
    vi.useFakeTimers();
    component.model = { mode: 'infinite', itemsPerPage: '42', remember: true };

    component.finish();
    vi.advanceTimersByTime(300);

    expect(mockPrefsService.save).toHaveBeenCalledWith(
      { mode: 'infinite', itemsPerPage: 42 },
      true,
    );
    expect(mockEventBus.emit).toHaveBeenCalledWith(
      'WIZARD_COMPLETED',
      expect.anything(),
      expect.anything(),
    );
    vi.useRealTimers();
  });
});
