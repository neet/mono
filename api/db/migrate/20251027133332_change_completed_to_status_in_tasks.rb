class ChangeCompletedToStatusInTasks < ActiveRecord::Migration[8.0]
  def up
    add_column :tasks, :status, :integer, null: false, default: 0
    add_index  :tasks, :status

    execute "UPDATE tasks SET status = 1 WHERE completed = TRUE;"

    remove_column :tasks, :completed
  end

  def down
    add_column :tasks, :completed, :boolean, null: false, default: false

    execute "UPDATE tasks SET completed = TRUE WHERE status = 1;"

    remove_column :tasks, :status
  end
end
