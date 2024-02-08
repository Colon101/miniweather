import type { PageServerLoad, RequestEvent } from './$types';
import { Reader } from "@maxmind/geoip2-node";
import * as models from "@maxmind/geoip2-node/dist/src/models"
import { isNullOrUndefined } from 'util';
import type { Weather, DaysEntity } from "./weathertype"
const apikey = "52LZJ673EYPXGCYMMER99RJU6"
interface ipfiy {
    ip: string
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
                temp: weather.days[0].temp
            };
        }
        throw new Error("Info was null");
    } catch (error: any) {
        return { ip: error.message }
    }
});