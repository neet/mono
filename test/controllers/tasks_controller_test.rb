require "test_helper"

class TasksControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  test "should list tasks" do
    sign_in users(:one)
    get api_v1_tasks_path
    assert_response :success
    assert_equal [], response.parsed_body
  end

  test "should create a task" do
    sign_in users(:one)
    post api_v1_tasks_path, params: { task: { title: "新しいタスク" } }
    assert_response :success
    assert_equal "新しいタスク", response.parsed_body["title"]
  end

  test "should update a task" do
    sign_in users(:one)
    post api_v1_tasks_path, params: { task: { title: "新しいタスク" } }
    task_id = response.parsed_body["id"]
    put api_v1_task_path(task_id), params: { task: { title: "新しいタスク2" } }
    assert_response :success
    assert_equal "新しいタスク2", response.parsed_body["title"]
  end

  test "should delete a task" do
    sign_in users(:one)
    post api_v1_tasks_path, params: { task: { title: "新しいタスク" } }
    task_id = response.parsed_body["id"]
    delete api_v1_task_path(task_id)
    get api_v1_task_path(task_id)
    assert_response :missing
  end
end
