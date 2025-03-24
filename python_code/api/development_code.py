from agents import (GuardAgent,
                    ClassificationAgent,
                    DetailsAgent,
                    AgentProtocol,
                    RecommendationAgent,
                    OrderTakingAgent
                    )

import os
from typing import Dict
import pathlib
folder_path = pathlib.Path(__file__).parent.resolve()

def main():
    
    guard_agent = GuardAgent()
    classification_agent = ClassificationAgent()
    recommendation_agent = RecommendationAgent(
            os.path.join(folder_path, 'recommendation_objects/apriori_recommendations.json'),
            os.path.join(folder_path, 'recommendation_objects/popularity_recommendation.csv')
        )

    agent_dict: Dict[str, AgentProtocol] = {
        "details_agent": DetailsAgent(),
        "recommendation_agent": recommendation_agent,
        "order_taking_agent": OrderTakingAgent(recommendation_agent)
    }

    messages = []
    while True:
        # os.system('cls' if os.name == 'nt' else 'clear')

        print("\n\nPrint Messages ...............")
        for message in messages:
            print(f"{message['role'].capitalize()}: {message['content']}")

        # Get user input
        prompt = input("User: ")
        messages.append({"role": "user", "content": prompt})

        guard_agent_response = guard_agent.response(messages)
        if guard_agent_response["memory"]["guard_decision"] == "not allowed":
            messages.append(guard_agent_response)
            continue
        
        classification_agent_response = classification_agent.response(messages)

        chosen_agent = classification_agent_response["memory"]["classification_decision"]
        print(f"Chosen Agent: {chosen_agent}")

        agent = agent_dict[chosen_agent]
        agent_response = agent.response(messages)
        # print("Agent Response: ", agent_response)

        messages.append(agent_response)


if __name__ == "__main__":
    main()