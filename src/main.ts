import { Plugin, WorkspaceLeaf } from "obsidian";
import { MediaView } from "./views/MediaView";
import {
	ImageBrowserSettingTab,
	ImageBrowserSettings,
	DEFAULT_SETTINGS,
} from "./settings";

export default class ImageBrowserPlugin extends Plugin {
	settings: ImageBrowserSettings;

	async onload() {
		console.log("Image Browser loading…");

		await this.loadSettings();
		this.addSettingTab(new ImageBrowserSettingTab(this.app, this));

		this.registerView("media-view", (leaf: WorkspaceLeaf) => {
			const state = leaf.getViewState().state;
			return new MediaView(leaf, state);
		});

		this.addCommand({
			id: "open-image-browser",
			name: "Open Image Browser",
			callback: () => this.activateView(this.settings.defaultFolder),
		});

		this.addRibbonIcon("images", "Open Image Browser", () => {
			this.activateView(this.settings.defaultFolder);
		});
	}

	onunload() {
		console.log("Image Browser unloading…");
	}

	async activateView(folderPath: string) {
		const { workspace } = this.app;
		let leaf = workspace
			.getLeavesOfType("media-view")
			.find((l) => (l.view as MediaView).folderPath === folderPath);

		if (!leaf) {
			leaf = workspace.getLeaf(true);
			await leaf.setViewState({
				type: "media-view",
				state: { folder: folderPath },
			});
		}

		workspace.revealLeaf(leaf);
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
