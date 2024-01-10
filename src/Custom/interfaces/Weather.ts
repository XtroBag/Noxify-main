
  export enum isDaytime {
    Day = 1,
    Night = 0
  }

  export interface WeatherForcastData {
    location: {
      name: string,
      region: string,
      country: string,
      lat: number,
      lon: number,
      tz_id: string,
      localtime: string,
    },
    current: {
      last_updated: string,
      temp_c: number,
      temp_f: number,
      is_day: isDaytime,
      condition: {
        text: string,
        icon: string,
        code: number
      },
      wind_mph: number,
      pressure_in: number,
      precip_in: number,
      humidity: number,
      cloud: number,
      feelslike_f: number,
      vis_miles: number,
      uv: number,
      gust_mph: number
    }
  }