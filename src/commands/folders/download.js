'use strict';

const { flags } = require('@oclif/command');
const BoxCommand = require('../../box-command');
const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');
const BoxCLIError = require('../../cli-error');
const ora = require('ora');
const archiver = require('archiver');
const dateTime = require('date-fns');
const utils = require('../../util');

/**
 * Saves a file to disk
 *
 * @param {string} folderPath The folder path this item occurs at within the folder being downloaded
 * @param {Object} file The file record
 * @param {Readable} stream The stream of file contents
 * @returns {Promise<void>} A promise resolving when the file is completely written to disk
 * @throws BoxCLIError
 * @private
 */
function saveFileToDisk(folderPath, file, stream) {
	let output;
	try {
		output = fs.createWriteStream(path.join(folderPath, file.path));
		stream.pipe(output);
	} catch (ex) {
		throw new BoxCLIError(
			`Error downloading file ${file.id} to ${file.path}`,
			ex
		);
	}

	/* eslint-disable promise/avoid-new */
	// We need to await the end of the stream to avoid a race condition here
	return new Promise((resolve, reject) => {
		output.on('close', resolve);
		stream.on('error', reject);
	});
	/* eslint-enable promise/avoid-new */
}

class FoldersDownloadCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(FoldersDownloadCommand);

		this.outputPath = null;
		this.maxDepth =
			flags.hasOwnProperty('depth') && flags.depth >= 0
				? flags.depth
				: Number.POSITIVE_INFINITY;
		this.overwrite = flags.overwrite;

		let id = args.id;
		let outputFinalized = Promise.resolve();
		let rootItemPath = null;

		let destinationPath;
		if (flags.destination) {
			await utils.checkDir(flags.destination, flags['create-path']);
			destinationPath = flags.destination;
		} else {
			destinationPath = this.settings.boxDownloadsFolderPath;
		}

		/* eslint-disable no-sync */
		if (!fs.existsSync(destinationPath)) {
			throw new BoxCLIError('Destination path must exist');
		}

		const fsStat = fs.statSync(destinationPath);
		if (!fsStat.isDirectory()) {
			throw new BoxCLIError('Destination path must be a directory');
		}
		/* eslint-enable no-sync */

		this.spinner = ora('Starting download').start();

		if (flags.zip) {
			this.overwrite = true;
			let fileName = `folders-download-${id}-${dateTime.format(
				new Date(),
				'YYYY-MM-DDTHH_mm_ss_SSS'
			)}.zip`;
			rootItemPath = fileName;
			outputFinalized = this._setupZip(path.join(destinationPath, fileName));
		}

		try {
			this.outputPath = destinationPath;
			for await (let item of this._getItems(id, '')) {
				if (item.type === 'folder' && !this.zip) {
					// Set output path to the top-level folder, which is the first item in the generator
					rootItemPath = rootItemPath || item.path;

					this.spinnerLog(`Creating folder ${item.id} at ${item.path}`);
					try {
						await mkdirp(path.join(destinationPath, item.path));
					} catch (ex) {
						throw new BoxCLIError(
							`Folder ${item.path} could not be created`,
							ex
						);
					}
				} else if (item.type === 'file') {
					this.spinnerLog(`Downloading file ${item.id} to ${item.path}`);
					let stream = await this.client.files.getReadStream(item.id);

					if (this.zip) {
						this.zip.append(stream, { name: item.path });
					} else {
						// @TODO(2018-08-15): Improve performance by queueing async work and performing in parallel
						await saveFileToDisk(destinationPath, item, stream);
					}
				}
			}
		} catch (err) {
			this.spinner.stop();
			throw err;
		}

		if (this.zip) {
			this.zip.finalize();
		}
		await outputFinalized;
		this.spinner.succeed(
			`${this.bufferLog || ''}\nDownloaded folder ${id} to ${path.join(
				this.outputPath,
				rootItemPath
			)}`.trim()
		);
	}

	spinnerLog(message, preserveText = false) {
		this.spinner.text = `${this.bufferLog || ''}\n${message}`.trim();
		if (preserveText) {
			this.bufferLog = this.spinner.text;
		}
	}

	/**
	 * Generator for items in the given folder.  Yields items starting with the top-level folder itself.
	 * @param {string} folderId The ID of the folder to generate items for
	 * @param {string} folderPath The relative path so far down the folder tree
	 * @yields {Object} Item records
	 * @returns {void}
	 * @private
	 */
	async* _getItems(folderId, folderPath) {
		let folder = await this.client.folders.get(folderId);
		folderPath = path.join(folderPath, folder.name);

		yield {
			type: 'folder',
			id: folderId,
			name: folder.name,
			path: folderPath,
		};

		let folderItems = folder.item_collection.entries;
		if (folder.item_collection.total_count > folderItems.length) {
			let iterator = await this.client.folders.getItems(folderId, {
				usemarker: true,
				fields: 'type,id,name',
			});
			folderItems = { [Symbol.asyncIterator]: () => iterator };
		}
		for await (let item of folderItems) {
			if (item.type === 'folder') {
				// We only recurse this folder by one of the following conditions:
				// 1. The overwrite flag is true. We will download all files and folders within the provided depth (overwite).
				// 2. The folder does not exist. We will download all files and folders within the provided depth.
				// 3. The folder exists and overwrite is false, we only download files and folders not existing, within the provided depth.
				/* eslint-disable no-sync */
				if (
					folderPath.split(path.sep).length <= this.maxDepth
				) {
					/* eslint-enable no-sync */
					yield* this._getItems(item.id, folderPath);
				} else {
					// If the folder exists and overwrite is false, we skip the folder.
					this.spinnerLog(
						`Skipping folder ${item.name} (${item.id}) at ${folderPath} because reached max depth of ${this.maxDepth}`,
						true
					);
				}
			} else if (item.type === 'file') {
				// We only download file if overwrite is true or the file does not exist.
				// Skip downloading if overwrite is false and the file exists.
				/* eslint-disable no-sync */
				if (
					this.overwrite ||
					!fs.existsSync(path.join(this.outputPath, folderPath, item.name))
				) {
					/* eslint-enable no-sync */
					yield {
						type: 'file',
						id: item.id,
						name: item.name,
						path: path.join(folderPath, item.name),
					};
				} else {
					this.spinnerLog(
						`Skipping file ${item.name} (${item.id}) at ${folderPath} because it already exists and overwrite is disabled`,
						true
					);
				}
			}
		}
	}

	/**
	 * Sets up a zip archive writing to the given destination.
	 *
	 * @param {string} destinationPath The path where the .zip file should be written
	 * @returns {Promise<void>} A promise resolving when the archive is finalized and written to disk
	 * @throws BoxCLIError
	 * @private
	 */
	_setupZip(destinationPath) {
		// Set up archive stream
		this.zip = archiver('zip', {
			zlib: { level: 9 }, // Use the best available compression
		});

		let output;
		try {
			output = fs.createWriteStream(destinationPath);
		} catch (ex) {
			throw new BoxCLIError(
				`Could not write to destination path ${destinationPath}`,
				ex
			);
		}

		this.zip.on('error', (err) => {
			throw new BoxCLIError('Error writing to zip file', err);
		});

		this.zip.pipe(output);

		/* eslint-disable promise/avoid-new */
		// We need to await the end of the stream to avoid a race condition here
		return new Promise((resolve, reject) => {
			output.on('close', resolve);
			output.on('error', reject);
		});
		/* eslint-enable promise/avoid-new */
	}
}

FoldersDownloadCommand.description = 'Download a folder';
FoldersDownloadCommand.examples = ['box folders:download 22222'];

FoldersDownloadCommand.flags = {
	...BoxCommand.flags,
	destination: flags.string({
		description: 'The destination folder to download the Box folder into',
		parse: utils.parsePath,
	}),
	zip: flags.boolean({
		description: 'Download the folder into a single .zip archive',
	}),
	depth: flags.integer({
		description:
			'Number of levels deep to recurse when downloading the folder tree',
	}),
	'create-path': flags.boolean({
		description:
			'Recursively creates a path to a directory if it does not exist',
		allowNo: true,
		default: true,
	}),
	overwrite: flags.boolean({
		description: '[default: true] Overwrite the folder if it already exists.',
		allowNo: true,
		default: true,
	}),
};

FoldersDownloadCommand.args = [
	{
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the folder to download',
	},
];

module.exports = FoldersDownloadCommand;
