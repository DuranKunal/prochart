(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".sticky-top").css("top", "0px");
    } else {
      $(".sticky-top").css("top", "-100px");
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });

  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Review Form Submit
  $("#review-form").submit(async function (e) {
    e.preventDefault();

    const name = $("#name").val();
    const review = $("#review").val();

    if (name && review) {
      $.ajax({
        url: "https://prochart-backend-default-rtdb.asia-southeast1.firebasedatabase.app/user-review.json",
        type: "POST",
        headers: { "Content-Type": "application/json" },
        data: JSON.stringify({
          name: name,
          review: review,
        }),
        redirect: "follow",
        success: function (response) {
          // Display the success message
          alert("Review submitted successfully");

          // Reset the form
          $("#review-form")[0].reset();
        },
        error: function (error) {
          // Display the error message
          console.error(error);
          alert(
            "Error occured while submitting the review. Please try again later."
          );
        },
      });
    }
  });

  // Admin Testimonials

  // reviews data
  const reviews = [];

  $(document).ready(function () {
    // Range Slider
    var slider = $("#range-slider").slider({
      min: 0,
      max: 1000,
      step: 5,
      value: [0, 1000],
    });

    var sliderLowerValue = $("#range-indicator-left");
    var sliderUpperValue = $("#range-indicator-right");

    // Function to prepare review data
    function prepareReviewData(reviewers) {
      for (const key in reviewers) {
        reviews.push({
          id: key,
          ...reviewers[key],
        });
      }
    }

    // Fetch reviewer data
    $.ajax({
      url: "https://prochart-backend-default-rtdb.asia-southeast1.firebasedatabase.app/admin-review.json",
      type: "GET",
      redirect: "follow",
      success: function (response) {
        // Process and render review boxes
        prepareReviewData(response);
        renderReviews(reviews);
      },
      error: function (error) {
        console.error(error);
      },
    });

    slider.on("slideStop", function (slideEvt) {
      // Get the selected range values
      var lowerLimit = slideEvt.value[0];
      var upperLimit = slideEvt.value[1];

      // Update the range values
      sliderLowerValue.empty();
      sliderUpperValue.empty();
      sliderLowerValue.append(`${lowerLimit}%`);
      sliderUpperValue.append(`${upperLimit}%`);

      // Filter the reviews based on the selected range
      var filteredReviews = reviews.filter(function (review) {
        var profitPer = review.profitPer;
        return profitPer >= lowerLimit && profitPer <= upperLimit;
      });

      // Clear the existing reviews
      $(".review-boxes").empty();

      // Render the filtered reviews
      $.each(filteredReviews, function (index, review) {
        var reviewBox = $("<div>").addClass("review-box");
        var reviewerName = $("<div>")
          .addClass("reviewer-name")
          .text(review.name);
        var reviewScreenshot = $("<div>").addClass("review-screenshot");
        var screenshotImg = $("<img>")
          .attr("src", review.screenshot)
          .attr("alt", "screenshot");
        var profitPer = $("<div>")
          .addClass("profitPer")
          .html("Profit gained: <b>" + review.profitPer + "%</b>");

        reviewScreenshot.append(screenshotImg);
        reviewBox.append(reviewerName, reviewScreenshot, profitPer);
        $(".review-boxes").append(reviewBox);
      });
    });

    // Initial rendering of reviews
  });

  // Function to render reviews
  function renderReviews(reviews) {
    $(".review-boxes").empty();

    $.each(reviews, function (index, review) {
      var reviewBox = $("<div>").addClass("review-box");
      var reviewerName = $("<div>").addClass("reviewer-name").text(review.name);
      var reviewScreenshot = $("<div>").addClass("review-screenshot");
      var screenshotImg = $("<img>")
        .attr("src", review.screenshot)
        .attr("alt", "screenshot");
      var profitPer = $("<div>")
        .addClass("profitPer")
        .html("Profit gained: <b>" + review.profitPer + "%</b>");

      reviewScreenshot.append(screenshotImg);
      reviewBox.append(reviewerName, reviewScreenshot, profitPer);
      $(".review-boxes").append(reviewBox);
    });
  }

  // User Testimonial carousel
  $(document).ready(function () {
    // Fetch testimonial data
    $.ajax({
      url: "https://prochart-backend-default-rtdb.asia-southeast1.firebasedatabase.app/user-review.json",
      type: "GET",
      redirect: "follow",
      success: function (response) {
        console.log(response)
        // rendertestimonials2(response)
        renderUserReviews(response)
      },
      error: function (error) {
        console.error(error);
      },
    });
  });
})(jQuery);



function renderUserReviews(reviews) {

  const reviewsContainer = document.getElementById('reviews-container');

  for (const key in reviews) {
    const review = reviews[key];

    const container = document.createElement('div');
    container.className = 'col-md-4 mb-4 mb-md-0';

    const card = document.createElement('div');
    card.className = 'card shadow-lg p-2 bg-body h-100';

    const cardBody = document.createElement('div');
    cardBody.className = 'card-body pb-4';

    const nameHeader = document.createElement('h4');
    nameHeader.className = 'font-weight-bold';
    nameHeader.textContent = review.name;

    const reviewContent = document.createElement('p');
    reviewContent.className = 'mb-2';
    reviewContent.innerHTML = `<i class="fas fa-quote-left pe-2"></i>${review.review}`;

    cardBody.appendChild(nameHeader);
    cardBody.appendChild(reviewContent);
    card.appendChild(cardBody);
    container.appendChild(card);
    reviewsContainer.appendChild(container);

  }

}

function rendertestimonials2(jsonDataArray) {
  const cardRow = document.getElementById('cardRow');

  // Loop through the JSON data array
  for (let i = 0; i < jsonDataArray.length; i++) {
    const jsonData = jsonDataArray[i];

    // Create card elements
    const colDiv = document.createElement('div');
    colDiv.classList.add('col-md-4', 'mb-4', 'mb-md-0');
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('card', 'shadow-lg', 'p-2', 'bg-body');
    const cardBodyDiv = document.createElement('div');
    cardBodyDiv.classList.add('card-body', 'pb-4');
    const nameHeading = document.createElement('h4');
    nameHeading.classList.add('font-weight-bold');
    nameHeading.textContent = jsonData.name;
    const reviewParagraph = document.createElement('p');
    reviewParagraph.classList.add('mb-2');
    reviewParagraph.textContent = jsonData.review;

    // Append card elements to the card row
    cardBodyDiv.appendChild(nameHeading);
    cardBodyDiv.appendChild(reviewParagraph);
    cardDiv.appendChild(cardBodyDiv);
    colDiv.appendChild(cardDiv);
    cardRow.appendChild(colDiv);
  }
}