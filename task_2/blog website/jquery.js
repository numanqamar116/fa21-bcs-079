$(document).ready(function() {
    // Form submission handling
    $('#form').submit(function(event) {
       
        event.preventDefault();

        var postId = $('#form').data('postId');
        if (postId) {
     
            updateBlogPost(postId);
        } else {
           
            createBlogPost();
        }
    });

    function fetchBlogData() {
        $.ajax({
            url: 'https://64d931f9e947d30a2609fc6f.mockapi.io/blog',
            type: 'GET',
            success: function(data) {
                
                $('.sub-main-blogs-section').empty();

              
                data.forEach(function(post) {
                    var postElement = `
                        <div class="single-recently-blog">
                            <img class="recently-blog-image" src="${post.image}" alt="">
                            <div class="feature-this-month-blog-details recently">
                                <span class="this-month-blog-category recently">Lifestyle</span>
                                <h1 class="this_month-blog-title recently">${post.title}</h1>
                                <div class="blog-sub-details recently">
                                    <span class="blog-sub-details-section">
                                        <img class="author_image" src="./assets/author.jpg" alt=""> ${post.author}&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                                    </span>
                                    <span class="blog-sub-details recently">
                                        <span class="blog-sub-details-section">
                                            <i class="fa-regular fa-calendar"></i>&nbsp;&nbsp;${post.date}&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                                        </span>
                                        <span class="blog-sub-details recently">
                                            <span class="blog-sub-details-section">
                                                <i class="fa-regular fa-clock"></i>&nbsp;&nbsp;3 min. to read
                                            </span>
                                        </span>
                                    </span>
                                </div>
                                <div class="this-month-blog-description recently">
                                    ${post.text}
                                </div>
                                <div class="blog-buttons">
                                    <button class="delete-btn btn btn-secondary" data-id="${post.id}">Delete</button>
                                    <button class="update-btn btn btn-secondary" data-id="${post.id}">Update</button>
                                </div>
                            </div>
                        </div>
                    `;
                    $('.sub-main-blogs-section').append(postElement);
                });

                
                $('.delete-btn').click(function() {
                    var postId = $(this).data('id');
                    deleteBlogPost(postId);
                });

               
                $('.update-btn').click(function() {
                    var postId = $(this).data('id');
            
                    populateFormFields(postId);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching blog data:', error);
            }
        });
    }


    function deleteBlogPost(postId) {
        $.ajax({
            url: 'https://64d931f9e947d30a2609fc6f.mockapi.io/blog/' + postId,
            type: 'DELETE',
            success: function(response) {
               
                fetchBlogData();
            },
            error: function(xhr, status, error) {
                console.error('Error deleting blog post:', error);
            }
        });
    }

    
    function populateFormFields(postId) {
        $.ajax({
            url: 'https://64d931f9e947d30a2609fc6f.mockapi.io/blog/' + postId,
            type: 'GET',
            success: function(post) {
                $('#ititle').val(post.title);
                $('#iemail').val(post.author);
                $('#idate').val(post.date);
                $('#iimage').val(post.image);
                $('#imessage').val(post.text);
                
                $('#form').data('postId', postId);
            },
            error: function(xhr, status, error) {
                console.error('Error fetching blog post details:', error);
            }
        });
    }

    function createBlogPost() {
        var postData = {
            title: $('#ititle').val(),
            author: $('#iemail').val(),
            date: $('#idate').val(), 
            image: $('#iimage').val(),
            text: $('#imessage').val()
        };
    
        $.ajax({
            url: 'https://64d931f9e947d30a2609fc6f.mockapi.io/blog',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function(response) {
        
                $('#form')[0].reset();
                
                fetchBlogData();
            },
            error: function(xhr, status, error) {
                console.error('Error publishing blog post:', error);
            }
        });
    }


    function updateBlogPost(postId) {
        var updateData = {
            title: $('#ititle').val(),
            author: $('#iemail').val(),
            date: $('#idate').val(),
            image: $('#iimage').val(),
            text: $('#imessage').val()
        };

        $.ajax({
            url: 'https://64d931f9e947d30a2609fc6f.mockapi.io/blog/' + postId,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updateData),
            success: function(response) {
            
                $('#form')[0].reset();
    
                $('#form').removeData('postId');
               
                fetchBlogData();
               
                location.reload();
            },
            error: function(xhr, status, error) {
                console.error('Error updating blog post:', error);
            }
        });
    }

    fetchBlogData();
});
