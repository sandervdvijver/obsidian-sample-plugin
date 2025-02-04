import { ItemView, WorkspaceLeaf, TFile } from "obsidian";
import path from "path";

export class MediaView extends ItemView {
	folderPath: string = "";
	icon = "images";
	navigation = true;

	constructor(leaf: WorkspaceLeaf, state?: any) {
		super(leaf);
		if (state?.folder) this.folderPath = state.folder;
	}

	getViewType() {
		return "media-view";
	}

	getDisplayText() {
		return "Image Browser";
	}

	async onOpen() {
		this.containerEl.empty();

		if (!this.folderPath) {
			const folder = this.leaf.getViewState().state?.folder;
			this.folderPath = typeof folder === "string" ? folder : "";

			console.log("Firing onOpen");
			this.containerEl.createEl("p", { text: "No folder selected." });
			return;
		}

		this.containerEl.createEl("p", { text: "Loading media files..." });

		await this.loadMediaFiles();
	}

	async setState(state: any) {
		if (state.folder) {
			this.folderPath = state.folder;
			this.containerEl.empty();
			await this.loadMediaFiles();
		}
	}

	async getState(): Promise<any> {
		return { folder: this.folderPath };
	}

	async loadMediaFiles() {
		const files = this.app.vault.getFiles();
		const mediaFiles = files.filter((file: TFile) => {
			const ext = file.extension.toLowerCase();
			return (
				file.path.startsWith(this.folderPath + "/") &&
				["png", "jpg", "jpeg", "gif", "webp", "mp4", "mov"].includes(
					ext
				)
			);
		});

		this.containerEl.empty();

		if (mediaFiles.length === 0) {
			this.containerEl.createEl("p", { text: "No media found." });
			return;
		}

		const grid = this.containerEl.createEl("div", { cls: "image-grid" });

		for (const file of mediaFiles) {
			const filePath = path.join(
				(this.app.vault.adapter as any).basePath,
				file.path
			);
			const blobUrl = await this.convertToBlobUrl(filePath);

			const img = grid.createEl("img", { attr: { src: blobUrl } });

			img.addEventListener("click", (event) => {
				const openInNewTab = event.metaKey || event.ctrlKey;

				if (openInNewTab) {
					this.app.workspace.openLinkText(file.path, "", true);
				} else {
					const leaf = this.app.workspace.getMostRecentLeaf();
					if (leaf) {
						leaf.setViewState({
							type: "image",
							state: { file: file.path },
						});
					}
				}
			});
		}
	}

	async convertToBlobUrl(filePath: string): Promise<string> {
		const fs = require("fs").promises;
		const data = await fs.readFile(filePath);
		const blob = new Blob([data]);
		return URL.createObjectURL(blob);
	}

	onLayoutReady() {
		console.log("MediaView restored, refreshing grid...");
		this.loadMediaFiles();
	}

	async onClose() {}
}
