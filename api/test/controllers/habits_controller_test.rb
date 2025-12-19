require "test_helper"

class HabitsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @habit = habits(:one)
    @user = users(:one)
  end

  test "should get index" do
    get api_v1_habits_url, headers: oauth_headers(user: @user), as: :json
    assert_response :success
  end

  test "should create habit" do
    assert_difference("Habit.count") do
      post api_v1_habits_url, headers: oauth_headers(user: @user), params: { habit: { description: @habit.description, rrule: @habit.rrule, title: @habit.title, tzid: @habit.tzid } }, as: :json
    end

    assert_response :created
  end

  test "should show habit" do
    get api_v1_habit_url(@habit), headers: oauth_headers(user: @user), as: :json
    assert_response :success
  end

  test "should update habit" do
    patch api_v1_habit_url(@habit), headers: oauth_headers(user: @user), params: { habit: { description: @habit.description, rrule: @habit.rrule, title: @habit.title, tzid: @habit.tzid } }, as: :json
    assert_response :success
  end

  test "should destroy habit" do
    assert_difference("Habit.count", -1) do
      delete api_v1_habit_url(@habit), headers: oauth_headers(user: @user), as: :json
    end

    assert_response :no_content
  end
end
