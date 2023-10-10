import type { ChatCompletionCreateParams } from "openai/resources/chat/completions";

async function get_current_weather(cityName: string) {
  const baseURL = "https://api.openweathermap.org/data/2.5/weather";

  const queryString = `?q=${encodeURIComponent(
    cityName
  )}&appid=${encodeURIComponent(
    process.env.OPENWEATHERMAP_APP_ID as string
  )}&units=metric&lang=ja`;

  try {
    const response = await fetch(baseURL + queryString, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return "Network response was not ok";
    }

    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

async function get_country_info(country_code: string) {
  const response = await fetch(
    `https://restcountries.com/v3.1/alpha/${country_code}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();

  return data[0];
}

export async function runFunction(name: string, args: any) {
  switch (name) {
    case "get_current_weather":
      return await get_current_weather(args["city_name"]);
    case "get_country_info":
      return await get_country_info(args["country_code"]);
    default:
      return null;
  }
}

export const functions: ChatCompletionCreateParams.Function[] = [
  {
    name: "get_current_weather",
    description:
      "Learn about the current weather in your country or region from OpenWeatherMap",
    parameters: {
      type: "object",
      properties: {
        city_name: {
          type: "string",
          description: "Specify city name in English",
        },
      },
      required: ["city_name"],
    },
  },
  {
    name: "get_country_info",
    description: "Get country information from the REST Countries API",
    parameters: {
      type: "object",
      properties: {
        country_code: {
          type: "string",
          description: "cca2, ccn3, cca3 or cioc country code",
        },
      },
      required: ["country_code"],
    },
  },
];
