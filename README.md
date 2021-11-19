# visdiff

This tool allows you to generate screenshots in various screen widths for a list of page urls. Having created a baseline set of 'golden' images, subsequent runs will capture current images and compare at pixel level for any differences.

This is currently a command line tool, but can be converted fairly easily to run unit tests as part of a CI/CD chain.

## Installation

```javascript
npm install
```

## Creating a baseline set of screenshots

Prior to running comparison tests you must create a set of refernce or 'golden' snapshot images for the list of urls. This should be repeated any time the url list changes, or a page is materially changed and needs to be added into the golden set.

The following command will create baseline images in a sub-folder named `screenshots-golden`:

```javascript
npm run baseline
```

## Comparing pages

The following command will make snapshots of all pages in supplied list, for every viewport width, writing images to a sub-folder named `screenshots` and visually comparing them to golden counterparts:

```javascript
npm run start
```

For any file that has a difference of one or more pixels, the page is logged and a PNG file is produced in the `diffs` folder, which visually highlights the difference as red pixels on a pale, grayscale background.
