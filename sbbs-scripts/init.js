import shell from 'shelljs';
import { promises as fsp } from 'fs';

const getOldVersion = () => fsp.readFile(`/sbbs/ctrl/version.txt`, 'utf8').catch(() => null);
const getCurrentVersion = () => fsp.readFile(`/sbbs/ctrl.orig/version.txt`, 'utf8').catch(() => null);

async function checkCtrl(source, dest) {
	const hasIniFile = await fsp.stat(`${dest}/sbbs.ini`).then(() => true).catch(() => false);
	if (hasIniFile) return;

	// new install - copy from initial ctrl directory
	console.log(`Initial install, creating ${dest} from ${source}`);
	shell.mkdir('-p', dest);
	shell.cp('-rf', `${source}/*`, dest);
}

async function checkDest(source, dest) {
	const files = await fsp.readdir(dest);
	if (!files.length) {
		console.log(`Creating ${dest} from ${source}`);
		shell.cp('-r', `${source}/*`, dest);
	}
}

async function checkXtrn() {
	// checkDest(`/sbbs/webv4`, `/sbbs/web/`);
	const dest = await fsp.readdir('/sbbs/xtrn');
	const list = await fsp.readdir('/sbbs/xtrn.orig');
	for (const item of list) {
		if (dest.includes(item)) continue;
		shell.cp('-r', `/sbbs/xtrn.orig/${item}/`, `/sbbs/xtrn/${item}/`);
	}
	shell.cp('-r', `/sbbs/xtrn.orig/3rdp-install/`, `/sbbs/xtrn/3rdp-install/`);
}

async function upgrade({ currentVersion }) {
	const now = new Date().toISOString().replace(/\D/g,'').substr(0,14);

	// backup and replace text.dat file
	const oldDat = await fsp.readFile(`/sbbs/ctrl/text.dat`, 'utf8');
	const newDat = await fsp.readFile(`/sbbs/ctrl.orig/text.dat`, 'utf8');
	if (oldDat !== newDat) {
		await shell.cp(`/sbbs/ctrl/text.dat`, `/sbbs/ctrl/text.dat.${now}.bak`);
		await shell.cp(`/sbbs/ctrl.orig/text.dat`, `/sbbs/ctrl/text.dat`)
	}

	// other data migrations/upgrades will go here
	checkDest(`/sbbs/text.orig`, `/sbbs/text/`);
	checkDest(`/sbbs/webv4`, `/sbbs/web/`);
	await checkXtrn();

	// Update reference file(s)
	shell.mkdir('-p', '/backup/defaults/exec');
	shell.mkdir('-p', '/backup/defaults/xtrn');
	shell.mkdir('-p', '/backup/defaults/docs');
	shell.mkdir('-p', '/backup/defaults/ctrl');
	shell.mkdir('-p', '/backup/defaults/text');
	shell.mkdir('-p', '/backup/defaults/web-runemaster');
	shell.mkdir('-p', '/backup/defaults/web-ecweb4');
	shell.cp('-rf', `/sbbs/exec/*`, `/backup/defaults/exec/`);
	shell.cp('-rf', `/sbbs/xtrn.orig/*`, `/backup/defaults/xtrn/`);
	shell.cp('-rf', `/sbbs/docs/*`, `/backup/defaults/docs/`);
	shell.cp('-rf', `/sbbs/ctrl.orig/*`, `/backup/defaults/ctrl/`);
	shell.cp('-rf', `/sbbs/text.orig/*`, `/backup/defaults/text/`);
	shell.cp('-rf', `/sbbs/web.orig/*`, `/backup/defaults/web-runemaster/`);
	shell.cp('-rf', `/sbbs/webv4/*`, `/backup/defaults/web-ecweb4/`);

	// write current version to version.txt file for upgrade tracking
	await fsp.writeFile(`/sbbs/ctrl/version.txt`, currentVersion, 'utf8');
}

async function main() {
	// Initial check for sbbsctrl
	await checkCtrl('/sbbs/ctrl.orig', '/sbbs/ctrl');

	const oldVersion = await getOldVersion();
	const currentVersion = await getCurrentVersion() || 'Unknown';

	if (oldVersion !== currentVersion) {
		await upgrade({ currentVersion })
	}

	// Add read-write permissions for all on volume data
	shell.chmod('-R', '+rw', '/backup');
	shell.chmod('-R', '+rw', '/sbbs/ctrl');
	shell.chmod('-R', '+rw', '/sbbs/data');
	shell.chmod('-R', '+rw', '/sbbs/fido');
	shell.chmod('-R', '+rw', '/sbbs/xtrn');
	shell.chmod('-R', '+rw', '/sbbs/mods');
	shell.chmod('-R', '+rw', '/sbbs/text');
	shell.chmod('-R', '+rw', '/sbbs/web');
}

main()
	.then(() => process.exit(0))
	.catch(error => {
		console.error(error);
		process.exit(1); // error
	});