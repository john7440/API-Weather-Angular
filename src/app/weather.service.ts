import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface ForecastItem {
  dt_txt: string;
  main: { temp: number };
}

export interface ForecastResponse {
  list: ForecastItem[];
}

export interface DailySummary {
  date: string;
  min: number;
  max: number;
}

const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

@Injectable({ providedIn: 'root' })
export class WeatherService {
  constructor(private readonly http: HttpClient) {}

  getForecast(city: string): Observable<ForecastResponse> {
    const params = {
      q: `${city},fr`,
      appid: environment.weatherApiKey,
      units: 'metric',
    };
    return this.http.get<ForecastResponse>(FORECAST_URL, { params });
  }


  extractDailyMinMax(forecast: ForecastResponse): DailySummary[] {
    const dailyTemps = new Map<string, number[]>();

    for (const item of forecast.list ?? []) {
      const dateStr = item.dt_txt.split(' ')[0];
      const temp = item.main.temp;

      if (!dailyTemps.has(dateStr)) {
        dailyTemps.set(dateStr, []);
      }
      dailyTemps.get(dateStr)!.push(temp);
    }

    return Array.from(dailyTemps.entries()).map(([date, temps]) => ({
      date,min: Math.min(...temps),max: Math.max(...temps)}));
  }
}