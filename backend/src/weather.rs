use std::fmt::Display;

use actix_web::{get, web, HttpResponse};
use reqwest::Client;
use serde::Deserialize;
use tracing::{debug, error, info, instrument, warn};

const LATITUDE: &str = "25";
const LONGITUDE: &str = "-80";

#[derive(Debug)]
enum WeatherError {
    BadReply(String),
    BadResponse(String),
}

impl Display for WeatherError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            Self::BadReply(err) => write!(f, "Bad reply from the weather service: {err}"),
            Self::BadResponse(err) => {
                write!(f, "Bad response from the weather service: {err}")
            }
        }
    }
}

impl From<reqwest::Error> for WeatherError {
    fn from(err: reqwest::Error) -> Self {
        Self::BadReply(err.to_string())
    }
}

impl std::error::Error for WeatherError {
    fn source(&self) -> Option<&(dyn std::error::Error + 'static)> {
        None
    }
}

impl From<serde_json::Error> for WeatherError {
    fn from(err: serde_json::Error) -> Self {
        Self::BadResponse(err.to_string())
    }
}

#[derive(Debug, Deserialize)]
struct WeatherForecast {
    forecast: String,
}

#[instrument(name = "Get Weather", skip(client), target = "backend", fields(latitude = LATITUDE, longitude = LONGITUDE))]
#[get("/get_weather")]
/// Get the weather forcast based on the latitude and longitude
pub async fn get_weather(client: web::Data<reqwest::Client>) -> HttpResponse {
    warn!("Getting weather");
    let return_val = match lat_weather(client, LATITUDE, LONGITUDE).await {
        Ok(forecast) => forecast.forecast,
        Err(err) => {
            error!("Error getting weather: {}", err);
            String::new()
        }
    };

    info!("Returning: {}", return_val);

    if return_val.is_empty() {
        return HttpResponse::InternalServerError().body("Error getting weather");
    }

    HttpResponse::Ok().body(return_val)
}

#[instrument(name = "Get Weather", skip(client), target = "backend", fields(latitude = LATITUDE, longitude = LONGITUDE))]
async fn lat_weather(
    client: web::Data<reqwest::Client>,
    lat: &str,
    long: &str,
) -> Result<WeatherForecast, WeatherError> {
    let url = format!("https://api.weather.gov/points/{lat},{long}");

    debug!("First API call to the gov weather API");
    let resp = client
        .clone()
        .into_inner()
        .as_ref()
        .get(&url)
        .header("User-Agent", "/0.1.0")
        .header("Accept", "*/*")
        .header("Connection", "keep-alive")
        .header("Host", "api.weather.gov")
        .send()
        .await?;
    let body = resp.text().await?;
    warn!("Body: {}", body);

    let json: serde_json::Value = serde_json::from_str(&body)?;
    if *json.get("status").unwrap_or(&serde_json::Value::from("")) != "" {
        return Err(WeatherError::BadResponse(
            json.get("status")
                .expect("Unable to parse json")
                .to_string(),
        ));
    }

    debug!("Second API call to the gov weather API");
    let key = json
        .get("properties")
        .expect("Unable to parse json")
        .get("cwa")
        .expect("Unable to parse json")
        .to_string();

    info!("key: {}", key);

    let grid_x = json
        .get("properties")
        .expect("Unable to parse json")
        .get("gridX")
        .expect("Unable to parse json")
        .to_string();

    debug!("grid_x: {}", grid_x);

    let grid_y = json
        .get("properties")
        .expect("Unable to parse json")
        .get("gridY")
        .expect("Unable to parse json")
        .to_string();

    debug!("grid_y: {}", grid_y);

    let url = format!(
        "https://api.weather.gov/gridpoints/{}/{grid_x},{grid_y}",
        key.replace('\"', ""),
    );

    warn!("The second URL: {}", url);

    let resp = client
        .into_inner()
        .as_ref()
        .get(url)
        .header("User-Agent", "old_mcdonald/0.1.0")
        .header("Accept", "*/*")
        .header("Connection", "keep-alive")
        .header("Host", "api.weather.gov")
        .send()
        .await
        .unwrap_or_else(|err| {
            warn!("Error getting forecast: {:#?}", err);
            panic!("Error getting forecast: {err:#?}")
        });

    debug!("Second response received");

    let body = resp.text().await?;

    info!("forecast body: {}", body);

    let json: serde_json::Value = serde_json::from_str(&body)?;

    if *json.get("status").unwrap_or(&serde_json::Value::from("")) != "" {
        return Err(WeatherError::BadResponse(
            json.get("status")
                .expect("Unable to parse json")
                .to_string(),
        ));
    }

    info!("forecast data: {:#?}", json);

    let forecast = json
        .get("properties")
        .expect("Unable to parse json")
        .get("temperature")
        .expect("Unable to parse json")
        .get("values")
        .expect("Unable to parse json")
        .to_string();

    Ok(WeatherForecast { forecast })
}
