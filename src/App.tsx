import Header from "./components/Header";
import UploadForm from "./components/UploadForm";

console.log(
  `Build timestamp: ${new Date(
    import.meta.env.VITE_BUILD_TIMESTAMP
  ).toLocaleString()}`
);

function App() {
  return (
    <div className="App">
      <Header />
      <UploadForm />
    </div>
  );
}

export default App;
