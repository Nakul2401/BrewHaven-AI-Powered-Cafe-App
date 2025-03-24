from agent_controller import AgentController
import runpod

# Initialize the agent controller


# Define a proper handler function that takes an input argument
def handler(event):
    agent_controller = AgentController()
    return agent_controller.get_agent_response(event)

# Start the RunPod serverless function
# runpod.serverless.start({"handler": handler})

if __name__ == "__main__":
    runpod.serverless.start({"handler": handler})