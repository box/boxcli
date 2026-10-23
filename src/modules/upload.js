'use strict';

const fs = require('node:fs');
const progress = require('cli-progress');
const BoxCLIError = require('../cli-error');

const CHUNKED_UPLOAD_FILE_SIZE = 1024 * 1024 * 100; // 100 MiB

function createReadStream(filePath) {
	try {
		return fs.createReadStream(filePath);
	} catch (error) {
		throw new BoxCLIError(`Could not open file ${filePath}`, error);
	}
}

function runChunkedUpload(uploader, size, onProgress) {
	const progressBar = new progress.Bar({
		format: '[{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total} | Speed: {speed} MB/s',
		stopOnComplete: true,
	});
	let bytesUploaded = 0;
	const startTime = Date.now();
	progressBar.start(size, 0, { speed: 'N/A' });
	onProgress?.(0);
	uploader.on('chunkUploaded', (chunk) => {
		bytesUploaded += chunk.part.size;
		progressBar.update(bytesUploaded, {
			speed: Math.floor(bytesUploaded / (Date.now() - startTime) / 1000),
		});
		onProgress?.((bytesUploaded / size) * 100);
	});
	return uploader.start();
}

/**
 * Upload a file, using a chunked upload for large files
 *
 * @param {BoxClient} client The Box client
 * @param {Object} options Upload options
 * @param {Function} [options.onProgress] Called with the percentage uploaded; only called for chunked uploads
 * @returns {Promise<Object>} The upload response
 */
async function uploadFile(
	client,
	{ folderID, name, stream, size, fileAttributes, onProgress }
) {
	if (size < CHUNKED_UPLOAD_FILE_SIZE) {
		return client.files.uploadFile(folderID, name, stream, fileAttributes);
	}
	const uploader = await client.files.getChunkedUploader(
		folderID,
		size,
		name,
		stream,
		{ fileAttributes }
	);
	return runChunkedUpload(uploader, size, onProgress);
}

/**
 * Upload a new version of a file, using a chunked upload for large files
 *
 * @param {BoxClient} client The Box client
 * @param {Object} options Upload options
 * @param {Function} [options.onProgress] Called with the percentage uploaded; only called for chunked uploads
 * @returns {Promise<Object>} The upload response
 */
async function uploadNewFileVersion(
	client,
	{ fileID, stream, size, fileAttributes, onProgress }
) {
	if (size < CHUNKED_UPLOAD_FILE_SIZE) {
		return client.files.uploadNewFileVersion(
			fileID,
			stream,
			fileAttributes
		);
	}
	const uploader = await client.files.getNewVersionChunkedUploader(
		fileID,
		size,
		stream,
		{ fileAttributes }
	);
	return runChunkedUpload(uploader, size, onProgress);
}

module.exports = {
	CHUNKED_UPLOAD_FILE_SIZE,
	createReadStream,
	uploadFile,
	uploadNewFileVersion,
};
