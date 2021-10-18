async function deletePostHandler(event) {
  event.preventDefault();
  
  userId = document.location.pathname.split('/')[
    document.location.pathname.split('/').length - 1
  ];
  
  const response = await fetch(`/api/posts/${userId}`, {method: 'DELETE'});

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  }
}

document.querySelector('.delete-post-btn').addEventListener('click', deletePostHandler);