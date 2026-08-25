const API_URL = "https://inventorytracker-kqco.onrender.com";


// =====================================================
// DOM READY
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const bookingForm =
        document.getElementById("bookingForm");

    const bookingMessage =
        document.getElementById("bookingMessage");


    // =================================================
    // CHECK BOOKING FORM
    // =================================================

    if (!bookingForm) {

        console.error(
            "Booking form not found"
        );

        return;
    }


    // =================================================
    // BOOKING SUBMIT
    // =================================================

    bookingForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            // =========================================
            // GET FORM DATA
            // =========================================

            const bookingData = {

                name:
                    document
                        .getElementById("name")
                        .value
                        .trim(),

                phone:
                    document
                        .getElementById("phone")
                        .value
                        .trim(),

                date:
                    document
                        .getElementById("date")
                        .value,

                time:
                    document
                        .getElementById("time")
                        .value,

                guests:
                    Number(
                        document
                            .getElementById("guests")
                            .value
                    )

            };


            // =========================================
            // VALIDATION
            // =========================================

            if (!bookingData.name) {

                bookingMessage.textContent =
                    "Please enter your name.";

                return;
            }


            if (!bookingData.phone) {

                bookingMessage.textContent =
                    "Please enter your phone number.";

                return;
            }


            if (!bookingData.date) {

                bookingMessage.textContent =
                    "Please select a date.";

                return;
            }


            if (!bookingData.time) {

                bookingMessage.textContent =
                    "Please select a time.";

                return;
            }


            if (
                !bookingData.guests ||
                bookingData.guests <= 0
            ) {

                bookingMessage.textContent =
                    "Please select number of guests.";

                return;
            }


            // =========================================
            // LOADING MESSAGE
            // =========================================

            bookingMessage.textContent =
                "Sending booking...";


            try {

                // =====================================
                // SEND REQUEST TO RENDER BACKEND
                // =====================================

                const response =
                    await fetch(
                        `${API_URL}/bookings`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    bookingData
                                )
                        }
                    );


                // =====================================
                // READ RESPONSE
                // =====================================

                const result =
                    await response.json();


                // =====================================
                // CHECK RESPONSE
                // =====================================

                if (!response.ok) {

                    throw new Error(
                        result.detail ||
                        "Booking failed"
                    );

                }


                // =====================================
                // SUCCESS
                // =====================================

                bookingMessage.textContent =
                    `Booking successful! Your booking ID is ${result.booking_id}.`;


                // Clear form
                bookingForm.reset();


            } catch (error) {

                console.error(
                    "Booking error:",
                    error
                );


                // =====================================
                // ERROR
                // =====================================

                bookingMessage.textContent =
                    "Something went wrong. Please try again.";

            }

        }
    );

});