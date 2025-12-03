// ----------------------------------------------------
  // SEND FEEDBACK
  // ----------------------------------------------------
  async function sendFeedback(e) {
    e.preventDefault();
    if (!fbEmail || !fbMessage) return;

    setFbLoading(true);
    try {
      await api.post("/api/feedback", { 
        email: fbEmail, 
        message: fbMessage,
        postId: post.id // <--- SENDING THE ID HERE
      });
      setFbSent(true);
      setFbEmail("");
      setFbMessage("");
    } catch (err) {
      alert("Failed to send feedback. Please try again.");
    } finally {
      setFbLoading(false);
    }
  }