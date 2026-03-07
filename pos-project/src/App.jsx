import React, { useState } from "react";
import { POSPage } from "./pages/POSPage";
import { AdminPage } from "./pages/AdminPage";

export default function App() {
  const [page, setPage] = useState("pos");

  return (
    <>
      {page === "pos" ? (
        <POSPage onGoAdmin={() => setPage("admin")} />
      ) : (
        <AdminPage onGoBack={() => setPage("pos")} />
      )}
    </>
  );
}
