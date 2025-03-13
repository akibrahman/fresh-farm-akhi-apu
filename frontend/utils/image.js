const getImageURL = (image) => {
  return image ? "../.." + image : "/images/default.jpg";
};

export default getImageURL;
