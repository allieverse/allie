export const modules = [];

const styles: string[] = [];
for (const module of Object.values(import.meta.glob("./**/*.tsx", { eager: true }))) {
	if (
		typeof module === "object" &&
		module !== null &&
		"style" in module &&
		typeof module.style === "string"
	) {
		styles.push(module.style);
	}
}

const allStyles = styles.join("\n");
export default allStyles;
