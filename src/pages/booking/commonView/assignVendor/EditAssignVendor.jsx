import React, { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Layout from "../../../../layout/Layout";
import BookingFilter from "../../../../components/BookingFilter";
import { useState } from "react";
import { MdUpdate } from "react-icons/md";
import { Button, TextField } from "@mui/material";

import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import {BASE_URL} from "../../../../base/BaseUrl";
import axios from "axios";
import { ContextPanel } from "../../../../utils/ContextPanel";
import { Input } from "@material-tailwind/react";
import { toast } from "react-toastify";
import UseEscapeKey from "../../../../utils/UseEscapeKey";
import PageHeader from "../../../../components/common/PageHeader/PageHeader";
import ButtonConfigColor from "../../../../components/common/ButtonConfig/ButtonConfigColor";
const EditAssignVendor = () => {
  const { id } = useParams();
  UseEscapeKey();
  const [bookingUser, setBookingUser] = useState({
    order_user_id: "",
    order_start_time: "",
    order_end_time: "",
    order_assign_remarks: "",
    order_assign_status: "",
  });

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [assignUserP, setAssignUserP] = useState([]);

  const [loading, setLoading] = useState(false);
  const { isPanelUp } = useContext(ContextPanel);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodayData = async () => {
      try {
        if (!isPanelUp) {
          navigate("/maintenance");
          return;
        }
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-booking-assign-vendor-by-id/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setBookingUser(response.data?.bookingAssign);
        setAssignUserP(response.data?.bookingAssignUser);
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };
    fetchTodayData();
  }, []);

  const status = [
    {
      value: "Pending",
      label: "Pending",
    },
    {
      value: "Confirmed",
      label: "Confirmed",
    },
    {
      value: "Finish",
      label: "Finish",
    },
    {
      value: "Cancel",
      label: "Cancel",
    },
  ];

  const onInputChange = (e) => {
    setBookingUser({
      ...bookingUser,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    let data = {
      order_user_id: bookingUser.order_user_id,
      order_start_time: bookingUser.order_start_time,
      order_end_time: bookingUser.order_end_time,
      order_assign_remarks: bookingUser.order_assign_remarks,
      order_assign_status: bookingUser.order_assign_status,
    };

    try {
      const token = localStorage.getItem('token')
      const response = await axios.put(
        `${BASE_URL}/api/panel-update-booking-assign-vendor/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code == "200") {
        toast.success(response.data?.msg || "Assign Vendor Updated Successfully");
        navigate(-1);
      } else {
        toast.error(response.data?.msg || "Failed to update Assign Vendor");
      }
    } catch (error) {
      toast.error("An error occurred while updating");
      console.error("An error occurred while updating",error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <BookingFilter />
      <PageHeader title={"Edit Booking Assign Vendor"} />

      <div className=" border border-gray-300 bg-white p-6 rounded-lg shadow-lg mt-2">
        <form id="addIndiv" autoComplete="off" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {/* Assign User */}
            <div className="col-span-1">
              <div className="form-group">
                <FormControl fullWidth>
                  <InputLabel id="service-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Assign Vendor <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="service-select-label"
                    id="service-select"
                    name="order_user_id"
                    value={bookingUser.order_user_id}
                    onChange={onInputChange}
                    label="Assign Vendor *"
                    required
                  >
                    {assignUserP.map((data) => (
                      <MenuItem key={data.id} value={data.id}>
                        {data.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Status */}
            <div className="col-span-1">
              <div className="form-group">
                <FormControl fullWidth>
                  <InputLabel id="service-select-label">
                    <span className="text-sm relative bottom-[6px]">
                      Status <span className="text-red-700">*</span>
                    </span>
                  </InputLabel>
                  <Select
                    sx={{ height: "40px", borderRadius: "5px" }}
                    labelId="service-select-label"
                    id="service-select"
                    name="order_assign_status"
                    value={bookingUser.order_assign_status}
                    onChange={onInputChange}
                    label="Status *"
                    required
                  >
                    {status.map((data) => (
                      <MenuItem key={data.value} value={data.value}>
                        {data.value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>

            {/* Remarks */}
            <div className="col-span-2">
              <div className="form-group">
                <Input
                  id="remarks"
                  label="Remarks"
                  multiline
                  name="order_assign_remarks"
                  value={bookingUser.order_assign_remarks}
                  onChange={onInputChange}
                  fullWidth
                  className="bg-gray-100 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* <div className="mt-6 text-center bg-blue-400  w-48 rounded-lg  ">
            <button
              className=" p-1 text-center   mb-2 text-white"
              type="submit"
            
            >
              Update
            </button>
          </div> */}
          <div className="flex justify-center space-x-4 my-2">
            <ButtonConfigColor
              type="edit"
              buttontype="submit"
              label="Update"
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

export default EditAssignVendor;
