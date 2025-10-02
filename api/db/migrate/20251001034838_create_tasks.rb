class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :title, null: false, default: ""
      t.string :description, null: false, default: ""
      t.boolean :completed, null: false, default: false
      t.belongs_to :user

      t.timestamps
    end
  end
end
