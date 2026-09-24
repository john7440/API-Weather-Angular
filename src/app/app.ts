import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DailySummary, WeatherService } from './weather.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  cities: string[] = ['Saint-Geours-de-Maremne', 'Mérignac', 'Toulouse'];
  selectedCity = '';

  dailySummary = signal<DailySummary[]>([]);
  loading = signal(false);
  errorMessage = signal('');

  constructor(private readonly weatherService: WeatherService) {}

  onCityChange(city: string): void {
    this.selectedCity = city;
    this.dailySummary.set([]);
    this.errorMessage.set('');

    if (!city) {
      return;
    }

    this.loading.set(true);

    this.weatherService.getForecast(city).subscribe({
      next: (forecast) => {
        this.dailySummary.set(this.weatherService.extractDailyMinMax(forecast));
        this.loading.set(false);
      },
      error: (err) => {
        console.error(`Failed to fetch forecast for ${city}`, err);
        this.errorMessage.set(`Prévisions indisponibles pour ${city}`);
        this.loading.set(false);
      },
    });
  }
}