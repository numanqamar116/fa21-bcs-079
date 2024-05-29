$(document).ready(function () {
    let imessageEditor;

   
    ClassicEditor
        .create(document.querySelector('#imessage'), {
            toolbar: {
                items: [
                    'heading',
                    '|',
                    'bold',
                    'italic',
                    '|',
                    'link',
                    'bulletedList',
                    'numberedList',
                    '|',
                    'undo',
                    'redo'
                ]
            }
        })
        .then(editor => {
            console.log('Blog Content Editor initialized', editor);
            imessageEditor = editor;
        })
        .catch(error => {
            console.error('There was a problem initializing the blog content editor.', error);
        });

    
    $('#form').on('submit', function (event) {
        event.preventDefault();

        
        let isValid = true;

        
        if ($('#ititle').val().trim() === '') {
            $('#ititle').next('.error').text('Title is required');
            isValid = false;
            
        } else {
            $('#ititle').next('.error').text('');
        }

        if ($('#idate').val().trim() === '') {
            $('#idate').next('.error').text('Date is required');
            isValid = false;
        } else {
            $('#idate').next('.error').text('');
        }

        if ($('#iduration').val().trim() === '') {
            $('#iduration').next('.error').text('Duration is required');
            isValid = false;
        } else {
            $('#iduration').next('.error').text('');
        }

        if ($('#iauthor_intro').val().trim() === '') {
            $('#iauthor_intro').next('.error').text('Author introduction is required');
            isValid = false;
        } else {
            $('#iauthor_intro').next('.error').text('');
        }

        if ($('#iimage').val().trim() === '') {
            $('#iimage').next('.error').text('Image URL is required');
            isValid = false;
        } else {
            $('#iimage').next('.error').text('');
        }

        if ($('#itype').val() === null) {
            $('#itype').next('.error').text('Post type is required');
            isValid = false;
        } else {
            $('#itype').next('.error').text('');
        }

        if ($('#icategory').val() === null) {
            $('#icategory').next('.error').text('Post category is required');
            isValid = false;
        } else {
            $('#icategory').next('.error').text('');
        }

        if (imessageEditor.getData().trim() === '') {
            $('#imessage').next('.error').text('Blog content is required');
            isValid = false;
        } else {
            $('#imessage').next('.error').text('');
        }

        if (!isValid) {
            return;
        }

        var postId = $('#form').data('postId');
        if (postId) {
            updateBlogPost(postId);
        } else {
            createBlogPost();
        }
    });

    var totalBlogs = 0;
    var limitPerPage = 6; 

    $.ajax({
        url: '/authorsBlogs',
        type: 'GET',
        success: function (data) {
            totalBlogs = data.length;
            console.log('Total blogs:', totalBlogs);
        }
    });

    var urlParams = new URLSearchParams(window.location.search);
    console.log('URL Query String:', window.location.search); 
    var page = urlParams.get('page'); 
    console.log('Page Number:', page);

   
    fetchBlogData(page);

    function fetchBlogData(page) {
        var pageNumber = page || 1;
        var skip = (pageNumber - 1) * limitPerPage; 
        var url = '/authorsBlogs?page=' + pageNumber + '&limit=' + limitPerPage;

        $.ajax({
            url: url,
            type: 'GET',
            success: function (data) {
                $('.sub-main-blogs-section').empty();
                data.forEach(function (post) {
                    var truncatedText = post.textBody.split(' ').slice(0, 30).join(' ');
                    if (post.textBody.split(' ').length > 30) {
                        truncatedText += '...';
                    }
                    var postElement = `
                        <div class="single-recently-blog">
                            <img class="recently-blog-image" style="cursor:pointer !important" data-id="${post._id}" src="${post.image}" alt="">
                            <div class="feature-this-month-blog-details recently">
                                <span class="this-month-blog-category recently">${post.category}</span>
                                <h1 class="this_month-blog-title recently" data-id="${post._id}">${post.title}</h1>
                                <div class="blog-sub-details recently">
                                    <span class="blog-sub-details-section">
                                        <img class="author_image" src="./assets/author.png" alt=""> ${post.author.name}&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                                    </span>
                                    <span class="blog-sub-details recently">
                                        <span class="blog-sub-details-section">
                                            <i class="fa-regular fa-calendar"></i>&nbsp;&nbsp;${post.date}&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                                        </span>
                                        <span class="blog-sub-details recently">
                                            <span class="blog-sub-details-section">
                                                <i class="fa-regular fa-clock"></i>&nbsp;&nbsp;${post.duration} min. to read
                                            </span>
                                        </span>
                                    </span>
                                </div>
                                <div class="this-month-blog-description recently">
                                    ${truncatedText}
                                </div>
                                <div class="blog-buttons">
                                    <button class="delete-btn btn btn-secondary" data-id="${post._id}">Delete</button>
                                    <button class="update-btn btn btn-secondary" data-id="${post._id}">Update</button>
                                </div>
                            </div>
                        </div>
                    `;
                    $('.sub-main-blogs-section').append(postElement);
                });
                generateNavigationButtons(pageNumber);

                $('.delete-btn').on('click', function () {
                    var postId = $(this).data('id');
                    deleteBlogPost(postId);
                });

                $('.update-btn').on('click', function () {
                    var postId = $(this).data('id');
                    populateFormFields(postId);
                    
                    $('html, body').animate({ scrollTop: 0 }, 'slow');
                });

               
                if (window.location.pathname === '/editBlog') {
                    var newUrl = window.location.pathname + '?page=' + pageNumber;
                    window.history.pushState({ path: newUrl }, '', newUrl);
                }
            },
            error: function (xhr, status, error) {
                console.error('Error fetching blog data:', error);
            }
        });
    }

    $(document).on('click', '.recently-blog-image,.this_month-blog-title', function () {
        const postId = $(this).data('id');
        window.location.href = `http://localhost:7878/blog-page/${postId}`;
    });

    function deleteBlogPost(postId) {
        $.ajax({
            url: '/blogs/' + postId,
            type: 'DELETE',
            success: function (response) {
                fetchBlogData(page);
                showAlert('success', 'Blog post deleted successfully!');
            },
            error: function (xhr, status, error) {
                console.error('Error deleting blog post:', error);
            }
        });
    }

    function createBlogPost() {
        var postData = {
            title: $('#ititle').val(),
            author: {
                name: $('#iemailo').val().toLowerCase()
            },
            date: $('#idate').val(),
            image: $('#iimage').val(),
            textBody: imessageEditor.getData(), 
            duration: $('#iduration').val(), 
            author_intro: $('#iauthor_intro').val(), 
            type: $('#itype').val(),
            category: $('#icategory').val()
        };

        $.ajax({
            url: '/blogs',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(postData),
            success: function (response) {
                $('#form')[0].reset();
                fetchBlogData(page);
              
                showAlert('success', 'Blog post created successfully!');
            },
            error: function (xhr, status, error) {
                console.error('Error publishing blog post:', error);
            }
        });
    }
  
    function updateBlogPost(postId) {
        var updateData = {
            title: $('#ititle').val(),
            date: $('#idate').val(),
            image: $('#iimage').val(),
            textBody: imessageEditor.getData(), 
            duration: $('#iduration').val(), 
            author_intro: $('#iauthor_intro').val(), 
            type: $('#itype').val(),
            category: $('#icategory').val()
        };

        $.ajax({
            url: '/blogs/' + postId,
            type: 'PUT',
            contentType: 'application/json',
            data: JSON.stringify(updateData),
            success: function (response) {
                $('#form')[0].reset();
                $('#form').removeData('postId');
                fetchBlogData(page);
                location.reload();
                showAlert('success', 'Blog post updated successfully!');
            },
            error: function (xhr, status, error) {
                console.error('Error updating blog post:', error);
            }
        });
    }

    function generateNavigationButtons(currentPage) {
        var totalPages = Math.ceil(totalBlogs / limitPerPage);
        var $pageNavigation = $('.page-navigation-buttons');
        $pageNavigation.empty();

        if (totalPages > 1) {
            
            var $prevButton = $('<div style="margin-top: 2vw"><button class="prev-button" type="button"><i class="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;Prev</button></div>');
            $prevButton.on('click', function () {
                if (currentPage > 1) {
                    fetchBlogData(currentPage - 1);
                    scrollToTop();
                }
            });
            $pageNavigation.append($prevButton);

           
            for (var i = 1; i <= totalPages; i++) {
                var $numButton = $('<button style="margin-top: 2vw" class="num-btn" type="button">' + i + '</button>');
                $numButton.on('click', { pageNumber: i }, function (event) {
                    fetchBlogData(event.data.pageNumber);
                    scrollToTop();
                });
                $pageNavigation.append($numButton);
            }

       
            var $nextButton = $('<button style="margin-top: 2vw" class="next-button" type="button">Next &nbsp;&nbsp;&nbsp;<i class="fa-solid fa-arrow-right"></i></button>');
            $nextButton.on('click', function () {
                if (currentPage < totalPages) {
                    fetchBlogData(currentPage + 1);
                    scrollToTop();
                }
            });
            $pageNavigation.append($nextButton);
        }
    }

    function scrollToTop() {
        $('html, body').animate({ scrollTop: 0 }, 'slow');
    }

    function populateFormFields(postId) {
        $.ajax({
            url: '/blogs/' + postId,
            type: 'GET',
            success: function (post) {
                $('#ititle').val(post.title);
                $('#iemail').val(post.author.name);
                $('#idate').val(post.date);
                $('#iimage').val(post.image);
                imessageEditor.setData(post.textBody); 
                $('#iduration').val(post.duration); 
                $('#iauthor_intro').val(post.author_intro); 
                $('#itype').val(post.type);
                $('#icategory').val(post.category);
                $('#form').data('postId', postId);
            },
            error: function (xhr, status, error) {
                console.error('Error fetching blog post details:', error);
            }
        });
    }

    fetchBlogData(page);

    function showAlert(type, message) {

        $('.alert').remove();
    
        
        var alertElement = $('<div class="alert alert-' + type + '" role="alert">' + message + '</div>');
        $('#form').prepend(alertElement);
    
       
        setTimeout(function () {
            alertElement.fadeOut('slow', function () {
                $(this).remove();
            });
        }, 3000);
    }
});