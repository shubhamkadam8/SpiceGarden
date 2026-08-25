
// =====================================================
// SPICE GARDEN API
// =====================================================

// IMPORTANT:
// Replace this with your actual Spice Garden
// Render backend URL.
//
// Example:
// const API_URL = "https://spice-garden-api-xxxx.onrender.com";

const API_URL = "YOUR_SPICE_GARDEN_RENDER_URL";


// =====================================================
// BOOKING FORM
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const bookingForm =
            document.getElementById(
                "bookingForm"
            );

        const bookingMessage =
            document.getElementById(
                "bookingMessage"
            );


        if (!bookingForm) {

            console.error(
                "Booking form not found"
            );

            return;
        }


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
                    bookingData.guests < 1
                ) {

                    bookingMessage.textContent =
                        "Please enter number of guests.";

                    return;
                }


                // =========================================
                // MESSAGE
                // =========================================

                bookingMessage.textContent =
                    "Sending booking...";


                // =========================================
                // SEND TO FASTAPI
                // =========================================

                try {

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
                    // ERROR
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


                    bookingForm.reset();


                } catch (error) {

                    console.error(
                        "Booking error:",
                        error
                    );


                    bookingMessage.textContent =
                        "Something went wrong. Please try again.";
                }

            }
        );

    }
);
