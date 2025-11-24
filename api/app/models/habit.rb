class Habit < ApplicationRecord
  belongs_to :user
  has_many :tasks, dependent: :destroy

  validates :rrule, presence: true
  validates :tzid, presence: true
  validate :validate_rrule_and_tzid

  after_commit :enqueue, on: [ :create, :update ], if: :rrule_or_tzid_changed?

  def recur
    last = tasks.order(created_at: :desc).first

    if last.nil? || last.completed?
      task = tasks.build(
        user: user,
        title: title,
        description: description
      )

      task.save!
    end

    enqueue
  end

  def next_recur_at
    rule = RRule::Rule.new(rrule, tzid: tzid, dtstart: created_at)

    # RRule::Rule#fromがちゃんと動いてくれない。
    # limitが適用されるのがfromよりも前なので、イテレーションの回数を指定しないと正しい結果が帰ってこない
    # RRuleの最長の反復周期が1年（FREQ=YEARLY）なので、べつにこれでいいか…
    t = Time.current
    rule.between(t + 1.second, t + 1.year).first
  end

  def fingerprint
    Digest::SHA256.hexdigest([ rrule, tzid ].join("\x00"))
  end

  private
    def rrule_or_tzid_changed?
      saved_change_to_rrule? || saved_change_to_tzid?
    end

    def validate_rrule_and_tzid
      return if tzid.blank? || rrule.blank?

      # https://stackoverflow.com/questions/31792295/validating-a-time-zone-is-valid-in-rails
      if !ActiveSupport::TimeZone[tzid].present?
        errors.add :tzid, :invalid
        return
      end

      RRule::Rule.new(rrule, tzid: tzid)
    rescue RRule::InvalidRRule
      errors.add :rrule, :invalid
    end

    def enqueue
      wait_until = next_recur_at

      return if wait_until.nil?

      CreateTaskFromHabitJob
        .set(wait_until: wait_until)
        .perform_later(id, fingerprint)
    end
end
