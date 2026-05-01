import "./App.css";
import "./index.css";
import { RemoteComponentWrapper } from "./components/RemoteComponentWrapper";

function App() {
  return (
    <>
      <div className="px-6 border-2">
        <h1 className="text-2xl">Host Application</h1>
        <p>
          {" "}
          Welcome to the Host application, below are the components pulled from
          the remote application
        </p>
        <RemoteComponentWrapper />
      </div>
    </>
  );
}

export default App;