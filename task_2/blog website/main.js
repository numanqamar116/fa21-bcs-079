 $(document).ready(function() {

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
                            </div>
                        </div>
                    `;
                    $('.sub-main-blogs-section').append(postElement);
                });
            },
            error: function(xhr, status, error) {
                console.error('Error fetching blog data:', error);
            }
        });
    }

    fetchBlogData();
});