import { App, PluginSettingTab, Setting } from "obsidian";
import ImageBrowserPlugin from "./main";

interface ImageBrowserSettings {
	defaultFolder: string;
}

const DEFAULT_SETTINGS: ImageBrowserSettings = {
	defaultFolder: "Media",
};

export class ImageBrowserSettingTab extends PluginSettingTab {
	plugin: ImageBrowserPlugin;

	constructor(app: App, plugin: ImageBrowserPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl("h2", { text: "Image Browser Settings" });

		new Setting(containerEl)
			.setName("Default Media Folder")
			.setDesc("Folder where media files are stored.")
			.addText((text) =>
				text
					.setPlaceholder("Enter folder name")
					.setValue(this.plugin.settings.defaultFolder)
					.onChange(async (value) => {
						this.plugin.settings.defaultFolder = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

export { ImageBrowserSettings, DEFAULT_SETTINGS };
