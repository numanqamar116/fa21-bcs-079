$(document).ready(function() {

    function fetchRegularBlogData0() {
        $.ajax({
            url: '/regularBlogs',
            type: 'GET',
            success: function(data) {
                // Filter posts where type is "regular"
                
                // Do whatever you want with the regularPosts array here
                console.log('Regular blog data:', data);
                
                // If you want to further process or display the regularPosts array, you can do it here
                
            },
            error: function(xhr, status, error) {
                console.error('Erroroooo fetching regular blog data:', error);
            }
        });
    }
 fetchRegularBlogData0();


 var limitPerPage = 6; // Number of blogs per page
 var currentPage = 1; // Current page number

 // Get the page number from the URL query parameter if available
 var urlParams = new URLSearchParams(window.location.search);
 var page = parseInt(urlParams.get('page')); // Parse page number to integer

 // If the parsed page number is valid, set it as the current page
 if (!isNaN(page) && page > 0) {
     currentPage = page;
 }

 // Function to fetch and display regular blogs with pagination
 function fetchRegularBlogData(currentPage) {
    var skip = (currentPage - 1) * limitPerPage;
    $.ajax({
        url: '/regularBlogs',
        type: 'GET',
        data: {
            skip: skip,
            limit: limitPerPage
        },
        success: function(data) {
            $('.sub-main-blogs-section').empty();
            totalRegularBlogs = data.totalCount; // Assuming the backend sends total count
            data.posts.forEach(function(post) {
                const firstName = post.author.name.split(' ')[0];
                const limitedTextBody = post.textBody.split(' ').slice(0, 30).join(' ');
                const textBodyToShow = post.textBody.split(' ').length > 30 ? limitedTextBody + "..." : post.textBody;
                var postElement = `
                    <div data-aos="fade-up"
                    data-aos-duration="2000" class="single-recently-blog">
                    
                        <img style="cursor:pointer" class="recently-blog-image" src="${post.image}" alt="" data-id="${post._id}">
                        <div class="feature-this-month-blog-details recently">
                            <span class="this-month-blog-category recently">Lifestyle</span>
                            <h1 class="this_month-blog-title recently" data-id="${post._id}">${post.title}</h1>
                            <div class="blog-sub-details recently">
                                <span class="blog-sub-details-section">
                                    <img class="author_image" src="./assets/author.jpg" alt=""> ${firstName.charAt(0).toUpperCase() + firstName.slice(1)}&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
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
                                ${textBodyToShow}
                            </div>
                        </div>
                    </div>
                `;
                $('.sub-main-blogs-section').append(postElement);
            });
            generateNavigationButtons(currentPage, totalRegularBlogs, limitPerPage);
            if (window.location.pathname === '/' || window.location.pathname === '/home') {
                var newUrl = window.location.pathname + '?page=' + currentPage;
                window.history.pushState({ path: newUrl }, '', newUrl);
            }
        },
        error: function(xhr, status, error) {
            console.error('Error fetching regular blog data:', error);
        }
    });
}

 // Function to generate pagination buttons
 function generateNavigationButtons(currentPage, totalItems, limitPerPage) {
     var totalPages = Math.ceil(totalItems / limitPerPage);
     var $pageNavigation = $('.page-navigation-buttons');
     $pageNavigation.empty();

     if (totalPages > 1) {
         // Previous button
         var $prevButton = $('<button class="prev-button" type="button"><i class="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;Prev</button>');
         $prevButton.on('click', function() {
             if (currentPage > 1) {
                 fetchRegularBlogData(currentPage - 1);
             }
         });
         $pageNavigation.append($prevButton);

         // Number buttons
         for (var i = 1; i <= totalPages; i++) {
             var $numButton = $('<button class="num-btn" type="button">' + i + '</button>');
             $numButton.on('click', { pageNumber: i }, function(event) {
                 fetchRegularBlogData(event.data.pageNumber);
             });
             $pageNavigation.append($numButton);
         }

         // Next button
         var $nextButton = $('<button class="next-button" type="button">Next &nbsp;&nbsp;&nbsp;<i class="fa-solid fa-arrow-right"></i></button>');
         $nextButton.on('click', function() {
             if (currentPage < totalPages) {
                 fetchRegularBlogData(currentPage + 1);
             }
         });
         $pageNavigation.append($nextButton);
     }
 }

 // Initial call to fetch regular blogs
 fetchRegularBlogData(1);

 // Event listener for recently-blog-image
 $(document).on('click', '.recently-blog-image', function() {
     const postId = $(this).data('id');
     window.location.href = `http://localhost:7878/blog-page/${postId}`;
 });

    
      
    
        // Rest of your code...
  
    

    function fetchThisMonthBlogs() {
        $.ajax({
            url: '/blogs',
            type: 'GET',
            success: function(data) {
                $('.left-feature-this-month').empty();
                var isFirstPost = true; // Flag to check if it's the first post
                data.forEach(function(post) {
                    if (post.type === 'this-month') {
                        const firstName = post.author.name.split(' ')[0];
                            // Limit text body to 30 words
                            const limitedTextBody = post.textBody.split(' ').slice(0, 15).join(' ');
                            // Add "..." if text body is longer than 30 words
                            const textBodyToShow = post.textBody.split(' ').length > 15 ? limitedTextBody + "..." : post.textBody;
                        var postElement = `
                            <div class="feature-this-month-blogs">
                                ${isFirstPost ? '<h1 class="title-this-month"><span class="feature-word">Feature</span>&nbsp;This Month</h1>' : ''}
                                <div class="sub-feature-this-month-blogs" style="background-color: white;">
                                    <div class="feature-this-month-image">
                                        <img style="cursor:pointer" class="dummy-image-1" src="${post.image}" alt="" data-id="${post._id}">
                                    </div>
                                    <div class="feature-this-month-blog-details">
                                        <span class="this-month-blog-category">${post.category}</span>
                                        <h1 class="this_month-blog-title" data-id="${post._id}">${post.title}</h1>
                                        <div class="blog-sub-details">
                                            <span class="blog-sub-details-section">
                                                <img class="author_image" src="./assets/author.jpg" alt=""> ${firstName.charAt(0).toUpperCase() + firstName.slice(1)}&nbsp;&nbsp;&nbsp;|
                                            </span>
                                            <span class="blog-sub-details-section">
                                                <i class="fa-regular fa-calendar"></i>&nbsp;&nbsp;${post.date}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|
                                            </span>
                                            <span class="blog-sub-details-section">
                                                <i class="fa-regular fa-clock"></i>&nbsp;&nbsp;${post.duration} min. to read
                                            </span>
                                        </div>
                                        <div class="this-month-blog-description">
                                            ${textBodyToShow}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        $('.left-feature-this-month').append(postElement);
                        isFirstPost = false; // Set the flag to false after adding the first post
                    }
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching blog data:', error);
            }
        });
    }

    fetchThisMonthBlogs();
    $(document).on('mouseenter', '.recently-blog-image', function() {
        // When mouse enters the image area, apply CSS class to enlarge and fade
        $(this).addClass('hovered-image');
    }).on('mouseleave', '.recently-blog-image', function() {
        // When mouse leaves the image area, remove CSS class to revert to original size and opacity
        $(this).removeClass('hovered-image');
    });
    $(document).on('click', '.this_month-blog-title,.dummy-image-1', function() {
        const postId = $(this).data('id');
        window.location.href = `http://localhost:7878/blog-page/${postId}`;
    });

    var isPopularTitleAppended = false; // Flag to track if the title is appended

    function fetchPopularBlogs() {
        $.ajax({
            url: '/blogs',
            type: 'GET',
            success: function(data) {
                $('.right-feature-this-month').empty();
                var popularPosts = data.filter(post => post.type === 'popular'); // Filter popular type posts
                popularPosts.sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first
                popularPosts = popularPosts.slice(0, 4); // Limit to 4 posts
                
                // Append title if not already appended
                if (!isPopularTitleAppended) {
                    $('.right-feature-this-month').append(`
                        <h1 class="title-this-month recently"><span class="feature-word">Popular</span>&nbsp;Posted</h1>
                    `);
                    isPopularTitleAppended = true; // Set flag to true
                }
    
                popularPosts.forEach(function(post) {
                    var postElement = `
                        <div class="popular-posted-container">
                            <div class="popular-posted-image">
                                <img style="cursor:pointer" class="popular-blog-image" src="${post.image}" alt="" data-id="${post._id}">
                            </div>
                            <div class="popular-blog-details">
                                <span class="this-month-blog-category">${post.category}</span>
                                <h1 class="popular-blog-title " data-id="${post._id}">${post.title}</h1>
                                <div class="popular-sub-details">
                                    <span class="popular-blog-sub-details-section">
                                        <img class="author_image" src="./assets/author.jpg" alt=""> ${post.author.name.charAt(0).toUpperCase() + post.author.name.slice(1)}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                                    </span>
                                    <span class="popular-blog-sub-details">
                                        <span class="popular-blog-sub-details-section">
                                            <i class="fa-regular fa-clock"></i>&nbsp; ${post.duration} min. to read
                                        </span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    `;
                    $('.right-feature-this-month').append(postElement);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching blog data:', error);
            }
        });
    }
    

    fetchPopularBlogs();
    $(document).on('click', '.popular-blog-image,.popular-blog-title', function() {
        const postId = $(this).data('id');
        window.location.href = `http://localhost:7878/blog-page/${postId}`;
    });
    

});



