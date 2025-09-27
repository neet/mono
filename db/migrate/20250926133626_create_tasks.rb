class CreateTasks < ActiveRecord::Migration[8.0]
  def change
    create_table :tasks do |t|
      t.string :title
      t.string :note
      t.boolean :complete

      t.timestamps
    end
  end
end
