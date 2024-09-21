use std::fmt::Display;

use actix_web::{
    post,
    web::{self, Json},
    HttpResponse, Responder, ResponseError,
};
use reqwest::Client;
use serde::{Deserialize, Serialize};
use tracing::{debug, error, info, instrument, warn};

#[derive(Debug)]
enum WeatherError {
    BadReply(String),
    BadResponse(String),
}

impl ResponseError for WeatherError {
    fn error_response(&self) -> HttpResponse {
        match self {
            Self::BadReply(_err) => HttpResponse::InternalServerError().into(),
            Self::BadResponse(_err) => HttpResponse::InternalServerError().into(),
        }
    }
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

#[derive(Debug, Deserialize, Serialize)]
struct WeatherForecast {
    forecast: String,
}

#[derive(Debug, Deserialize)]
struct WeatherPosition {
    latitude: f64,
    longitude: f64,
}

#[instrument(name = "Get Weather", skip(client), target = "backend")]
#[post("/get_weather")]
/// Get the weather forcast based on the latitude and longitude
pub async fn get_weather(client: web::Data<Client>, pos: Json<WeatherPosition>) -> HttpResponse {
    info!("Latitude: {}", pos.latitude);
    info!("Longitude: {}", pos.longitude);
    let return_val = match lat_weather(
        client,
        &pos.latitude.to_string(),
        &pos.longitude.to_string(),
    )
    .await
    {
        Ok(forecast) => forecast.forecast,
        Err(err) => {
            error!("Error getting weather: {}", err);
            String::new()
        }
    };

    if return_val.is_empty() {
        return HttpResponse::InternalServerError().body("Error getting weather");
    }

    HttpResponse::Ok().body(return_val)
}

#[instrument(name = "Get Weather", skip(client), target = "backend")]
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

    warn!("The second URL parsed on the first URL: {}", url);

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
            error!("Error getting forecast: {:#?}", err);
            panic!("Error getting forecast: {err:#?}")
        });

    debug!("Second response received");

    let body = resp.text().await?;

    let json: serde_json::Value = serde_json::from_str(&body)?;

    if *json.get("status").unwrap_or(&serde_json::Value::from("")) != "" {
        return Err(WeatherError::BadResponse(
            json.get("status")
                .expect("Unable to parse json")
                .to_string(),
        ));
    }

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

#[derive(Debug, Deserialize)]
struct PrevWeather {
    begin_date: String,
    end_date: String,
}

#[derive(Debug, Serialize, Deserialize)]
struct DaysPrevious {
    days_previous: i64,
}

/// # Result
///   - Returns a `Result` of `String` if successful
/// # Errors
///   - Returns a `WeatherError` if there is an error getting the weather
#[instrument(
    name = "Get Past Weather",
    skip(client, days_previous),
    target = "backend",
    level = "debug"
)]
#[post("/get_past_weather")]
pub async fn previous_weather(
    client: web::Data<reqwest::Client>,
    days_previous: web::Json<DaysPrevious>,
) -> Result<impl Responder, WeatherError> {
    info!(
        "Getting the previous weather for the past: {} days",
        days_previous.days_previous
    );

    // Calculate the previous date based on the number of days from today
    let todays_date = chrono::Local::now().date_naive();
    debug!("Today's date: {todays_date}");
    let begin_date = todays_date - chrono::Duration::days(days_previous.days_previous);
    debug!("Begin date: {begin_date}");

    let dates = PrevWeather {
        begin_date: begin_date.to_string(),
        end_date: todays_date.to_string(),
    };

    let url = format!(
		"https://api.weather.gov/gridpoints/MLB/25,80/forecast?startTime={}T00:00:00-04:00&endTime={}T00:00:00-04:00", dates.begin_date, dates.end_date

    );

    debug!("URL returned by the gov API: {url}");

    let resp = client
        .get(&url)
        .send()
        .await
        .expect("Unable to get the response");
    let body = resp.text().await.expect("Unable to get the body");

    let json: serde_json::Value = serde_json::from_str(&body)?;
    if *json.get("status").unwrap_or(&serde_json::Value::from("")) != "" {
        return Err(WeatherError::BadResponse(
            json.get("status")
                .expect("Unable to parse json")
                .to_string(),
        ));
    }

    let forecast = json
        .get("properties")
        .expect("Unable to parse json")
        .get("temperature")
        .expect("Unable to parse json")
        .get("values")
        .expect("Unable to parse json")
        .to_string();

    let forecast = WeatherForecast { forecast };

    Ok(HttpResponse::Ok().json(forecast))
}
