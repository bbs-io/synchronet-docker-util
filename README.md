# Synchronet Dockerized

<span class="badge-github-ci"><a href="https://github.com/bbsio/synchronet-docker-util" title="Check this project on Github"><img src="https://github.com/bbs-io/synchronet-docker-util/actions/workflows/npm-publish-tags.yml/badge.svg" alt="Github CI Status" /></a></span>
<span class="badge-npmversion"><a href="https://npmjs.org/package/@bbs/synchronet" title="View this project on NPM"><img src="https://img.shields.io/npm/v/@bbs/synchronet.svg" alt="NPM version" /></a></span>
<span class="badge-npmdownloads"><a href="https://npmjs.org/package/@bbs/synchronet" title="View this project on NPM"><img src="https://img.shields.io/npm/dm/@bbs/synchronet.svg" alt="NPM downloads" /></a></span>
<img alt="Libraries.io dependency status for latest release, scoped npm package" src="https://img.shields.io/librariesio/release/npm/@bbs/synchronet">

This is meant to be run from a unix-like (bash) environment.
This package will use `~/sbbs` as the base for data/configuration.

## WORK IN PROGRESS

**WARNING**: This is a work in progress.

#### References

- [Synchronet Wiki](http://wiki.synchro.net/)
- [Synchronet on Docker Hub](https://hub.docker.com/repository/docker/bbsio/synchronet)

## Prerequisite Software

You must have the following installed in order to run this application.

- Docker
- Docker Compose
- [Node.js](https://nodejs.org/en/) _(14.x)_

### Windows

If you are using Windows, you should install WSL2, and use Docker
Desktop configured to use WSL2, and it would be best to run this
from a WSL2 linux environment such as Ubuntu 20.04.

## Installation

The container name will be `sbbs` and the image will be `bbsio/synchronet:latest`

```
npm i -g @bbs/synchronet
synchronet install
```

### Mac

If you are using mac, you should modify the dockerfile to use a
volume container in docker (instructions out of scope).

## Management Commands

- `synchronet help` - Display Help
- `synchronet init` - Initialize Setup - does not install container (creates `~/sbbs/*`)
- `synchronet install` - Initialize and install/upgrade container
- `synchronet uninstall` - Uninstall container - does not clear ~/sbbs
- `synchronet run PROGRAM [...args]` - Run command inside a temporary container
- `synchronet access` - Fix file permissions for `~/sbbs/*`. Do this before editing content.
- `synchronet doorparty` - Install Doorparty Connector and Doors

### Runtime Commands

The following commands require that sbbs be installed/running in the `sbbs` docker container.

- `synchronet exec PROGRAM [...args]` - Run a command inside the installed container
- `synchronet scfg` - Load scfg
- `synchronet bash` - Bash prompt in container
- `synchronet dos` - (TODO) DOSEMU prompt in container
- `synchronet logs [OPTIONS]` - See below

### Logs

Options:

- `--details` - Show extra details provided to logs
- `-f`, `--follow` - Follow log output
- `--since TIME` - Show logs since timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes)
- `-n NUM`, `--tail NUM` - Number of lines to show from the end of the logs (default "all")
- `-t`, `--timestamps` - Show timestamps
- `--until TIME` - Show logs before a timestamp (e.g. 2013-01-02T13:23:37Z) or relative (e.g. 42m for 42 minutes)

## Directories

NOTE: Volume mounted directories will be owned by root as a default. In order
to edit/update these files, you should run `synchronet access` with the `sbbs`
container running.

## Advanced Setup

If you wish to use a directory other than `~/sbbs` for your volume/directory
mounts, set an `SBBSDIR` environment variable to your desired location, for
example, if you wanted to use `/sbbs` on a deployed server, you could do so.
