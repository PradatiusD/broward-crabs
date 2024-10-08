use backend::{settings, startup::Application, telemetry};
use std::io;

#[actix_web::main]
async fn main() -> io::Result<()> {
    dotenv::dotenv().ok();

    let settings = settings::get().expect("Failed to get application settings");

    let subscriber = telemetry::get_subcriber(settings.clone().debug);
    telemetry::init_subscriber(subscriber);

    let application = Application::build(settings, None).await?;

    tracing::event!(target: "backend", tracing::Level::INFO, "Listening on IP http://127.0.0.1/");

    application.run_until_stopped().await?;

    Ok(())
}
