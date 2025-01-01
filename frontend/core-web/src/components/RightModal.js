import { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import "./RightModal.css";
import { Button, ProgressBar } from "react-bootstrap";
import BookingModal from "./BookingModal";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "./PeopleIcon";
import dayjs from "dayjs";
import { useUser } from "../UserContext";
import MoreInfoPopUp from "./MoreInfoPopUp";
import ThumbUpRoundedIcon from "@mui/icons-material/ThumbUpRounded";
import RecentFeedback from "./RecentFeedback";
import FeedbackModal from "./FeedbackModal";
import api from "../utility/api";
import { useFeedbackLocation } from "../FeedbackLocationContext";

export default function RightModal({
  date,
  feature,
  setFeature,
  show,
  navigation,
  didDismissRModal,
}) {
  const [modalShow, setModalShow] = useState(false);
  const [bookingsArr, setBookingsArr] = useState(
    feature.bookings ? feature.bookings : []
  );
  const [interestedFeedback, setInterestedFeedback] = useState();
  const [feedbackArr, setFeedbackArr] = useState([]);
  const { getToken } = useUser();
  const { feedbackLocation, setFeedbackLocation } = useFeedbackLocation();

  const MockFeedbackData = [
    {
      title: "There is a beehive in the tree",
      description: "what the fuck there is a beehive in the tree",
    },
  ];

  useEffect(() => {
    setInterestedFeedback();
    setFeedbackLocation();
    api
      .queryFeedbackData(feature.id, dayjs(date).format("YYYY-MM-DD"))
      .then((data) => {
        console.log("this is the data: ", data);
        setFeedbackArr(data);
      });
  }, [feature, date]);

  function didClickFeedback(feedback) {
    if (feedback.coords) {
      setFeedbackLocation(feedback.coords);
    }
    setInterestedFeedback(feedback);
  }

  function sortDatesAscending(bookingList) {
    return bookingList.sort((a, b) => {
      // Convert date strings to Date objects for comparison
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Compare the two dates
      return dateA - dateB;
    });
  }

  function calculateCleanValue(score) {
    return 100 - Math.floor((score / 4000) * 100);
  }

  function findDatesWithinRange(inputDate, bookings) {
    if (!bookings) return [];

    const targetDate = new Date(inputDate);
    const threeDays = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds

    return sortDatesAscending(
      bookings.filter((booking) => {
        const currentDate = new Date(booking.date);
        // Calculate the absolute difference in milliseconds
        const diff = Math.abs(currentDate - targetDate);
        // Check if the difference is less than or equal to 3 days
        return diff <= threeDays;
      })
    );
  }

  useEffect(() => {
    setBookingsArr(findDatesWithinRange(date, feature.bookings));
  }, [feature, date]);

  function didPressBook() {
    setModalShow(true);
  }

  return (
    <>
      <BookingModal
        show={modalShow}
        setShow={setModalShow}
        navigation={navigation}
        feature={feature}
        setFeature={setFeature}
        bookingsArr={bookingsArr}
        date={date}
      />
      <Offcanvas
        show={show}
        placement="end"
        name="end"
        key="1"
        backdrop={false}
        style={{ width: "500px" }}
        className="offcanvas "
      >
        <Offcanvas.Body>
          <div className="right-modal-container">
            <Button
              className="right-modal-container-dismiss"
              onClick={() => {
                !interestedFeedback && didDismissRModal();
                setInterestedFeedback();
                setFeedbackLocation();
              }}
            >
              <CloseIcon className="h-10 w-10" />
            </Button>
            {interestedFeedback ? (
              <FeedbackModal
                feedback={interestedFeedback}
                currentLocation={feature}
              />
            ) : (
              <>
                <h1 className="text-4xl font-medium mb-4 mr-5 text-[#828282]">
                  Choosing a Cleanup
                </h1>
                <h1 className="text-5xl font-medium mb-4 mr-5">
                  {feature.name}
                </h1>
                <text className="mb-3 text-lg">
                  {"Cleanliness Score: " +
                    calculateCleanValue(feature.cleanliness_score) +
                    "/100"}
                </text>
                <ProgressBar
                  className="w-full h-6 rounded-full bg-[#E8E8E8] mb-10"
                  variant={
                    calculateCleanValue(feature.cleanliness_score) < 33
                      ? "danger"
                      : calculateCleanValue(feature.cleanliness_score) < 66
                      ? "warning"
                      : "success"
                  }
                  now={calculateCleanValue(feature.cleanliness_score)}
                />
                <h1 className="text-3xl font-normal mb-2">
                  Upcoming and Past Bookings
                </h1>
                {bookingsArr && bookingsArr.length > 0 ? (
                  <p className="text-[#00000090] text-lg mb-3 border-b-2 border-b-[#00000020] w-full pb-2">
                    {"Showing +/- 3 Days from  " +
                      dayjs(date).format("DD MMMM")}
                  </p>
                ) : (
                  <p className="text-[#000000] text-lg mb-3 border-b-2 border-b-[#00000020] w-full pb-3">
                    <ThumbUpRoundedIcon className="mr-3 text-[#3f8bce]" />
                    {"No other bookings +/- 3 Days from  " +
                      dayjs(date).format("DD MMMM")}
                  </p>
                )}
                <div className="badge-list-container">
                  {bookingsArr &&
                    bookingsArr.map((booking) => (
                      <div className="badge-container">
                        <div>{dayjs(booking.date).format("DD MMMM")}</div>
                        <text>
                          {dayjs("2021-01-01" + booking.start_time).format(
                            "hh:mm A"
                          ) +
                            " - " +
                            dayjs("2021-01-01" + booking.end_time).format(
                              "hh:mm A"
                            )}
                        </text>
                        <div>
                          <PeopleIcon />
                          <text>{booking.est_volunteers}</text>
                        </div>
                      </div>
                    ))}
                </div>
                <h1 className="w-full text-3xl font-normal mb-3 mt-5 border-b-2 border-b-[#00000020] pb-2">
                  Recent Feedback{" "}
                  <MoreInfoPopUp
                    message={"Submitted by volunteers from previous cleanups."}
                  />{" "}
                </h1>
                {feedbackArr && (
                  <RecentFeedback
                    feedbackArr={feedbackArr}
                    didClickFeedback={didClickFeedback}
                  />
                )}
                <Button
                  disabled={getToken() == ""}
                  onClick={didPressBook}
                  className="w-[90%] bg-[#0D3B66] justify-self-end absolute bottom-2 h-16 text-[25px] font-extrabold"
                >
                  Book
                </Button>
              </>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
}
