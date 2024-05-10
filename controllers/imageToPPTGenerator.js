const fs = require("fs");
const officegen = require("officegen");
const axios = require("axios");
const sqlServices = require("../services/sqlServices");

module.exports = {
  generatePPT: async (req, res) => {
    try {
      //const id = [1, 8, 3, 2, 10, 11, 12, 13];
      const ids = [1,2];

      const imageURLs = await sqlServices.getImageURL(ids).catch((error) => {
        console.error(`Error fetching image URLs: ${error}`);
        throw new Error("Failed to fetch image URLs");
      });

      const imageDataPromises = imageURLs.map(async (imageURL) => {
        const response = await axios.get(imageURL, {
          responseType: "arraybuffer",
        });
        return Buffer.from(response.data, "binary");
      });

      const imageData = await Promise.all(imageDataPromises);

      const pptx = officegen("pptx");

      imageData.forEach((data) => {
        const slide = pptx.makeNewSlide();
        const { cx, cy } = getImageDimensions(9.6, 7.15);
        slide.addImage(data, { cx, cy });
      });

      const outputPath = "output_officegen.pptx";
      const outputStream = fs.createWriteStream(outputPath);

      outputStream.on("finish", () => {
        console.log("Presentation created successfully using officegen.");
        res.download(outputPath);
        //      res.send("Presentation created successfully using officegen.");
      });

      pptx.generate(outputStream);
    } catch (err) {
      console.log(`Error caught in generatePPT: ${err}`);
      res.send("Oops! Something went wrong. Please try again later");
    }
  },
};

function getImageDimensions(slideWidth, slideHeight) {
  const pixelsPerInch = 96;
  const slideWidthInPixels = slideWidth * pixelsPerInch;
  const slideHeightInPixels = slideHeight * pixelsPerInch;
  return {
    cx: slideWidthInPixels,
    cy: slideHeightInPixels,
  };
}
