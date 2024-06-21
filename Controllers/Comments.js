import Comment from "../Models/Comments.js";
import Temple from "../Models/Temples.js";

// Create a new comment
export const createComment = async (req, res) => {
  try {
    const { templeId, user, content } = req.body;

    const temple = await Temple.findById(templeId);
    if (!temple) {
      return res.status(404).json({ message: "Temple not found" });
    }

    const comment = new Comment({
      temple: templeId,
      user,
      content,
    });

    const savedComment = await comment.save();
    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all comments for a specific temple
export const getCommentsByTemple = async (req, res) => {
  try {
    const { templeId } = req.params;

    const comments = await Comment.find({ temple: templeId, approved: true });

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// get all comments
export const getAllComments = async (req, res) => {
  try {
    // Fetch all comments from the database
    const comments = await Comment.find(); // Assuming 'user' is the reference field for the user who posted the comment
    const templeIds = comments.map((comment) => comment.templeId); // Extract templeIds from comments

    // Fetch temples corresponding to the templeIds
    const temples = await Temple.find({ _id: { $in: templeIds } });

    // Map temple names to comments
    const commentsWithTempleNames = comments.map((comment) => {
      const temple = temples.find(
        (temple) => String(temple._id) === String(comment.templeId)
      );
      return {
        ...comment._doc,
        templeName: temple ? temple.title : "Unknown Temple",
      };
    });

    res.status(200).json({
      success: true,
      status: 200,
      data: { comments: commentsWithTempleNames },
    });
  } catch (error) {
    console.error("Error fetching comments:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch comments" });
  }
};

// Approve a comment
export const approveComment = async (req, res) => {
  try {
    const { commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    comment.approved = true;
    const updatedComment = await comment.save();

    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const submitComment = async (req, res) => {
  try {
    const { templeId, name, email, message } = req.body;
    console.log(templeId, "tempId");

    // Check if a comment with the same email and templeId already exists
    const existingComment = await Comment.findOne({ templeId, email });
    if (existingComment) {
      console.log(existingComment.templeId.toString(), "existing");
      return res
        .status(400)
        .json({ message: "Your comment is already submitted" });
    }

    // If no existing comment is found, proceed to create a new one
    const newComment = new Comment({ templeId, name, email, message });
    await newComment.save();
    res.status(201).json({ message: "Comment submitted successfully" });
  } catch (error) {
    console.log(error);
    if (error.code === 11000) {
      res.status(400).json({ message: "Your comment is already submitted" });
    } else {
      res.status(500).json({ error: "Failed to submit comment" });
    }
  }
};

// Get approved comments
export const getApprovedComments = async (req, res) => {
  try {
    const { templeId } = req.params;
    const comments = await Comment.find({ templeId, approved: true });
    res.status(200).json({ comments });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comments" });
  }
};
// Delete comment controller
export const deleteComment = async (req, res) => {
  const { commentId } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    res.status(200).json({
      success: true,
      status: 200,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete comment" });
  }
};

// Update comment controller
export const updateComment = async (req, res) => {
  const { id, ...updatedFields } = req.body;

  try {
    const updatedComment = await Comment.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });

    if (!updatedComment) {
      return res
        .status(404)
        .json({ success: false, message: "Comment not found" });
    }

    res.status(200).json({ success: true, status: 200, data: updatedComment });
  } catch (error) {
    console.error("Error updating comment:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to update comment" });
  }
};
