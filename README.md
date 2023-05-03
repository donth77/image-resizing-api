# Image Processing API

## Running Locally

### Dev Server

1. `npm install`
2. `npm start`

### Build Server

1. `npm install && npm run build`
2. `npm start dist/index`

Then, load http://localhost:3000/api in a browser or use an HTTP client.

## Testing

Run the command
`npm run test`

### `imageSpec.ts`

This file has unit tests for the image helper functions that wrap the sharp library

### `imagesEndpointSpec.ts`

This file contains endpoint tests for the `GET /api/images` endpoint

## Format and ESLint

Run the command
`npm run format && npm run lint`

## Endpoints

### `GET /api/images?filename=<filename>&width=<width>&height=<height>&ext=<ext>`

Takes an input image in the `src/assets/full` directory and and writes an output image to the `src/assets/thumb/` directory.

#### filename - Required

The name for the file of the input image. If a file extension is not included, `.jpg` is used as the default.
Image assets for `filename` must be in the `src/assets/full` directory.

#### width, height - Required

Specify the dimensions to resize the image. Must be valid numbers.

#### ext - Optional

The file extension of the output image. `jpg`, `jpeg`, `png`, `gif`, and `webp` are supported. If not specified, the default will be `jpg`.

## Examples

Resizes the `fjord.jpg` image to 200x200 and outputs `fjord-200x200.jpg` to the`src/assets/thumb/` directory:

```
http://localhost:3000/api/images?filename=fjord&width=200&height=200
```

Resizes the `fjord.jpg` image to 200x200 and outputs `fjord-200x200.png` to the `src/assets/thumb/` directory:

```
http://localhost:3000/api/images?filename=fjord.jpg&width=200&height=200&ext=png
```

Resizes the `nicolascage.png` image to 400x400 and outputs `nicolascage-400x400.webp` to the `src/assets/thumb/` directory:

```
http://localhost:3000/api/images?filename=nicolascage.png&width=400&height=400&ext=webp
```
