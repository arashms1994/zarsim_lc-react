import { useEffect } from "react";
import { useRoutes } from "react-router";
import Carry from "./components/carry/Carry";
import { createRoot } from "react-dom/client";
import LCEnding from "./components/ending/LCEnding";
import { Layout } from "./components/layout/Layout";
import Openning from "./components/openning/Openning";
import PreInvoice from "./components/pre-invoice/PreInvoice";

const App: React.FC = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <PreInvoice /> },
        { path: "/openning", element: <Openning /> },
        { path: "/carry", element: <Carry /> },
        { path: "/LCEnding", element: <LCEnding /> },
      ],
    },
  ]);

  useEffect(() => {
    const handleTabChange = () => {
      const rootElement = document.getElementById("root");
      if (rootElement && !rootElement.hasChildNodes()) {
        const root = createRoot(rootElement);
        root.render(<App />);
      }
    };

    document.addEventListener("tabChange", handleTabChange);
    return () => document.removeEventListener("tabChange", handleTabChange);
  }, []);

  return routes;
};

export default App;
