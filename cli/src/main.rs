mod api;
mod models;

use api::ApiClient;
use clap::{Parser, Subcommand};
use std::env;
use tokio;

use crate::models::TaskStatus;

#[derive(Parser)]
#[command(version, about, long_about=None)]
struct Cli {
    #[command(subcommand)]
    command: Option<Commands>,
}

#[derive(Subcommand)]
enum Commands {
    Tasks {
        #[command(subcommand)]
        command: Option<TasksCommands>,
    },
}

#[derive(Subcommand)]
enum TasksCommands {
    List {
        #[arg(short, long)]
        status: Option<String>,
    },
    Show {
        id: String,
    },
    Create {
        #[arg(short, long)]
        title: String,
        #[arg(short, long)]
        description: Option<String>,
    },
    Remove {
        id: String,
    },
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();

    let base_url = env::var("MONO_BASE_URL").unwrap_or("https://mono.neet.love".to_string());
    let access_token = env::var("MONO_ACCESS_TOKEN").ok();
    let api = ApiClient::new(&base_url, access_token.as_deref()).unwrap();

    match cli.command {
        Some(Commands::Tasks { command }) => match command {
            Some(TasksCommands::List { status }) => {
                let params = api::ListTasksParams { status };
                let tasks = api.list_tasks(&params).await?;

                for task in &tasks {
                    let symbol = match task.status {
                        TaskStatus::Completed => "[x]",
                        _ => "[ ]",
                    };
                    println!("{} {} (#{})", symbol, task.title, task.id);
                }
            }
            Some(TasksCommands::Show { id }) => {
                let task = api.show_task(&id).await?;
                let symbol = match task.status {
                    TaskStatus::Completed => "[x]",
                    _ => "[ ]",
                };
                println!("{} {} (#{})", symbol, task.title, task.id);
            }
            Some(TasksCommands::Create { title, description }) => {
                let params = api::CreateTaskParams {
                    title: Some(title),
                    description,
                };
                let task = api.create_task(&params).await?;
                println!("{}", task.title);
            }
            Some(TasksCommands::Remove { id }) => {
                api.remove_task(&id).await?;
            }
            None => {}
        },
        None => {}
    };

    Result::Ok(())
}
