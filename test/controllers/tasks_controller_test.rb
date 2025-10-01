require "test_helper"

class TasksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @task = tasks(:one)
    post sessions_path, params: { email: "one@example.com", password: "password" }
  end

  test "should get index" do
    get api_v1_tasks_url, as: :json
    assert_response :success
  end

  test "should create task" do
    assert_difference("Task.count") do
      post api_v1_tasks_url, params: { task: { completed: @task.completed, description: @task.description, title: @task.title } }, as: :json
    end

    assert_response :created
  end

  test "should show task" do
    get api_v1_task_url(@task), as: :json
    assert_response :success
  end

  test "should update task" do
    patch api_v1_task_url(@task), params: { task: { completed: @task.completed, description: @task.description, title: @task.title } }, as: :json
    assert_response :success
  end

  test "should destroy task" do
    assert_difference("Task.count", -1) do
      delete api_v1_task_url(@task), as: :json
    end

    assert_response :no_content
  end
end
