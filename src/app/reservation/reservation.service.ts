import { Injectable } from '@angular/core';
import { Reservation } from '../models/reservation';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  private reservations: Reservation[] = [];

  constructor() {
    this.loadReservationsFromLocalStorage();
  }
  
  getReservations(): Reservation[] {
    return this.reservations;
  }

  getReservation(id: string): Reservation | undefined {
    return this.reservations.find((reservation) => reservation.id === id);
  }

  addReservation(reservation: Reservation): void {
    this.reservations.push(reservation);
    this.saveReservationsToLocalStorage();
  }

  deleteReservation(id: string): void {
    let index = this.reservations.findIndex(
      (reservation) => reservation.id === id
    );
    this.reservations.splice(index, 1);
    this.saveReservationsToLocalStorage();
  }

  updateReservation(updatedReservation: Reservation): void {
    let index = this.reservations.findIndex(
      (reservation) => reservation.id === updatedReservation.id
    );
    if (index !== -1) {
      this.reservations[index] = updatedReservation;
      this.saveReservationsToLocalStorage();
    }
  }

  saveReservationsToLocalStorage(): void {
    localStorage.setItem('reservations', JSON.stringify(this.reservations));
  }

  loadReservationsFromLocalStorage(): void {
    const reservations = localStorage.getItem('reservations');
    if (reservations) {
      this.reservations = JSON.parse(reservations);
    }
  }
}
