/* eslint-disable @typescript-eslint/no-explicit-any */
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PaginationEventBusService } from './pagination-event-bus.service';
import { PaginatorComponent } from './paginator.component';

vi.mock('./pagination.utils', async (importOriginal) => ({
  ...(await importOriginal<any>()),
  log: vi.fn(),
}));

describe('PaginatorComponent', () => {
  let component: PaginatorComponent;

  const mockEventBus = { emit: vi.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PaginatorComponent],
      providers: [{ provide: PaginationEventBusService, useValue: mockEventBus }],
      schemas: [NO_ERRORS_SCHEMA],
    });
    component = TestBed.createComponent(PaginatorComponent).componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should generate pages', () => {
    component.totalPages = 10;
    component.currentPage = 5;
    expect(component.getPages()).toEqual([1, -1, 4, 5, 6, -1, 10]);
  });

  it('should generate all pages when there are few pages', () => {
    component.totalPages = 3;
    component.currentPage = 1;
    expect(component.getPages()).toEqual([1, 2, 3]);
  });

  it('should emit next page event', () => {
    const spy = vi.spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.next();
    expect(mockEventBus.emit).toHaveBeenCalledWith(
      'NEXT_PAGE',
      undefined,
      'PaginatorComponent',
    );
    expect(spy).toHaveBeenCalledWith(2);
  });
});
