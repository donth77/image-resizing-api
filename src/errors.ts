export const enum ERROR {
  MISSING_QUERY_PARAMS = 'Request must include query parameters for url, width, and height',
  WIDTH_HEIGHT_INVALID = 'width and height must be valid numbers',
  FILE_NOT_FOUND = "File doesn't exist at path ",
  RESIZE_ERROR = 'Error ocurred while attempting to resize file',
  DOWNLOAD_ERROR = 'Error ocurred while attempting to download file',
  IMAGE_MISSING = 'Missing downloaded image',
  INVALID_EXT = ' File extension not supported',
  MKDIR_ERROR = 'Error ocurred while attempting to create directory',
}
