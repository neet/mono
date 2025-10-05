class Task < ApplicationRecord
  belongs_to :user
  belongs_to :habit, optional: true
end
