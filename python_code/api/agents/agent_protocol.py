from typing import Protocol,Dict,List, Any

class AgentProtocol(Protocol):
    def response(self, messages: List[Dict[str, Any]]) -> Dict[str, Any]:
        ... 
    

