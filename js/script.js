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


                const bookingData = {

                    name:
                        document.getElementById(
                            "name"
                        ).value.trim(),

                    phone:
                        document.getElementById(
                            "phone"
                        ).value.trim(),

                    date:
                        document.getElementById(
                            "date"
                        ).value,

                    time:
                        document.getElementById(
                            "time"
                        ).value,

                    guests:
                        Number(
                            document.getElementById(
                                "guests"
                            ).value
                        )

                };


                bookingMessage.textContent =
                    "Sending booking...";


                try {

                    const response =
                        await fetch(
                            "/bookings",
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


                    const result =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            result.detail ||
                            "Booking failed"
                        );

                    }


                    bookingMessage.textContent =
                        `Booking successful! Your booking ID is ${result.booking_id}.`;


                    bookingForm.reset();


                }
                catch (error) {

                    console.error(error);


                    bookingMessage.textContent =
                        "Something went wrong. Please try again.";

                }

            }
        );

    }
);