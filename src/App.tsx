import { useRoutes } from "react-router";
import { Layout } from "./components/layout/Layout";
import PreInvoice from "./components/pre-invoice/PreInvoice";
import Openning from "./components/openning/Openning";
import Carry from "./components/carry/Carry";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import LCEnding from "./components/LCending/LCEnding";

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
