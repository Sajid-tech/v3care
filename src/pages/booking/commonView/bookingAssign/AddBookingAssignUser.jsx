import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Layout from "../../../../layout/Layout";
import BookingFilter from "../../../../components/BookingFilter";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import { MdArrowBack, MdSend } from "react-icons/md";
import axios from "axios";
import {BASE_URL} from "../../../../base/BaseUrl";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { toast } from "react-toastify";
import UseEscapeKey from "../../../../utils/UseEscapeKey";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";
const AddBookingAssignUser = () => {
  const { id } = useParams();

  const [bookingUser, setBookingser] = useState({
    order_user_id: "",
    order_start_time: "",
    order_end_time: "",
    order_assign_remarks: "",
    order_id: id,
  });
  const navigate = useNavigate();
  UseEscapeKey();
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  // Validation function
  const [loading, setLoading] = useState(false);

  const onInputChange = (e) => {
    setBookingser({
      ...bookingUser,
      [e.target.name]: e.target.value,
    });
  };
  const [assisgnUserP, setAssignUserP] = useState([]);
  useEffect(() => {
    var theLoginToken = localStorage.getItem("token");

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: "Bearer " + theLoginToken,
      },
    };

    fetch(
      BASE_URL + "/api/panel-fetch-user-for-booking-assign/" + id,
      requestOptions
    )
      .then((response) => response.json())
      .then((data) => setAssignUserP(data.bookingAssignUser));
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const form = document.getElementById("addIndiv");
    if (!form.checkValidity()) {
      toast.error("Fill all required");
      setLoading(false); // Corrected this
      return;
    }

    setIsButtonDisabled(true);

    const data = {
      order_user_id: bookingUser.order_user_id,
      order_start_time: bookingUser.order_start_time,
      order_end_time: bookingUser.order_end_time,
      order_assign_remarks: bookingUser.order_assign_remarks,
      order_id: id,
    };

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        `${BASE_URL}/api/panel-create-booking-assign`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code == "200") {
        toast.success(response.data?.msg || "Booking User Created Successfully");
        navigate(`/booking-assign/${id}`);
      } else {
        toast.error(response.data?.msg || "Duplicate entry");
      }
    } catch (error) {
      console.error("Error creating booking:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      setIsButtonDisabled(false);
    }
  };

  return (
    <Layout>
      <BookingFilter />

      <PageHeader title={"Create Booking User"} />
      <div className="w-full mt-5 mx-auto p-8 bg-white shadow-lg rounded-xl">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {/* Service Field */}
            <div className="form-group">
              <FormControl fullWidth>
                <InputLabel id="service-select-label">
                  <span className="text-sm relative bottom-[6px]">
                    Assign User <span className="text-red-700">*</span>
                  </span>
                </InputLabel>
                <Select
                  sx={{ height: "40px", borderRadius: "5px" }}
                  labelId="service-select-label"
                  id="service-select"
                  name="order_user_id"
                  value={bookingUser.order_user_id}
                  onChange={(e) => onInputChange(e)}
                  label="Assign User *"
                  required
                >
                  {assisgnUserP.map((data) => (
                    <MenuItem key={data.id} value={data.id}>
                      {data.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* Service Commission Field */}
            <div className="form-group">
              <Input
                label="Remark"
                name="order_assign_remarks"
                value={bookingUser.order_assign_remarks}
                onChange={(e) => onInputChange(e)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none  transition-all duration-300 shadow-sm"
              />
            </div>
          </div>
          {/* 
          <div className="flex justify-center space-x-4">
            <Button type="submit" className="mr-2 mb-2 bg-black">
              <div className="flex gap-1">
                <MdSend className="w-4 h-4" />
                <span>Submit</span>
              </div>
            </Button>

            <Link to={`/booking-assign/${id}`}>
              <Button className="mr-2 mb-2 bg-black">
                <div className="flex gap-1">
                  <MdArrowBack className="w-4 h-4" />
                  <span>Back</span>
                </div>
              </Button>
            </Link>
          </div> */}

          <div className="flex justify-center space-x-4">
            <ButtonConfigColor
              type="submit"
              buttontype="submit"
              label="Submit"
              disabled={isButtonDisabled}
              loading={loading}
            />

            <ButtonConfigColor
              type="back"
              buttontype="button"
              label="Cancel"
              onClick={() => navigate(-1)}
            />
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default AddBookingAssignUser;
