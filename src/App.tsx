import { useRoutes } from "react-router";
import { Layout } from "./components/layout/Layout";
import PreInvoice from "./components/pre-invoice/PreInvoice";
import Openning from "./components/openning/Openning";
import Carry from "./components/carry/Carry";

const App: React.FC = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <PreInvoice /> },
        { path: "/openning", element: <Openning faktorNumber="" /> },
        { path: "/carry", element: <Carry faktorNumber="" /> },
        // { path: "/payment", element: <Payment /> },
      ],
    },
  ]);

  return routes;
};

export default App;
