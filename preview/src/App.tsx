import { PDFViewer } from "@react-pdf/renderer";
import InvoiceTemplate from "./components/invoice-template";

function App() {
  return (
    <PDFViewer style={{ height: "100vh", width: "100%" }}>
      <InvoiceTemplate />
    </PDFViewer>
  );
}

export default App;
