import React from "react";
import Layout from "../../../layout/Layout";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";

import { FaHome, FaClipboardList, FaInfoCircle } from "react-icons/fa"; // Icons for the tabs
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Input,
  Select,
  Option,
  Button,
} from "@material-tailwind/react";
import BASE_URL from "../../../base/BaseUrl";

const ReceivedCommissionView = () => {
  const { id } = useParams();

  const [booking, setBooking] = useState({});

  // no need check at once and remove it
  const [bookingAssign, setBookingAssign] = useState({});
  // no need check at once and remove it
  const [vendor, setVendor] = useState({});
  // new design
  const [activeTab, setActiveTab] = useState("bookingDetails");

  const fetchBookingData = async () => {
    try {
      const response = await axios({
        url: `${BASE_URL}/api/panel-fetch-booking-view-by-id/${id}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setBooking(response.data?.booking);
      console.log("set booking", response.data?.booking);
      setBookingAssign(response.data.bookingAssign);
      console.log("setbooking assign", response.data?.bookingAssign);
      setVendor(response.data.vendor);
      console.log("vendor data", response.data?.vendor);
    } catch (error) {
      console.error("Error fetching booking data:", error);
    }
  };

  useEffect(() => {
    fetchBookingData();
  }, []);

  const updateData = async (e) => {
    e.preventDefault();

    try {
      await axios({
        url: `${BASE_URL}/api/panel-update-comm-status/${id}`,
        method: "PUT",

        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Data Updated Successfully");
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Error updating payment status");
    }
  };

  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "bookingDetails":
      case "customerInfo":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            {/* Adjust to 3 columns */}
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>ID:</strong> {booking.order_ref} ({booking.order_status}
                )
              </Typography>
              <Typography className="text-black">
                <strong>Name:</strong> {booking.order_customer}
              </Typography>
              <Typography className="text-black">
                <strong>Mobile:</strong> {booking.order_customer_mobile}
              </Typography>
              <Typography className="text-black">
                <strong>Email:</strong> {booking.order_customer_email}
              </Typography>
              <Typography className="text-black">
                <strong>Booking Created By:</strong> {booking.created_by}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Date:</strong>{" "}
                {moment(booking.order_date).format("DD-MM-YYYY")}
              </Typography>
              <Typography className="text-black">
                <strong>Service Date:</strong>{" "}
                {moment(booking.order_service_date).format("DD-MM-YYYY")}
              </Typography>
              <Typography className="text-black">
                <strong>Slot Time:</strong> {booking.order_time}
              </Typography>
              <Typography className="text-black">
                <strong>Service:</strong>{" "}
                {booking.order_custom_price <= "1"
                  ? booking.order_service
                  : booking.order_custom}
              </Typography>
              <Typography className="text-black">
                <strong>Booking Confirmed By:</strong> {booking.updated_by}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Sub-service:</strong>{" "}
                {booking.order_custom_price <= "1"
                  ? booking.order_service_sub
                  : ""}
              </Typography>
              <Typography className="text-black">
                <strong>Amount:</strong> {booking?.order_payment_amount}
              </Typography>
              <Typography className="text-black">
                <strong>Type:</strong> {booking.order_payment_type}
              </Typography>
              <Typography className="text-black">
                <strong>Transaction Details:</strong>{" "}
                {booking.order_transaction_details}
              </Typography>
              <Typography className="text-black">
                <strong>Vendor:</strong> {vendor.vendor_company}
              </Typography>
              <Typography className="text-black">
                <strong>Commission:</strong> {booking.order_comm}
              </Typography>
            </div>
          </div>
        );
      case "additionalInfo":
      case "location":
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {" "}
            {/* Adjust to 3 columns */}
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Remarks:</strong> {booking.order_remarks}
              </Typography>
              <Typography className="text-black">
                <strong>Comment:</strong> {booking.order_comment}
              </Typography>
              <Typography className="text-black">
                <strong>Postpone Reason:</strong>{" "}
                {booking.order_postpone_reason}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Area:</strong> {booking.order_area}
              </Typography>
              <Typography className="text-black">
                <strong>Branch:</strong> {booking.branch_name}
              </Typography>
              <Typography className="text-black">
                <strong>Address:</strong> {booking.order_flat},{" "}
                {booking.order_building}, {booking.order_landmark},{" "}
                {booking.order_address}
              </Typography>
            </div>
            <div className="space-y-2">
              <Typography className="text-black">
                <strong>Booked Price:</strong> {booking.order_service_price_for}{" "}
                -{" "}
                {booking.order_custom_price <= "1"
                  ? booking.order_service_price
                  : booking.order_custom_price}
              </Typography>
              <Typography className="text-black">
                <strong>Current Price:</strong>{" "}
                {booking.order_service_price_for} - {booking.order_amount}
              </Typography>
              <Typography className="text-black">
                <strong>Advanced:</strong> {booking.order_advance}
              </Typography>
              <Typography className="text-black">
                <strong>Distance:</strong> {booking.order_km} Km
              </Typography>
            </div>
          </div>
        );
      default:
        return null;
    }
  };
  return (
    <Layout>
      <div className="container mx-auto p-4">
        <Typography variant="h4" color="gray" className="mb-6">
          View Received Commission
        </Typography>

        <div className="flex gap-4">
          <div className="flex-grow">
            <div className="mb-2">
              <div className="flex justify-start space-x-4 ">
                {/* Home Deep Cleaning Button */}
                <button
                  onClick={() => setActiveTab("bookingDetails")}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
                    activeTab === "bookingDetails"
                      ? "border-blue-500 bg-blue-100 text-blue-600"
                      : "border-transparent hover:bg-blue-50"
                  }`}
                >
                  <FaHome />
                  {booking?.order_service}
                </button>

                {/* Booking Overview Button */}
                <button
                  onClick={() => setActiveTab("customerInfo")}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
                    activeTab === "customerInfo"
                      ? "border-green-500 bg-green-100 text-green-600"
                      : "border-transparent hover:bg-green-50"
                  }`}
                >
                  <FaClipboardList />
                  Booking Overview
                </button>

                {/* Other Details Button */}
                <button
                  onClick={() => setActiveTab("additionalInfo")}
                  className={`flex items-center gap-2 px-4 py-2 font-semibold rounded-lg border-b-4 ${
                    activeTab === "additionalInfo"
                      ? "border-red-500 bg-red-100 text-red-600"
                      : "border-transparent hover:bg-red-50"
                  }`}
                >
                  <FaInfoCircle />
                  Other Details
                </button>
              </div>

              {/* Main Content Based on Active Tab */}
              <Card className="mt-2">
                <CardBody>{renderActiveTabContent()}</CardBody>
              </Card>
            </div>

            {/* Payment Card */}
            <Card className="mb-6">
              <CardBody>
                <form onSubmit={updateData} className="space-y-4">
                  <Button type="submit" color="blue">
                    Did Not Received Commission
                  </Button>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReceivedCommissionView;