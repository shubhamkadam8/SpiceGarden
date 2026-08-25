from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from pydantic import BaseModel

from database import (
    create_table,
    get_connection
)


# ==========================================
# PATHS
# ==========================================

BASE_DIR = Path(__file__).resolve().parent.parent

INDEX_FILE = BASE_DIR / "index.html"

ADMIN_LOGIN_FILE = (
    BASE_DIR / "admin-login.html"
)

ADMIN_FILE = (
    BASE_DIR / "admin.html"
)

ADMIN_JS_FILE = (
    BASE_DIR / "admin.js"
)

JS_FOLDER = (
    BASE_DIR / "js"
)


# ==========================================
# FASTAPI
# ==========================================

app = FastAPI(
    title="Spice Garden API",
    version="1.0.0"
)


# ==========================================
# DATABASE
# ==========================================

create_table()


# ==========================================
# STATIC FILES
# ==========================================

app.mount(
    "/js",
    StaticFiles(
        directory=JS_FOLDER
    ),
    name="js"
)


# ==========================================
# ADMIN CREDENTIALS
# ==========================================

ADMIN_USERNAME = "admin"

ADMIN_PASSWORD = "spice123"


# ==========================================
# MODELS
# ==========================================

class Booking(BaseModel):

    name: str

    phone: str

    date: str

    time: str

    guests: int


class AdminLogin(BaseModel):

    username: str

    password: str


# ==========================================
# CUSTOMER WEBSITE
# ==========================================

@app.get("/")
def home():

    return FileResponse(
        INDEX_FILE
    )


# ==========================================
# ADMIN LOGIN PAGE
# ==========================================

@app.get("/admin-login")
def admin_login_page():

    return FileResponse(
        ADMIN_LOGIN_FILE
    )


# ==========================================
# ADMIN DASHBOARD
# ==========================================

@app.get("/admin")
def admin_page():

    return FileResponse(
        ADMIN_FILE
    )


# ==========================================
# ADMIN JAVASCRIPT
# ==========================================

@app.get("/admin.js")
def admin_javascript():

    return FileResponse(
        ADMIN_JS_FILE,
        media_type="application/javascript"
    )


# ==========================================
# API TEST
# ==========================================

@app.get("/api")
def api_home():

    return {
        "message":
        "Spice Garden API is working"
    }


# ==========================================
# ADMIN LOGIN API
# ==========================================

@app.post("/admin/login")
def admin_login(
    login: AdminLogin
):

    if (
        login.username != ADMIN_USERNAME
        or
        login.password != ADMIN_PASSWORD
    ):

        raise HTTPException(
            status_code=401,
            detail="Invalid username or password"
        )

    return {

        "message":
        "Login successful",

        "access_token":
        "development-admin-token"

    }


# ==========================================
# GET BOOKINGS
# ==========================================

@app.get("/bookings")
def get_bookings():

    connection = get_connection()

    rows = connection.execute(
        """
        SELECT *
        FROM bookings
        ORDER BY id DESC
        """
    ).fetchall()

    connection.close()

    bookings = []

    for row in rows:

        bookings.append(
            dict(row)
        )

    return {
        "bookings": bookings
    }


# ==========================================
# CREATE BOOKING
# ==========================================

@app.post("/bookings")
def create_booking(
    booking: Booking
):

    connection = get_connection()

    cursor = connection.execute(
        """
        INSERT INTO bookings
        (
            name,
            phone,
            date,
            time,
            guests,
            status
        )

        VALUES (?, ?, ?, ?, ?, ?)
        """,
        (
            booking.name,
            booking.phone,
            booking.date,
            booking.time,
            booking.guests,
            "pending"
        )
    )

    connection.commit()

    booking_id = cursor.lastrowid

    connection.close()

    return {

        "message":
        "Booking saved successfully",

        "booking_id":
        booking_id

    }


# ==========================================
# CONFIRM BOOKING
# ==========================================

@app.put(
    "/bookings/{booking_id}/confirm"
)
def confirm_booking(
    booking_id: int
):

    connection = get_connection()

    cursor = connection.execute(
        """
        UPDATE bookings

        SET status = ?

        WHERE id = ?
        """,
        (
            "confirmed",
            booking_id
        )
    )

    connection.commit()

    if cursor.rowcount == 0:

        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    connection.close()

    return {

        "message":
        "Booking confirmed successfully",

        "booking_id":
        booking_id,

        "status":
        "confirmed"

    }


# ==========================================
# CANCEL BOOKING
# ==========================================

@app.put(
    "/bookings/{booking_id}/cancel"
)
def cancel_booking(
    booking_id: int
):

    connection = get_connection()

    cursor = connection.execute(
        """
        UPDATE bookings

        SET status = ?

        WHERE id = ?
        """,
        (
            "cancelled",
            booking_id
        )
    )

    connection.commit()

    if cursor.rowcount == 0:

        connection.close()

        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    connection.close()

    return {

        "message":
        "Booking cancelled successfully",

        "booking_id":
        booking_id,

        "status":
        "cancelled"

    }