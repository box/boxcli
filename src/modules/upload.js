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

async function runChunkedUpload(uploader, size) {
	const progressBar = new progress.Bar({
		format: '[{bar}] {percentage}% | ETA: {eta_formatted} | {value}/{total} | Speed: {speed} MB/s',
		stopOnComplete: true,
	});
	let bytesUploaded = 0;
	const startTime = Date.now();
	progressBar.start(size, 0, { speed: 'N/A' });
	uploader.on('chunkUploaded', (chunk) => {
		bytesUploaded += chunk.part.size;
		progressBar.update(bytesUploaded, {
			speed: Math.floor(
				bytesUploaded / (Date.now() - startTime) / 1000
			),
		});
	});
	return uploader.start();
}

async function uploadFile(client, { folderID, name, stream, size, fileAttributes }) {
	if (size < CHUNKED_UPLOAD_FILE_SIZE) {
		return client.files.uploadFile(
			folderID,
			name,
			stream,
			fileAttributes
		);
	}
	const uploader = await client.files.getChunkedUploader(
		folderID,
		size,
		name,
		stream,
		{ fileAttributes }
	);
	return runChunkedUpload(uploader, size);
}

async function uploadNewFileVersion(client, { fileID, stream, size, fileAttributes }) {
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
	return runChunkedUpload(uploader, size);
}

module.exports = {
	CHUNKED_UPLOAD_FILE_SIZE,
	createReadStream,
	uploadFile,
	uploadNewFileVersion,
};
