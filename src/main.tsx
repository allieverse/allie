import Widget from "./components/Widget";
import "./components/widgetRegistry";
import "./style.css";
import { $, render } from "voby";
import TextInputWidget from "./components/widgets/9000_TextInputWidget";
import NumberInputWidget from "./components/widgets/9000_NumberInputWidget";
import CheckboxWidget from "./components/widgets/8000_CheckboxWidget";
import allStyles from "./styles";
import { projectKey } from "./utils/observable";

function App() {
	const value = $<unknown>([1, "a", true, true, false]);
	interface T {
		a: string;
		b: number;
		c: boolean;
	}
	const formValue = $<T>({ a: "string", b: 100, c: true });
	return (
		<div class="App">
			<div style={{ display: "grid", placeItems: "center" }}>
				<Widget value={value} />
			</div>
			<pre>
				<code>{() => JSON.stringify(value())}</code>
			</pre>
			<div style={{ display: "flex", flexFlow: "column" }}>
				<TextInputWidget value={projectKey(formValue, "a")} />
				<NumberInputWidget value={projectKey(formValue, "b")} />
				<CheckboxWidget value={projectKey(formValue, "c")} />
			</div>
			<pre>
				<code>{() => JSON.stringify(formValue())}</code>
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
