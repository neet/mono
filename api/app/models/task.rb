class Task < ApplicationRecord
  belongs_to :user
  belongs_to :habit, optional: true

  enum :status, [ :pending, :completed, :canceled ]
end
