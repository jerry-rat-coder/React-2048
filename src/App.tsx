import Grid from "./components/Grid";
import HelpModal from "./components/modal/HelpModal";

function App() {
  return (
    <>
      <div className="w-full h-[100vh] flex justify-center items-center bg-slate-800 flex-col gap-4 overflow-hidden">
        <Grid />
      </div>
      <HelpModal />
    </>
  );
}

export default App;
