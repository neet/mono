//
//  ContentView.swift
//  Mono
//
//  Created by Ryo Igarashi on 2025/12/22.
//

import SwiftUI

struct Task: Identifiable, Decodable {
    let id: Int
    let title: String
    let description: String
    let status: String
    let createdAt: String
    let updatedAt: String
    let dueOn: String?

    enum CodingKeys: String, CodingKey {
        case id, title, description, status
        case createdAt = "created_at"
        case updatedAt = "updated_at"
        case dueOn = "due_on"
    }
}

struct ContentView: View {
    @State var hasError = false
    @State var tasks: [Task] = []
  
    var body: some View {
        NavigationStack {
          List(tasks) { task in
            HStack{
              Image(systemName: task.status == "completed" ? "checkmark.square" : "square")
              Text(task.title)
            }
          }
          .navigationTitle("Tasks")
        }
        .onAppear {
          let decoder = JSONDecoder()
          
          let config = URLSessionConfiguration.default
          let session = URLSession(configuration: config)
          let urlComponents = URLComponents(string: "http://127.0.0.1:3000/api/v1/tasks")
          let url = urlComponents?.url
          var request = URLRequest(url: url!)
          
          request.setValue("Bearer U_WOJ6_WaA-P0_FzCAyGKnocRMd_mTztlMg7AeXBmMY", forHTTPHeaderField: "Authorization")

          let task = session.dataTask(with: request) { data, _, error in
            if error != nil { DispatchQueue.main.async { hasError = true }; return }
            guard let data else { return }

            do {
              let tasks = try decoder.decode([Task].self, from: data)
              DispatchQueue.main.async { self.tasks = tasks }
            } catch {
              DispatchQueue.main.async { hasError = true }
            }
          }
          
          task.resume()
        }
    }
}

#Preview {
    ContentView()
}
