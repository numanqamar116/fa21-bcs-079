$(document).ready(function() {

    function fetchRegularBlogData0() {
        $.ajax({
            url: '/regularBlogs',
            type: 'GET',
            success: function(data) {
           
                console.log('Regular blog data:', data);
                
               
                
            },
            error: function(xhr, status, error) {
                console.error('Erroroooo fetching regular blog data:', error);
            }
        });
    }
 fetchRegularBlogData0();


 var limitPerPage = 6; 
 var currentPage = 1;

 
 var urlParams = new URLSearchParams(window.location.search);
 var page = parseInt(urlParams.get('page')); 


 if (!isNaN(page) && page > 0) {
     currentPage = page;
 }

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
            totalRegularBlogs = data.totalCount;
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
                                    <img class="author_image" src="./assets/author.png" alt=""> ${firstName.charAt(0).toUpperCase() + firstName.slice(1)}&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
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


 function generateNavigationButtons(currentPage, totalItems, limitPerPage) {
     var totalPages = Math.ceil(totalItems / limitPerPage);
     var $pageNavigation = $('.page-navigation-buttons');
     $pageNavigation.empty();

     if (totalPages > 1) {
         
         var $prevButton = $('<button class="prev-button" type="button"><i class="fa-solid fa-arrow-left"></i>&nbsp;&nbsp;&nbsp;Prev</button>');
         $prevButton.on('click', function() {
             if (currentPage > 1) {
                 fetchRegularBlogData(currentPage - 1);
             }
         });
         $pageNavigation.append($prevButton);

    
         for (var i = 1; i <= totalPages; i++) {
             var $numButton = $('<button class="num-btn" type="button">' + i + '</button>');
             $numButton.on('click', { pageNumber: i }, function(event) {
                 fetchRegularBlogData(event.data.pageNumber);
             });
             $pageNavigation.append($numButton);
         }

         
         var $nextButton = $('<button class="next-button" type="button">Next &nbsp;&nbsp;&nbsp;<i class="fa-solid fa-arrow-right"></i></button>');
         $nextButton.on('click', function() {
             if (currentPage < totalPages) {
                 fetchRegularBlogData(currentPage + 1);
             }
         });
         $pageNavigation.append($nextButton);
     }
 }


 fetchRegularBlogData(1);

 
 $(document).on('click', '.recently-blog-image', function() {
     const postId = $(this).data('id');
     window.location.href = `http://localhost:7878/blog-page/${postId}`;
 });


    function fetchThisMonthBlogs() {
        $.ajax({
            url: '/blogs',
            type: 'GET',
            success: function(data) {
                $('.left-feature-this-month').empty();
                var isFirstPost = true; 
                data.forEach(function(post) {
                    if (post.type === 'this-month') {
                        const firstName = post.author.name.split(' ')[0];
                            
                            const limitedTextBody = post.textBody.split(' ').slice(0, 15).join(' ');
                           
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
                                                <img class="author_image" src="./assets/author.png" alt=""> ${firstName.charAt(0).toUpperCase() + firstName.slice(1)}&nbsp;&nbsp;&nbsp;|
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
                        isFirstPost = false; 
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
    
        $(this).addClass('hovered-image');
    }).on('mouseleave', '.recently-blog-image', function() {
     
        $(this).removeClass('hovered-image');
    });
    $(document).on('click', '.this_month-blog-title,.dummy-image-1', function() {
        const postId = $(this).data('id');
        window.location.href = `http://localhost:7878/blog-page/${postId}`;
    });

    var isPopularTitleAppended = false; 
    function fetchPopularBlogs() {
        $.ajax({
            url: '/blogs',
            type: 'GET',
            success: function(data) {
                $('.right-feature-this-month').empty();
                var popularPosts = data.filter(post => post.isFeatured === true);
 
                popularPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
                popularPosts = popularPosts.slice(0, 4); 
       
                if (!isPopularTitleAppended) {
                    $('.right-feature-this-month').append(`
                        <h1 class="title-this-month recently"><span class="feature-word">Featured</span>&nbsp;Posted</h1>
                    `);
                    isPopularTitleAppended = true; 
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
                                        <img class="author_image" src="./assets/author.png" alt=""> ${post.author.name.charAt(0).toUpperCase() + post.author.name.slice(1)}&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
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



