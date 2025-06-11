const getVaultPath = function () {
	// @ts-ignore
	return this.app.vault.adapter.basePath;
};

export { getVaultPath };
