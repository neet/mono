mod api;
mod models;
mod presenter;

use api::ApiClient;
use clap::{Parser, Subcommand};
use presenter::Presenter;
use std::env;
use tokio;

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
    Update {
        id: String,
        #[arg(short, long)]
        title: Option<String>,
        #[arg(short, long)]
        description: Option<String>,
        #[arg(short, long)]
        status: Option<String>,
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
                println!("{}", tasks.present());
            }
            Some(TasksCommands::Show { id }) => {
                let task = api.show_task(&id).await?;
                println!("{}", task.present());
            }
            Some(TasksCommands::Create { title, description }) => {
                let params = api::CreateTaskParams {
                    title: Some(title),
                    description,
                };
                let task = api.create_task(&params).await?;
                println!("{}", task.present());
            }
            Some(TasksCommands::Update {
                id,
                title,
                description,
                status,
            }) => {
                let params = api::UpdateTaskParams {
                    title,
                    description,
                    status,
                };
                let task = api.update_task(&id, &params).await?;
                println!("{}", task.present());
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
