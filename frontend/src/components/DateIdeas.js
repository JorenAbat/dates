const handleUpdateIdea = async (e) => {
  e.preventDefault();
  try {
    console.log('Current user:', currentUser);
    console.log('Editing idea:', editingIdea);
    if (!editingIdea || !editingIdea.dateId) {
      console.error('No idea selected for editing or missing dateId');
      return;
    }
    const updateData = {
      content: editingIdea.content,
      userId: currentUser.id,
      username: currentUser.username
    };
    console.log('Sending update data:', updateData);
    await updateDateIdea(editingIdea.dateId, updateData);
    setEditingIdea(null);
    setEditContent('');
    fetchDateIdeas();
  } catch (error) {
    console.error('Error updating date idea:', error);
  }
};

const handleEditClick = (idea) => {
  setEditingIdea(idea);
  setEditContent(idea.content);
}; 