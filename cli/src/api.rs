use crate::models::*;
use reqwest;
use reqwest::header::{AUTHORIZATION, CONTENT_TYPE};
use serde::Serialize;

#[derive(Serialize, Debug)]
pub struct ListTasksParams {
    pub status: Option<String>,
}

#[derive(Serialize, Debug)]
pub struct CreateTaskParams {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
}

pub struct ApiClient {
    base_url: String,
    client: reqwest::Client,
}

impl ApiClient {
    pub fn new(base_url: &str, access_token: Option<&str>) -> Result<ApiClient, reqwest::Error> {
        let mut headers = reqwest::header::HeaderMap::new();

        headers.insert(CONTENT_TYPE, "application/json".parse().unwrap());

        if let Some(access_token) = access_token {
            headers.insert(
                AUTHORIZATION,
                format!("Bearer {}", access_token).parse().unwrap(),
            );
        }

        let client = reqwest::Client::builder()
            .default_headers(headers)
            .build()?;

        return Ok(ApiClient {
            base_url: base_url.to_string(),
            client,
        });
    }

    pub async fn list_tasks(&self, params: &ListTasksParams) -> Result<Vec<Task>, reqwest::Error> {
        self.client
            .get(format!("{}/api/v1/tasks", self.base_url))
            .query(params)
            .send()
            .await?
            .json::<Vec<Task>>()
            .await
    }

    pub async fn show_task(&self, id: &str) -> Result<Task, reqwest::Error> {
        self.client
            .get(format!("{}/api/v1/tasks/{}", self.base_url, id))
            .send()
            .await?
            .json::<Task>()
            .await
    }

    pub async fn create_task(&self, params: &CreateTaskParams) -> Result<Task, reqwest::Error> {
        self.client
            .post(format!("{}/api/v1/tasks", self.base_url))
            .json(params)
            .send()
            .await?
            .json::<Task>()
            .await
    }

    pub async fn remove_task(&self, id: &str) -> Result<(), reqwest::Error> {
        self.client
            .delete(format!("{}/api/v1/tasks/{}", self.base_url, id))
            .send()
            .await?;
        Ok(())
    }
}
