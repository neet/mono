class ChangeTasksCompleteToRequired < ActiveRecord::Migration[8.0]
  def change
    change_column_default :tasks, :complete, from: nil, to: false
    change_column_null :tasks, :complete, false
  end
end
