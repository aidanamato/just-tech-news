async function editFormHandler(event) {
  event.preventDefault();

  userId = document.location.pathname.split('/')[
    document.location.pathname.split('/').length - 1
  ];
  postTitle = document.querySelector('input[name="post-title"]').value;
  console.log(postTitle);

  const response = await fetch(`/api/posts/${userId}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: postTitle
    }),
    headers: {'Content-Type': 'application/json'}
  });

  if (response.ok) {
    document.location.replace('/dashboard');
  } else {
    alert(response.statusText);
  }
}

document.querySelector('.edit-post-form').addEventListener('submit', editFormHandler);