import { useRoutes } from "react-router";
import { Layout } from "./components/layout/Layout";
import PreInvoice from "./components/pre-invoice/PreInvoice";
import Openning from "./components/openning/Openning";

const App: React.FC = () => {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "/", element: <PreInvoice /> },
        { path: "/openning", element: <Openning faktorNumber="" /> },
        // { path: "/carry", element: <Carry /> },
        // { path: "/payment", element: <Payment /> },
      ],
    },
  ]);

  return routes;
};

export default App;
