import React from "react";
import Rating from "@material-ui/lab/Rating";

function renderReview(review, index) {
  return (
    <div className="testimonial-box">
      <div className="box-top">
        <div className="profile">
          <div className="user-name">
            <strong> {review.name} </strong>
          </div>
        </div>
        <Rating value={review.rating} readOnly />
      </div>
      <div className="client-comments">
        <p> {review.comment} </p>
      </div>
    </div>
  );
}

function Reviews(props) {
  if (props.reviews === undefined) return null;
  console.log(props.reviews);
  return (
    <div className="testimonial-box-container">
      {props.reviews.map((review) => {
        return review.approved ? renderReview(review) : <div />;
      })}
    </div>
  );
}

export default Reviews;
