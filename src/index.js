// Import browser polyfills first to ensure compatibility
import "./utils/browserPolyfills";

import ReactDOM from "react-dom/client";
import App from "./app";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider as ReduxProvider } from "react-redux";
import store from "./redux/store/store";
import { GlobalContextProvider } from "./context";
import { preventBFCacheLogout } from "./utils/preventBFCacheLogout";

preventBFCacheLogout();

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GlobalContextProvider>
    <ReduxProvider store={store}>
      <Router>
        <App />
      </Router>
    </ReduxProvider>
  </GlobalContextProvider>
);
