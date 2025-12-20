mod api;
mod models;

use clap::{Parser, Subcommand};
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
    List {},
    Show {
        id: String,
    },
    Create {
        #[arg(short, long)]
        name: String,
    },
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();

    match &cli.command {
        Some(Commands::Tasks { command }) => match command {
            Some(TasksCommands::List {}) => {
                let tasks = api::list_tasks().await?;

                for task in &tasks {
                    println!("{}", task.title);
                }
            }
            Some(TasksCommands::Show { id }) => {
                println!("show task {}", id);
            }
            Some(TasksCommands::Create { name }) => {
                println!("create task {}", name);
            }
            None => {}
        },
        None => {}
    };

    Result::Ok(())
}
