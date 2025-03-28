from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Home route to check if the server is running
@app.route("/")
def home():
    return "✅ Server is running successfully!"

# Test route for debugging  
@app.route("/test", methods=["GET"]) 
def test():
    return jsonify({"message": "Test route is working!"})

# Example API to handle resource allocation (dummy logic)
@app.route("/allocate", methods=["POST"])
def allocate_resources():
    try:
        data = request.get_json()
        process_id = data.get("process_id", "Unknown")
        memory_required = data.get("memory", 0)
        cpu_time = data.get("cpu_time", 0)

        # Dummy resource allocation logic (can be modified)
        allocation_status = "Allocated" if memory_required <= 512 else "Denied"

        response = {
            "process_id": process_id,
            "memory_allocated": memory_required if allocation_status == "Allocated" else 0,
            "cpu_time": cpu_time,
            "status": allocation_status
        }

        return jsonify(response)
    
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route("/processes", methods=["POST"])
def handle_process():
    try:
        processes = request.json
        if not processes:
            return jsonify({"error": "Process list is empty"}), 400

        # Sort by priority (Higher priority first)
        processes.sort(key=lambda x: x["priority"], reverse=True)

        # Dummy adaptive allocation logic
        executionOrder = []
        total_cpu = 100  # Total CPU units
        total_memory = 1024  # Total Memory units

        for process in processes:
            allocated_cpu = int((process["priority"] / 10) * total_cpu)

            if total_memory >= process["memoryReq"]:
                allocated_memory = process["memoryReq"]
            else:
                allocated_memory = total_memory  # Allocate whatever is left

            total_memory -= allocated_memory

            executionOrder.append({
                "id": process["id"],
                "allocatedCPU": allocated_cpu,
                "allocatedMemory": allocated_memory,
            })

        return jsonify({"executionOrder": executionOrder})
    except Exception as e:
        return jsonify({"error": str(e)}), 400




if __name__ == "__main__":
    print("🚀 Flask server is running on http://127.0.0.1:5000/")
    app.run(debug=True)
