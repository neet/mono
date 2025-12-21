use crate::models::*;

pub trait Presenter {
    fn present(&self) -> String;
}

impl Presenter for Task {
    fn present(&self) -> String {
        let mut res = String::new();

        res += &format!("ID:\t{}\n", self.id);
        res += &format!("Title:\t{}\n", self.title);
        res += &format!("Description:\t{}\n", self.description);
        res += &format!(
            "Deadline On:\t{}\n",
            self.deadline_on.as_deref().unwrap_or("(Not set)")
        );
        res += &format!("Created At:\t{}\n", self.created_at);
        res += &format!("Updated At:\t{}\n", self.updated_at);

        return res;
    }
}

impl Presenter for Vec<Task> {
    fn present(&self) -> String {
        let mut res = String::new();

        for task in self {
            let symbol = match task.status {
                TaskStatus::Pending => "[ ]",
                TaskStatus::Completed => "[x]",
                TaskStatus::Canceled => "[-]",
            };
            res += &format!("{} {}\t(#{})\n", symbol, &task.title, &task.id);
        }

        return res;
    }
}
