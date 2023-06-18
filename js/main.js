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
        // Process and render testimonials
        renderTestimonials(response);
      },
      error: function (error) {
        console.error(error);
      },
    });

    // Function to render testimonials
    function renderTestimonials(testimonials) {
      var carouselInner = $("#user-testimonials");

      const reviews = [];
      for (const key in testimonials) {
        reviews.push({
          id: key,
          ...testimonials[key],
        });
      }

      // Iterate through testimonials
      $.each(reviews, function (index, testimonial) {
        var isActive = index === 0 ? "active" : "";
        // Create testimonial item
        var testimonialItem = $("<div></div>").addClass(
          "testimonial-item text-center carousel-item " + isActive
        );

        // Create testimonial name
        var name = $("<h5></h5>").addClass("mb-0").text(testimonial["name"]);

        // Create testimonial text
        var testimonialText = $("<div></div>")
          .addClass("testimonial-text bg-light text-center p-2")
          .append($("<p></p>").addClass("mb-0").text(testimonial["review"]));

        // Append name and testimonial text to testimonial item
        testimonialItem.append(name, testimonialText);

        // Append testimonial item to carousel inner
        carouselInner.append(testimonialItem);
      });
    }
  });
})(jQuery);
