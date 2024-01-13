export const getImageNameFromUrl = (url: string) => {
  // Example of image url: https://kw-photogram.s3.eu-central-1.amazonaws.com/398310840_1416191592614860_5892750325849203067_n.jpg
  return url.split("amazonaws.com/")[1]!;
};
