use crate::models::*;
use reqwest;
use serde::Serialize;
use serde_json;
use std::env;
use std::fmt;

#[derive(Debug)]
struct NoAccessTokenError {}

impl fmt::Display for NoAccessTokenError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "Access token is not provided. You need to set MONO_ACCESS_TOKEN in your environment."
        )
    }
}

impl std::error::Error for NoAccessTokenError {}

async fn request(
    method: reqwest::Method,
    path: &str,
) -> Result<reqwest::Response, Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();
    let url = format!("https://mono.neet.love{}", path);

    let Ok(access_token) = env::var("MONO_ACCESS_TOKEN") else {
        return Result::Err(Box::new(NoAccessTokenError {}));
    };

    let builder = client
        .request(method, url)
        .header("Accept", "application/json")
        .header("Authorization", format!("Bearer {}", access_token));

    let res = builder.send().await?.error_for_status()?;

    Result::Ok(res)
}

async fn get<T: Into<reqwest::Body>>(
    path: &str,
) -> Result<reqwest::Response, Box<dyn std::error::Error>> {
    request(reqwest::Method::GET, path).await
}

// async fn post<T: Into<reqwest::Body>>(
//     path: &str,
//     body: Option<T>,
// ) -> Result<reqwest::Response, Box<dyn std::error::Error>> {
//     request(reqwest::Method::POST, path, body).await
// }
//
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

pub async fn list_tasks() -> Result<Vec<Task>, Box<dyn std::error::Error>> {
    let res: Vec<Task> = get::<&str>("/api/v1/tasks").await?.json().await?;
    Result::Ok(res)
}
//
// #[derive(Serialize, Debug)]
// struct CreateTaskParams {
//     title: Option<String>,
//     description: Option<String>,
// }
//
// pub async fn create_task(
//     params: CreateTaskParams,
// ) -> Result<Vec<Task>, Box<dyn std::error::Error>> {
//     let body = serde_json::to_string(&params).unwrap();
//     let res: Vec<Task> = post("/api/v1/tasks", Some(&body)).await?.json().await?;
//     Result::Ok(res)
// }
