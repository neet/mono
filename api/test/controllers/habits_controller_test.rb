require "test_helper"

class HabitsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @habit = habits(:one)
    post api_v1_sessions_path, params: { email: "one@example.com", password: "password" }
  end

  test "should get index" do
    get api_v1_habits_url, as: :json
    assert_response :success
  end

  test "should create habit" do
    assert_difference("Habit.count") do
      post api_v1_habits_url, params: { habit: { description: @habit.description, rrule: @habit.rrule, title: @habit.title, dtstart: @habit.dtstart, tzid: @habit.tzid } }, as: :json
    end

    assert_response :created
  end

  test "should show habit" do
    get api_v1_habit_url(@habit), as: :json
    assert_response :success
  end

  test "should update habit" do
    patch api_v1_habit_url(@habit), params: { habit: { description: @habit.description, rrule: @habit.rrule, title: @habit.title, dtstart: @habit.dtstart, tzid: @habit.tzid } }, as: :json
    assert_response :success
  end

  test "should destroy habit" do
    assert_difference("Habit.count", -1) do
      delete api_v1_habit_url(@habit), as: :json
    end

    assert_response :no_content
  end
end
