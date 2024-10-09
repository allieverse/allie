import { registerWidget, type WidgetModule } from "./Widget";

for (const module of Object.values(import.meta.glob("./widgets/*", { eager: true }))) {
	registerWidget(module as WidgetModule);
}
