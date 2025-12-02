class AddDeadlineOnToTasks < ActiveRecord::Migration[8.0]
  def change
    add_column :tasks, :deadline_on, :date
  end
end
