import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {ColorReplacer} from "./ColorReplacer";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ColorReplacer />
  </StrictMode>
);