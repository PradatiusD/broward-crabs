use std::fs::File;

use actix_web::{post, web::Json, HttpResponse, Responder};
use openai_api_rs::v1::{
    api::OpenAIClient,
    chat_completion::{self, ChatCompletionRequest},
    common::GPT3_5_TURBO,
};
use tracing::{error, info, instrument};

use crate::settings::OpenAI;

#[derive(serde::Deserialize, Debug)]
struct ChatRequest {
    question: String,
}

#[instrument(name = "ai_chat", level = "info", target = "backend", fields(question = %ai_question.question))]
#[post("/ai")]
pub async fn ai(ai_question: Json<ChatRequest>) -> impl Responder {
    let settings = File::open("settings/env.yaml").expect("Could not open settings file");
    let settings: OpenAI = serde_yaml::from_reader(settings).expect("Could not read settings file");

    let openai_key = settings.api_key;

    // Get the 'open_ai_key' from the .env.yaml file directly
    let client = OpenAIClient::new(openai_key);
    info!("Creating Chat request");
    let req = ChatCompletionRequest::new(
        GPT3_5_TURBO.to_string(),
        vec![chat_completion::ChatCompletionMessage {
            role: chat_completion::MessageRole::user,
            content: chat_completion::Content::Text(ai_question.question.clone()),
            name: Some(String::from("FloodFlow")),
            tool_calls: None,
            tool_call_id: None,
        }],
    );

    let resp = match client.chat_completion(req).await {
        Ok(resp) => resp,
        Err(e) => {
            error!("ChatCompletion: {}", e);
            return HttpResponse::InternalServerError().finish();
        }
    };

    HttpResponse::Ok().json(
        resp.choices[0]
            .message
            .content
            .clone()
            .expect("No text to return"),
    )
}
