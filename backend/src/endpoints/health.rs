use actix_web::{get, HttpResponse, Responder};
use tracing::{info, instrument};

#[instrument(name = "Health Check", target = "backend")]
#[get("/")]
pub async fn health_check() -> impl Responder {
    info!("Request received for health check");
    HttpResponse::Ok().json("I'm alive!")
}
