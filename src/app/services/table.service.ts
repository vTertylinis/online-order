import { Injectable } from '@angular/core';

const SESSION_KEY = 'dinein-table';

@Injectable({ providedIn: 'root' })
export class TableService {
  private _tableNumber: string | null = null;

  constructor() {
    try {
      this._tableNumber = sessionStorage.getItem(SESSION_KEY);
    } catch {
      // sessionStorage unavailable (e.g. private browsing with strict settings)
    }
  }

  get tableNumber(): string | null {
    return this._tableNumber;
  }

  setTable(table: string): void {
    this._tableNumber = table;
    try {
      sessionStorage.setItem(SESSION_KEY, table);
    } catch {
      // ignore storage errors
    }
  }

  clearTable(): void {
    this._tableNumber = null;
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {}
  }
}
