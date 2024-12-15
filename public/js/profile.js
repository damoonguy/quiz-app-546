function toggleDescriptionEdit() {
    document.getElementById('description-display').style.display = 'none';
    document.getElementById('description-edit').style.display = 'block';
}

function cancelEdit() {
    const originalText = document.getElementById('description-text').textContent;
    document.getElementById('description-input').value = originalText;
    
    document.getElementById('description-display').style.display = 'block';
    document.getElementById('description-edit').style.display = 'none';
}

function saveDescription() {
    const newDescription = document.getElementById('description-input').value;
    
    fetch('/profile/description', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ description: newDescription })
    })
    .then(response => {
        if (response.ok) {
            document.getElementById('description-text').textContent = newDescription;
            document.getElementById('description-display').style.display = 'block';
            document.getElementById('description-edit').style.display = 'none';
        } else {
            alert('Could not save description');
        }
    })
    .catch(error => {
        alert('Error saving description');
    });
} 