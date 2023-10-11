
import './App.css';
import { Route } from "react-router-dom";
import Home from "../src/components/Home.js"
import Chats from "../src/components/Chats.js"
function App() {
  return (
    <div className="App">
      <Route path="/" component={Home} exact />
      <Route path="/chats" component={Chats} />
    </div>
  );
}

export default App;
