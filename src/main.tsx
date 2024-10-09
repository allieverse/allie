import Widget from "./components/Widget";
import "./components/widgetRegistry";
import "./style.css";
import { $, render } from "voby";
import allStyles from "./styles";

function App() {
	const value = $<unknown>([1, "a", true, true, false]);
	return (
		<div class="App">
			<div style={{ display: "grid", placeItems: "center" }}>
				<Widget value={value} />
			</div>
			<pre>
				<code>{() => JSON.stringify(value())}</code>
			</pre>
			<style
				ref={(element) => {
					element.innerHTML = allStyles;
				}}
			/>
		</div>
	);
}

render(<App />, document.querySelector("#app"));
