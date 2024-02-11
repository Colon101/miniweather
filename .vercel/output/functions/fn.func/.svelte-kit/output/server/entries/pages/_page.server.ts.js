const apikey = "52LZJ673EYPXGCYMMER99RJU6";
function incrementDayOfWeek(currentDay, incrementBy) {
  incrementBy = Math.abs(incrementBy);
  let newDay = currentDay + incrementBy;
  newDay = newDay % 7;
  return newDay;
}
function getDayOfWeek(num) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  if (num >= 0 && num <= 6) {
    return daysOfWeek[num];
  } else {
    return "Invalid day";
  }
}
const getForecast = (days) => {
  let result = [];
  const now = /* @__PURE__ */ new Date();
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
      }];
    } else {
      const nextDayIndex = incrementDayOfWeek(today, i);
      result = [...result, {
        dayName: getDayOfWeek(nextDayIndex),
        temp: days[nextDayIndex].temp,
        feelsLike: days[nextDayIndex].feelslike,
        tempmin: days[nextDayIndex].tempmin,
        tempmax: days[nextDayIndex].tempmax,
        condition: days[nextDayIndex].conditions,
        icon: days[nextDayIndex].icon
      }];
    }
  }
  return result;
};
const cache = /* @__PURE__ */ new Map();
const CACHE_EXPIRATION_TIME = 5 * 60 * 60 * 1e3;
function cleanCache() {
  const currentTime = Date.now();
  for (const [key, value] of cache.entries()) {
    if (currentTime - value.timestamp > CACHE_EXPIRATION_TIME) {
      cache.delete(key);
    }
  }
}
const load = async (event) => {
  const rawAddress = event.getClientAddress();
  let ipAddress = rawAddress.split(":")[rawAddress.split(":").length - 1];
  let data;
  try {
    if (ipAddress.startsWith("127.0.0")) {
      ipAddress = event.request.headers.get("cf-connecting-ip") || event.request.headers.get("x-forwarded-ip") || null;
      if (ipAddress == null) {
        const response = await fetch("https://api.ipify.org/?format=json") || null;
        const resposnedata = await response.json();
        ipAddress = resposnedata.ip;
      }
    }
    if (!!ipAddress) {
      if (ipAddress.startsWith("192.168")) {
        const response = await fetch("https://api.ipify.org/?format=json") || null;
        const resposnedata = await response.json();
        ipAddress = resposnedata.ip;
      }
      cleanCache();
      if (cache.has(ipAddress)) {
        return cache.get(ipAddress);
      } else {
        let pdata = await fetch(`https://geoip2.kfirgoldman.xyz/${ipAddress}`);
        data = await pdata.json();
        const weatherResponse = await fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${data.location?.longitude},${data.location?.latitude}?key=${apikey}&unitGroup=metric`);
        const weather = await weatherResponse.json();
        if (!weather.days) {
          throw Error("weather forecast is undefined");
        }
        const cachedData = {
          ip: ipAddress,
          city: data.city?.names.en,
          long: data.location?.longitude,
          lat: data.location?.latitude,
          feelsLike: weather.days[0].feelslike,
          weatherType: weather.days[0].conditions,
          temp: weather.days[0].temp,
          forecast: getForecast(weather.days),
          timestamp: Date.now()
        };
        cache.set(ipAddress, cachedData);
        return cachedData;
      }
    }
    throw new Error("Info was null");
  } catch (error) {
    console.log(error);
    console.log(error.message || error.error);
    return { temp: error.message || error.error };
  }
};
export {
  load
};