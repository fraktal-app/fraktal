import { Link } from "react-router-dom";

function App() {
  return (
    <div className="bg-red-500 text-white p-10 text-3xl font-bold">
      Landing Page (TBD)
      <br/>

      <Link to="/login">
        <button>
          Login/Signup
        </button>
      </Link>
    </div>
  );
}

export default App;

