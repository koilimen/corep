import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import {ColorReplacer} from "./ColorReplacer";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <ColorReplacer />
  </StrictMode>
);