import sharp from "sharp";
import fs from "fs";

const directoryPath = "./src/assets/recipes";

fs.readdir(directoryPath, (err, files) => {
  if (err) {
    console.error("Error reading directory:", err);
    return;
  }

  files.forEach(async (file) => {
    if (file.endsWith(".png")) {
      const inputPath = `${directoryPath}/${file}`;
      const outputName = file.replace(".png", ".webp");
      const outputPath = `${directoryPath}/${outputName}`;

      try {
        await sharp(inputPath)
          .resize(512, 512, { fit: "cover", position: "center" })
          .webp({ quality: 80 })
          .toFile(outputPath);
        console.log(`Converted ${file} to ${outputName}`);
        fs.unlinkSync(inputPath);
      } catch (error) {
        console.error(`Error converting ${file}:`, error);
      }
    }
  });
});
