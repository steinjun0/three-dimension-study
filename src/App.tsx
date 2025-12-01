import "./App.css";

function App({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div style={{ width: "100vw", height: "100vh" }}>{children}</div>
    </>
  );
}

export default App;
