export const enum ERROR {
  MISSING_QUERY_PARAMS = 'Request must include query parameters for filename, width, and height',
  WIDTH_HEIGHT_INVALID = 'width and height must be valid numbers',
  FILE_NOT_FOUND = "File doesn't exist at path ",
  RESIZE_ERROR = 'Error ocurred while attempting to resize file',
  INVALID_EXT = ' File extension not supported',
  MKDIR_ERROR = 'Error ocurred while attempting to create directory',
}
