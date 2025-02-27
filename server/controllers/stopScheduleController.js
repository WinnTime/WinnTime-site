const tracker = async (req, res) => {
    try {
     console.log("hello");
    }
    catch (err) {
        console.error("Error hello in:", err);
        return res.status(500).json({ message: "An error occurred" });
      }
  };
  
  module.exports = {
    tracker,
  };