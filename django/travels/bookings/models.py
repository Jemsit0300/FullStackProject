from django.db import models
from django.contrib.auth.models import User

class Bus(models.Model):
    bus_name = models.CharField(max_length=100)
    number = models.CharField(max_length=50, unique=True)
    origin = models.CharField(max_length=100)
    destination = models.CharField(max_length=100)
    features = models.TextField()
    starting_time = models.TimeField()
    reach_time = models.TimeField()
    no_of_seats = models.IntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2)

    def __str__(self):
        return f"{self.bus_name} ({self.number}) → {self.destination}"


class Seat(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='seats')
    seat_number = models.CharField(max_length=10)
    is_booked = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.bus.bus_name} - Seat {self.seat_number}"
    

class Booking(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings')
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE, related_name='bookings')
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE, related_name='bookings')
    booking_time = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Booking by {self.user.username}-{self.bus.bus_name}-{self.bus.starting_time}-{self.bus.reach_time}-{self.seat.seat_number}"