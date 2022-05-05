import logo from "./logo.svg";
import { CookiesProvider } from "react-cookie";
import Routing from "./components/Routing";
import "./App.css";

function App(props) {
  return (
    <CookiesProvider>
      <div className="App">
        <Routing {...props} />
      </div>
    </CookiesProvider>
  );
}

export default App;
