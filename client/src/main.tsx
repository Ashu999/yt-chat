import { StrictMode } from "react";
import ReactDOM from "react-dom/client";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";

import "./styles.css";
import reportWebVitals from "./reportWebVitals.ts";

import App from "./App.tsx";

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();

const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
	const root = ReactDOM.createRoot(rootElement);
	root.render(
		<StrictMode>
			<TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
				<div className="min-h-screen bg-gray-100">
					<App />
				</div>
			</TanStackQueryProvider.Provider>
		</StrictMode>,
	);
}

reportWebVitals();
