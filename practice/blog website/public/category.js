$(document).ready(function() {
    const texts = ["Unique", "Informative", "Engaging", "Inspiring"];
    let count = 0;
    let index = 0;
    let currentText = '';
    let letter = '';
    const typewriterElement = document.getElementById('typewriter');
    let isDeleting = false;

    function type() {
        if (count === texts.length) {
            count = 0;
        }
        currentText = texts[count];

        if (isDeleting) {
            letter = currentText.slice(0, --index);
        } else {
            letter = currentText.slice(0, ++index);
        }

        typewriterElement.textContent = letter;
        typewriterElement.style.opacity = 1;

        if (!isDeleting && letter.length === currentText.length) {
            setTimeout(() => {
                isDeleting = true;
                setTimeout(type, 100); // Start deleting
            }, 2000); // Pause before starting to delete
        } else if (isDeleting && letter.length === 0) {
            isDeleting = false;
            count++;
            setTimeout(type, 500); // Start typing next word
        } else {
            setTimeout(type, isDeleting ? 50 : 100); // Adjust speed for typing and deleting
        }
    }

    type();

    var category = "<%= category %>";
    console.log(category);

    function fetchCategoryData(category) {
        $.ajax({
            url: '/blogs', // Assuming this route is defined in your Express app
            type: 'GET',
            success: function(data) {
                $('.sub-main-blogs-section').empty();
                console.log('my category', data);
                data.forEach(function(post) {
                    // Construct post element
                    var truncatedText = post.textBody.split(' ').slice(0, 30).join(' ');
                    if (post.textBody.split(' ').length > 30) {
                        truncatedText += '...';
                    }

                    if (post.category.toUpperCase() === category.toUpperCase()) {
                        var postElement = `
                            <div class="single-recently-blog">
                                <img style="cursor:pointer" class="recently-blog-image" data-id="${post._id}" src="${post.image}" alt="">
                                <div class="feature-this-month-blog-details recently">
                                    <span class="this-month-blog-category recently">${post.category}</span>
                                    <h1 class="this_month-blog-title recently" data-id="${post._id}">${post.title}</h1>
                                    <div class="blog-sub-details recently">
                                        <span class="blog-sub-details-section">
                                            <img class="author_image" src="./assets/author.jpg" alt=""> ${post.author.name}&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
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
                               
                                </div>
                            </div>
                        `;
                        $('.sub-main-blogs-section').append(postElement);
                    }
                });
            },
            error: function(err) {
                console.error('Error fetching data:', err);
            }
        });
    }

    // Fetch data on initial page load
    fetchCategoryData(category);
});

// Handle click events on blog images and titles
$(document).on('click', '.recently-blog-image, .this_month-blog-title', function() {
    const postId = $(this).data('id');
    window.location.href = `http://localhost:7878/blog-page/${postId}`;
});

