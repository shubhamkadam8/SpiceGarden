const API_URL = "https://your-spice-garden-api.onrender.com";
document.addEventListener(
    "DOMContentLoaded",
    function () {


        // ==========================================
        // LOGIN CHECK
        // ==========================================

        const token =
            localStorage.getItem(
                "admin_token"
            );


        if (!token) {

            window.location.href =
                "/admin-login";

            return;
        }


        // ==========================================
        // LOGOUT
        // ==========================================

        const logoutButton =
            document.getElementById(
                "logoutButton"
            );


        logoutButton.addEventListener(
            "click",
            function () {

                localStorage.removeItem(
                    "admin_token"
                );

                window.location.href =
                    "/admin-login";

            }
        );


        // ==========================================
        // ELEMENTS
        // ==========================================

        const tableBody =
            document.getElementById(
                "bookingTableBody"
            );


        const loading =
            document.getElementById(
                "loading"
            );


        const emptyMessage =
            document.getElementById(
                "emptyMessage"
            );


        const searchInput =
            document.getElementById(
                "searchInput"
            );


        const filterButtons =
            document.querySelectorAll(
                ".filter-btn"
            );


        let bookings = [];

        let currentFilter = "all";


        // ==========================================
        // LOAD BOOKINGS
        // ==========================================

        async function loadBookings() {

            loading.style.display =
                "block";


            try {

                const response =
                    await fetch(
                        "/bookings"
                    );


                if (!response.ok) {

                    throw new Error(
                        "Failed to load bookings"
                    );

                }


                const data =
                    await response.json();


                bookings =
                    data.bookings || [];


                updateStatistics();

                displayBookings();


            }
            catch (error) {

                console.error(error);

                tableBody.innerHTML = "";

                emptyMessage.textContent =
                    "Could not load bookings.";

                emptyMessage.style.display =
                    "block";

            }
            finally {

                loading.style.display =
                    "none";

            }

        }


        // ==========================================
        // STATISTICS
        // ==========================================

        function updateStatistics() {

            const today =
                new Date()
                    .toLocaleDateString(
                        "en-CA"
                    );


            const total =
                bookings.length;


            const todayCount =
                bookings.filter(
                    booking =>
                        booking.date === today
                ).length;


            const pending =
                bookings.filter(
                    booking =>
                        booking.status ===
                        "pending"
                ).length;


            const confirmed =
                bookings.filter(
                    booking =>
                        booking.status ===
                        "confirmed"
                ).length;


            const cancelled =
                bookings.filter(
                    booking =>
                        booking.status ===
                        "cancelled"
                ).length;


            document.getElementById(
                "totalBookings"
            ).textContent = total;


            document.getElementById(
                "todayBookings"
            ).textContent =
                todayCount;


            document.getElementById(
                "pendingBookings"
            ).textContent =
                pending;


            document.getElementById(
                "confirmedBookings"
            ).textContent =
                confirmed;


            document.getElementById(
                "cancelledBookings"
            ).textContent =
                cancelled;

        }


        // ==========================================
        // DISPLAY BOOKINGS
        // ==========================================

        function displayBookings() {

            const search =
                searchInput.value
                    .toLowerCase()
                    .trim();


            const today =
                new Date()
                    .toLocaleDateString(
                        "en-CA"
                    );


            const filtered =
                bookings.filter(
                    booking => {


                        const name =
                            String(
                                booking.name
                            ).toLowerCase();


                        const phone =
                            String(
                                booking.phone
                            ).toLowerCase();


                        const matchesSearch =
                            name.includes(search)
                            ||
                            phone.includes(search);


                        let matchesFilter =
                            true;


                        if (
                            currentFilter ===
                            "today"
                        ) {

                            matchesFilter =
                                booking.date ===
                                today;

                        }


                        if (
                            currentFilter ===
                            "pending"
                        ) {

                            matchesFilter =
                                booking.status ===
                                "pending";

                        }


                        if (
                            currentFilter ===
                            "confirmed"
                        ) {

                            matchesFilter =
                                booking.status ===
                                "confirmed";

                        }


                        if (
                            currentFilter ===
                            "cancelled"
                        ) {

                            matchesFilter =
                                booking.status ===
                                "cancelled";

                        }


                        return (
                            matchesSearch &&
                            matchesFilter
                        );

                    }
                );


            tableBody.innerHTML = "";


            if (
                filtered.length === 0
            ) {

                emptyMessage.style.display =
                    "block";

                return;

            }


            emptyMessage.style.display =
                "none";


            filtered.forEach(
                booking => {


                    const row =
                        document.createElement(
                            "tr"
                        );


                    const status =
                        booking.status ||
                        "pending";


                    let actions = "";


                    if (
                        status ===
                        "pending"
                    ) {

                        actions = `

                            <button
                                class="action-btn confirm-btn"
                                onclick="confirmBooking(${booking.id})">

                                Confirm

                            </button>

                            <button
                                class="action-btn cancel-btn"
                                onclick="cancelBooking(${booking.id})">

                                Cancel

                            </button>

                        `;

                    }


                    else if (
                        status ===
                        "confirmed"
                    ) {

                        actions = `

                            <button
                                class="action-btn cancel-btn"
                                onclick="cancelBooking(${booking.id})">

                                Cancel

                            </button>

                        `;

                    }


                    else {

                        actions =
                            "No actions";

                    }


                    row.innerHTML = `

                        <td>
                            ${booking.id}
                        </td>

                        <td>
                            ${escapeHTML(
                                booking.name
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                booking.phone
                            )}
                        </td>

                        <td>
                            ${booking.date}
                        </td>

                        <td>
                            ${booking.time}
                        </td>

                        <td>
                            ${booking.guests}
                        </td>

                        <td>

                            <span
                                class="status ${status}">

                                ${status}

                            </span>

                        </td>

                        <td>
                            ${actions}
                        </td>

                    `;


                    tableBody.appendChild(
                        row
                    );

                }
            );

        }


        // ==========================================
        // SEARCH
        // ==========================================

        searchInput.addEventListener(
            "input",
            displayBookings
        );


        // ==========================================
        // FILTER
        // ==========================================

        filterButtons.forEach(
            button => {

                button.addEventListener(
                    "click",
                    function () {


                        filterButtons.forEach(
                            item =>
                                item.classList
                                    .remove(
                                        "active"
                                    )
                        );


                        this.classList.add(
                            "active"
                        );


                        currentFilter =
                            this.dataset.filter;


                        displayBookings();

                    }
                );

            }
        );


        // ==========================================
        // HTML ESCAPE
        // ==========================================

        function escapeHTML(value) {

            return String(value)

                .replace(
                    /&/g,
                    "&amp;"
                )

                .replace(
                    /</g,
                    "&lt;"
                )

                .replace(
                    />/g,
                    "&gt;"
                )

                .replace(
                    /"/g,
                    "&quot;"
                )

                .replace(
                    /'/g,
                    "&#039;"
                );

        }


        // ==========================================
        // START
        // ==========================================

        loadBookings();

    }
);


// ==========================================
// CONFIRM
// ==========================================

async function confirmBooking(id) {

    try {

        const response =
            await fetch(
                `/bookings/${id}/confirm`,
                {
                    method: "PUT"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Confirm failed"
            );

        }


        alert(
            "Booking confirmed successfully!"
        );


        window.location.reload();

    }
    catch (error) {

        console.error(error);

        alert(
            "Failed to confirm booking."
        );

    }

}


// ==========================================
// CANCEL
// ==========================================

async function cancelBooking(id) {

    const answer =
        confirm(
            "Are you sure you want to cancel this booking?"
        );


    if (!answer) {

        return;
    }


    try {

        const response =
            await fetch(
                `/bookings/${id}/cancel`,
                {
                    method: "PUT"
                }
            );


        const result =
            await response.json();


        if (!response.ok) {

            throw new Error(
                result.detail ||
                "Cancel failed"
            );

        }


        alert(
            "Booking cancelled successfully!"
        );


        window.location.reload();

    }
    catch (error) {

        console.error(error);

        alert(
            "Failed to cancel booking."
        );

    }

}