import { Header } from "../../components/header";
import { LinksManagement } from "../../components/links-management";
import { Helmet } from "react-helmet";

export function Links() {
  return (
    <div className="flex items-center flex-col min-h-screen pb-7 px-2">
      <Helmet>
        <title>Meus Links - GabisLinks</title>
      </Helmet>
      <Header />
      <LinksManagement />
    </div>
  );
}
