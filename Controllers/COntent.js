import Content from "../Models/Test.js";

// Save CKEditor content
export const saveContent = async (req, res) => {
  try {
    const { content } = req.body;
    const newContent = new Content({ content });
    await newContent.save();
    res.status(200).json({ message: "Content saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to save content" });
  }
};
export const getAllContent = async (req, res) => {
  try {
    const allContent = await Content.find(); // Assuming Content is your mongoose model
    res.status(200).json(allContent);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({ error: "Failed to fetch content" });
  }
};
