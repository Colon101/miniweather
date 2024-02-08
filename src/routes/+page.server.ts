import type { PageServerLoad, RequestEvent } from './$types';
import { Reader } from "@maxmind/geoip2-node";
import * as models from "@maxmind/geoip2-node/dist/src/models"
import type { Weather, DaysEntity, ForecastResult } from "./weathertype"
const apikey = "52LZJ673EYPXGCYMMER99RJU6"
interface ipfiy {
    ip: string
}
function incrementDayOfWeek(currentDay: number, incrementBy: number): number {
    // Ensure incrementBy is positive
    incrementBy = Math.abs(incrementBy);

    // Increment the day
    let newDay = currentDay + incrementBy;

    // Handle overflow
    newDay = newDay % 7;

    return newDay;
}
function getDayOfWeek(num: number): ForecastResult["dayName"] {
    switch (num) {
        case 0:
            return "Sunday";
        case 1:
            return "Monday";
        case 2:
            return "Tuesday";
        case 3:
            return "Wednesday";
        case 4:
            return "Thursday";
        case 5:
            return "Friday";
        case 6:
            return "Saturday";
        default:
            return "Invalid day";
    }
}
const getForecast = (days: DaysEntity[]) => {
    let result: ForecastResult[] = []
    const now = new Date();
    const today = now.getDay();

    for (let i = 0; i < 7; i++) {
        if (i == 0) {
            result = [...result, {
                dayName: "Today",
                temp: days[i].temp,
                feelsLike: days[i].feelslike,
                tempmin: days[i].tempmin,
                tempmax: days[i].tempmax,
                condition: days[i].conditions,
                icon: days[i].icon
            }]
        }
        else {
            const nextDayIndex = incrementDayOfWeek(today, i);
            result = [...result, {
                dayName: getDayOfWeek(nextDayIndex),
                temp: days[nextDayIndex].temp, // Assuming days are provided for the next 7 days
                feelsLike: days[nextDayIndex].feelslike,
                tempmin: days[nextDayIndex].tempmin,
                tempmax: days[nextDayIndex].tempmax,
                condition: days[nextDayIndex].conditions,
                icon: days[nextDayIndex].icon
            }]
        }
    }
    return result;
}
export const load: PageServerLoad = (async (event: RequestEvent) => {
    const rawAddress: string = event.getClientAddress();
    let ipAddress: string | null = rawAddress.split(":")[rawAddress.split(":").length - 1];
    let data: models.City;
    try {
        const reader = await Reader.open("/home/kfir/sveltush/src/GeoLite2-City.mmdb")
        if (ipAddress.startsWith("127.0.0")) {
            ipAddress = event.request.headers.get("cf-connecting-ip") || event.request.headers.get("x-forwarded-ip") || null;
        }
        if (!!ipAddress) {
            if (ipAddress.startsWith("192.168")) {
                const response = await fetch("https://api.ipify.org/?format=json") || null;
                const resposnedata: ipfiy = await response.json();
                ipAddress = resposnedata.ip;
            }
            data = reader.city(ipAddress)
            const weatherResponse: Response = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${data.location?.longitude},${data.location?.latitude}?key=${apikey}&unitGroup=metric`)
            const weather: Weather = await weatherResponse.json();
            if (!weather.days) {
                throw Error("weather forcast is undefined");
            }

            return {
                ip: ipAddress,
                city: data.city?.names.en,
                long: data.location?.longitude,
                lat: data.location?.latitude,
                feelsLike: weather.days[0].feelslike,
                weathertype: weather.days[0].conditions,
                temp: weather.days[0].temp,
                forecast: [...getForecast(weather.days)]
            };
        }
        throw new Error("Info was null");
    } catch (error: any) {
        return { ip: error.message }
    }
});