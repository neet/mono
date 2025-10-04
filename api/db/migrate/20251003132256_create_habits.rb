class CreateHabits < ActiveRecord::Migration[8.0]
  def change
    create_table :habits do |t|
      t.string :title,       null: false, default: ""
      t.string :description, null: false, default: ""

      t.string :rrule, null: false
      t.string :tzid,  null: false

      t.belongs_to :user

      t.timestamps
    end

    change_table :tasks do |t|
      t.belongs_to :habit
    end
  end
end
